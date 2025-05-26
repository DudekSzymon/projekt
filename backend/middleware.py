# backend/middleware.py
from fastapi import Request, Response, HTTPException
from fastapi.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse
import time
import logging
import jwt
from datetime import datetime
import json

# Konfiguracja
SECRET_KEY = "spellbudex_secret_key_2025"
ALGORITHM = "HS256"

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware do obsługi autoryzacji i logowania requestów
    """
    
    # Ścieżki które nie wymagają autoryzacji
    PUBLIC_PATHS = {
        "/",
        "/docs",
        "/openapi.json",
        "/api/auth/register",
        "/api/auth/login",
        "/api/equipment",  # Publiczny dostęp do sprzętu
        "/api/seed-data",  # Inicjalizacja danych
    }
    
    # Ścieżki które wymagają uprawnień admin
    ADMIN_PATHS = {
        "/api/statistics",
        "/api/reservations",  # Admin może widzieć wszystkie rezerwacje
    }
    
    async def dispatch(self, request: Request, call_next):
        # Rozpocznij pomiar czasu
        start_time = time.time()
        
        # Loguj incoming request
        logger.info(f"🔄 {request.method} {request.url.path} - {request.client.host}")
        
        # Sprawdź autoryzację
        auth_result = await self.check_authorization(request)
        if auth_result:
            return auth_result
        
        try:
            # Wykonaj request
            response = await call_next(request)
            
            # Oblicz czas wykonania
            process_time = time.time() - start_time
            
            # Dodaj custom headers
            response.headers["X-Process-Time"] = str(process_time)
            response.headers["X-SpellBudex-API"] = "v1.0"
            response.headers["X-Request-ID"] = f"req_{int(time.time())}"
            
            # Loguj response
            status_emoji = "✅" if response.status_code < 400 else "❌"
            logger.info(f"{status_emoji} {request.method} {request.url.path} - {response.status_code} ({process_time:.3f}s)")
            
            return response
            
        except Exception as e:
            # Obsłuż błędy
            process_time = time.time() - start_time
            logger.error(f"💥 {request.method} {request.url.path} - ERROR: {str(e)} ({process_time:.3f}s)")
            
            return JSONResponse(
                status_code=500,
                content={"detail": "Wewnętrzny błąd serwera", "error": str(e)}
            )
    
    async def check_authorization(self, request: Request):
        """Sprawdź autoryzację użytkownika"""
        path = request.url.path
        method = request.method
        
        # Pomiń sprawdzanie dla publicznych ścieżek
        if path in self.PUBLIC_PATHS:
            return None
        
        # Pomiń sprawdzanie dla ścieżek zaczynających się od publicznych
        if any(path.startswith(public_path) for public_path in ["/docs", "/openapi"]):
            return None
        
        # Sprawdź czy ścieżka wymaga autoryzacji
        if path.startswith("/api/"):
            # Pobierz token z nagłówka
            authorization = request.headers.get("Authorization")
            if not authorization or not authorization.startswith("Bearer "):
                logger.warning(f"🔒 Brak tokenu dla {path}")
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Brak tokenu autoryzacji"}
                )
            
            token = authorization.split(" ")[1]
            
            try:
                # Zdekoduj token
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                email = payload.get("sub")
                
                if not email:
                    logger.warning(f"🔒 Nieprawidłowy token dla {path}")
                    return JSONResponse(
                        status_code=401,
                        content={"detail": "Nieprawidłowy token"}
                    )
                
                # Dodaj dane użytkownika do request state
                request.state.user_email = email
                
                # Sprawdź uprawnienia admin dla określonych ścieżek
                if self.requires_admin(path, method):
                    # Tu powinieneś sprawdzić w bazie czy użytkownik to admin
                    # Na razie zakładamy że jest, ale w produkcji zrób query do DB
                    if email != "admin@spellbudex.pl":  # Tymczasowe rozwiązanie
                        logger.warning(f"🚫 Brak uprawnień admin dla {email} na {path}")
                        return JSONResponse(
                            status_code=403,
                            content={"detail": "Brak uprawnień administratora"}
                        )
                
                logger.info(f"🔓 Autoryzacja OK: {email} -> {path}")
                return None
                
            except jwt.ExpiredSignatureError:
                logger.warning(f"⏰ Token wygasł dla {path}")
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Token wygasł"}
                )
            except jwt.InvalidTokenError:
                logger.warning(f"🔒 Nieprawidłowy token dla {path}")
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Nieprawidłowy token"}
                )
        
        return None
    
    def requires_admin(self, path: str, method: str) -> bool:
        """Sprawdź czy ścieżka wymaga uprawnień admin"""
        
        # Ścieżki zawsze wymagające admin
        if any(path.startswith(admin_path) for admin_path in self.ADMIN_PATHS):
            return True
        
        # POST/PUT/DELETE na sprzęcie wymaga admin
        if path.startswith("/api/equipment") and method in ["POST", "PUT", "DELETE"]:
            return True
        
        # Zarządzanie statusem rezerwacji wymaga admin
        if "/status" in path and method == "PUT":
            return True
        
        return False


class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Middleware bezpieczeństwa - dodaje nagłówki bezpieczeństwa
    """
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Dodaj nagłówki bezpieczeństwa
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        # Usuń nagłówki które mogą ujawnić informacje o serwerze
        response.headers.pop("Server", None)
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Prosty rate limiting middleware
    """
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls  # Maksymalna liczba requestów
        self.period = period  # Okres w sekundach
        self.clients = {}  # Przechowuje dane o klientach
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Wyczyść stare rekordy
        self.cleanup_old_records(current_time)
        
        # Sprawdź rate limit dla klienta
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        
        client_requests = self.clients[client_ip]
        
        # Usuń stare requesty dla tego klienta
        client_requests[:] = [req_time for req_time in client_requests 
                            if current_time - req_time < self.period]
        
        # Sprawdź czy przekroczył limit
        if len(client_requests) >= self.calls:
            logger.warning(f"🚨 Rate limit exceeded dla {client_ip}")
            return JSONResponse(
                status_code=429,
                content={"detail": "Zbyt wiele requestów. Spróbuj ponownie za chwilę."}
            )
        
        # Dodaj obecny request
        client_requests.append(current_time)
        
        # Wykonaj request
        response = await call_next(request)
        
        # Dodaj nagłówki rate limit
        remaining = self.calls - len(client_requests)
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(current_time + self.period))
        
        return response
    
    def cleanup_old_records(self, current_time):
        """Usuń stare rekordy żeby zaoszczędzić pamięć"""
        cutoff_time = current_time - self.period
        for client_ip in list(self.clients.keys()):
            self.clients[client_ip] = [req_time for req_time in self.clients[client_ip] 
                                     if req_time > cutoff_time]
            if not self.clients[client_ip]:
                del self.clients[client_ip]


class CORSMiddleware(BaseHTTPMiddleware):
    """
    Custom CORS middleware z większą kontrolą
    """
    
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # Dla dev
        "https://spellbudex.vercel.app",  # Dla produkcji
    ]
    
    async def dispatch(self, request: Request, call_next):
        # Obsłuż preflight requests
        if request.method == "OPTIONS":
            response = Response()
            return self.add_cors_headers(response, request)
        
        # Wykonaj normalny request
        response = await call_next(request)
        
        # Dodaj CORS headers
        return self.add_cors_headers(response, request)
    
    def add_cors_headers(self, response: Response, request: Request):
        origin = request.headers.get("Origin")
        
        # Sprawdź czy origin jest dozwolony
        if origin in self.ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            # W development pozwól na wszystko localhost
            if origin and ("localhost" in origin or "127.0.0.1" in origin):
                response.headers["Access-Control-Allow-Origin"] = origin
        
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, X-Requested-With"
        response.headers["Access-Control-Max-Age"] = "86400"  # 24 godziny
        
        return response