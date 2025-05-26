# ===== main.py =====
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional
from datetime import datetime, timedelta, date
import jwt
import bcrypt
import os
from contextlib import contextmanager

# Konfiguracja
SECRET_KEY = os.getenv("SECRET_KEY", "spellbudex_secret_key_2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./spellbudex.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI(
    title="SpellBudex API",
    description="API dla wypożyczalni sprzętu budowlanego SpellBudex",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# ===== DATABASE MODELS =====

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    company = Column(String)
    nip = Column(String)
    address = Column(Text)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reservations = relationship("Reservation", back_populates="customer")

class Equipment(Base):
    __tablename__ = "equipment"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    daily_rate = Column(Float)
    status = Column(String, default="available")  # available, rented, maintenance
    description = Column(Text)
    weight = Column(String)
    fuel_type = Column(String)
    power = Column(String)
    reach = Column(String)
    image_url = Column(String)
    features = Column(Text)  # JSON string
    specifications = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reservations = relationship("Reservation", back_populates="equipment")

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    customer_id = Column(Integer, ForeignKey("users.id"))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    total_cost = Column(Float)
    status = Column(String, default="pending")  # pending, active, completed, cancelled
    contract_number = Column(String, unique=True)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    equipment = relationship("Equipment", back_populates="reservations")
    customer = relationship("User", back_populates="reservations")

# Create tables
Base.metadata.create_all(bind=engine)

# ===== PYDANTIC MODELS =====

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: str
    nip: str
    address: str
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Hasło musi mieć co najmniej 8 znaków')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    company: str
    nip: str
    address: str
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class EquipmentCreate(BaseModel):
    name: str
    category: str
    daily_rate: float
    description: str
    weight: str
    fuel_type: str
    power: str
    reach: str
    image_url: Optional[str] = None
    features: List[str] = []
    specifications: dict = {}

class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    daily_rate: Optional[float] = None
    status: Optional[str] = None
    description: Optional[str] = None
    weight: Optional[str] = None
    fuel_type: Optional[str] = None
    power: Optional[str] = None
    reach: Optional[str] = None
    image_url: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[dict] = None

class EquipmentResponse(BaseModel):
    id: int
    name: str
    category: str
    daily_rate: float
    status: str
    description: str
    weight: str
    fuel_type: str
    power: str
    reach: str
    image_url: Optional[str] = None
    features: List[str] = []
    specifications: dict = {}
    available: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ReservationCreate(BaseModel):
    equipment_id: int
    start_date: date
    end_date: date
    notes: Optional[str] = None

class ReservationResponse(BaseModel):
    id: int
    equipment_id: int
    customer_id: int
    start_date: datetime
    end_date: datetime
    total_cost: float
    status: str
    contract_number: str
    notes: Optional[str] = None
    created_at: datetime
    equipment: EquipmentResponse
    customer: UserResponse
    
    class Config:
        from_attributes = True

# ===== HELPER FUNCTIONS =====

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def generate_contract_number() -> str:
    return f"SB/{datetime.now().year}/{datetime.now().strftime('%m%d%H%M%S')}"

import json

def serialize_features(features: List[str]) -> str:
    return json.dumps(features) if features else "[]"

def deserialize_features(features_str: str) -> List[str]:
    try:
        return json.loads(features_str) if features_str else []
    except:
        return []

def serialize_specifications(specs: dict) -> str:
    return json.dumps(specs) if specs else "{}"

def deserialize_specifications(specs_str: str) -> dict:
    try:
        return json.loads(specs_str) if specs_str else {}
    except:
        return {}

# ===== API ENDPOINTS =====

@app.get("/")
async def root():
    return {"message": "SpellBudex API - Wypożyczalnia Sprzętu Budowlanego"}

# ===== AUTH ENDPOINTS =====

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email już jest zarejestrowany")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        company=user_data.company,
        nip=user_data.nip,
        address=user_data.address,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/api/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Nieprawidłowy email lub hasło")
    
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Konto zostało dezaktywowane")
    
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# ===== EQUIPMENT ENDPOINTS =====

@app.get("/api/equipment", response_model=List[EquipmentResponse])
async def get_equipment(
    category: Optional[str] = None,
    status: Optional[str] = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Equipment)
    
    if category and category != "Wszystkie":
        query = query.filter(Equipment.category == category)
    
    if status:
        query = query.filter(Equipment.status == status)
        
    if available_only:
        query = query.filter(Equipment.status == "available")
    
    equipment_list = query.all()
    
    # Process response
    result = []
    for equipment in equipment_list:
        equipment_dict = {
            "id": equipment.id,
            "name": equipment.name,
            "category": equipment.category,
            "daily_rate": equipment.daily_rate,
            "status": equipment.status,
            "description": equipment.description,
            "weight": equipment.weight,
            "fuel_type": equipment.fuel_type,
            "power": equipment.power,
            "reach": equipment.reach,
            "image_url": equipment.image_url,
            "features": deserialize_features(equipment.features),
            "specifications": deserialize_specifications(equipment.specifications),
            "available": equipment.status == "available",
            "created_at": equipment.created_at
        }
        result.append(EquipmentResponse(**equipment_dict))
    
    return result

@app.get("/api/equipment/{equipment_id}", response_model=EquipmentResponse)
async def get_equipment_by_id(equipment_id: int, db: Session = Depends(get_db)):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    
    if not equipment:
        raise HTTPException(status_code=404, detail="Sprzęt nie został znaleziony")
    
    equipment_dict = {
        "id": equipment.id,
        "name": equipment.name,
        "category": equipment.category,
        "daily_rate": equipment.daily_rate,
        "status": equipment.status,
        "description": equipment.description,
        "weight": equipment.weight,
        "fuel_type": equipment.fuel_type,
        "power": equipment.power,
        "reach": equipment.reach,
        "image_url": equipment.image_url,
        "features": deserialize_features(equipment.features),
        "specifications": deserialize_specifications(equipment.specifications),
        "available": equipment.status == "available",
        "created_at": equipment.created_at
    }
    
    return EquipmentResponse(**equipment_dict)

@app.post("/api/equipment", response_model=EquipmentResponse)
async def create_equipment(
    equipment_data: EquipmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Brak uprawnień")
    
    db_equipment = Equipment(
        name=equipment_data.name,
        category=equipment_data.category,
        daily_rate=equipment_data.daily_rate,
        description=equipment_data.description,
        weight=equipment_data.weight,
        fuel_type=equipment_data.fuel_type,
        power=equipment_data.power,
        reach=equipment_data.reach,
        image_url=equipment_data.image_url,
        features=serialize_features(equipment_data.features),
        specifications=serialize_specifications(equipment_data.specifications)
    )
    
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    
    equipment_dict = {
        "id": db_equipment.id,
        "name": db_equipment.name,
        "category": db_equipment.category,
        "daily_rate": db_equipment.daily_rate,
        "status": db_equipment.status,
        "description": db_equipment.description,
        "weight": db_equipment.weight,
        "fuel_type": db_equipment.fuel_type,
        "power": db_equipment.power,
        "reach": db_equipment.reach,
        "image_url": db_equipment.image_url,
        "features": deserialize_features(db_equipment.features),
        "specifications": deserialize_specifications(db_equipment.specifications),
        "available": db_equipment.status == "available",
        "created_at": db_equipment.created_at
    }
    
    return EquipmentResponse(**equipment_dict)

@app.put("/api/equipment/{equipment_id}", response_model=EquipmentResponse)
async def update_equipment(
    equipment_id: int,
    equipment_data: EquipmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Brak uprawnień")
    
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Sprzęt nie został znaleziony")
    
    update_data = equipment_data.dict(exclude_unset=True)
    
    if 'features' in update_data:
        update_data['features'] = serialize_features(update_data['features'])
    if 'specifications' in update_data:
        update_data['specifications'] = serialize_specifications(update_data['specifications'])
    
    for field, value in update_data.items():
        setattr(equipment, field, value)
    
    db.commit()
    db.refresh(equipment)
    
    equipment_dict = {
        "id": equipment.id,
        "name": equipment.name,
        "category": equipment.category,
        "daily_rate": equipment.daily_rate,
        "status": equipment.status,
        "description": equipment.description,
        "weight": equipment.weight,
        "fuel_type": equipment.fuel_type,
        "power": equipment.power,
        "reach": equipment.reach,
        "image_url": equipment.image_url,
        "features": deserialize_features(equipment.features),
        "specifications": deserialize_specifications(equipment.specifications),
        "available": equipment.status == "available",
        "created_at": equipment.created_at
    }
    
    return EquipmentResponse(**equipment_dict)

# ===== RESERVATION ENDPOINTS =====

@app.post("/api/reservations", response_model=ReservationResponse)
async def create_reservation(
    reservation_data: ReservationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if equipment exists and is available
    equipment = db.query(Equipment).filter(Equipment.id == reservation_data.equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Sprzęt nie został znaleziony")
    
    if equipment.status != "available":
        raise HTTPException(status_code=400, detail="Sprzęt nie jest dostępny")
    
    # Check for conflicting reservations
    start_datetime = datetime.combine(reservation_data.start_date, datetime.min.time())
    end_datetime = datetime.combine(reservation_data.end_date, datetime.max.time())
    
    existing_reservation = db.query(Reservation).filter(
        Reservation.equipment_id == reservation_data.equipment_id,
        Reservation.status.in_(["pending", "active"]),
        Reservation.start_date <= end_datetime,
        Reservation.end_date >= start_datetime
    ).first()
    
    if existing_reservation:
        raise HTTPException(status_code=400, detail="Sprzęt jest już zarezerwowany w tym okresie")
    
    # Calculate total cost
    days = (reservation_data.end_date - reservation_data.start_date).days + 1
    total_cost = days * equipment.daily_rate
    
    # Create reservation
    db_reservation = Reservation(
        equipment_id=reservation_data.equipment_id,
        customer_id=current_user.id,
        start_date=start_datetime,
        end_date=end_datetime,
        total_cost=total_cost,
        contract_number=generate_contract_number(),
        notes=reservation_data.notes
    )
    
    db.add(db_reservation)
    
    # Update equipment status
    equipment.status = "rented"
    
    db.commit()
    db.refresh(db_reservation)
    
    return db_reservation

@app.get("/api/reservations", response_model=List[ReservationResponse])
async def get_reservations(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Reservation)
    
    if not current_user.is_admin:
        # Regular users can only see their own reservations
        query = query.filter(Reservation.customer_id == current_user.id)
    
    if status:
        query = query.filter(Reservation.status == status)
    
    reservations = query.all()
    return reservations

@app.get("/api/reservations/{reservation_id}", response_model=ReservationResponse)
async def get_reservation(
    reservation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    
    if not reservation:
        raise HTTPException(status_code=404, detail="Rezerwacja nie została znaleziona")
    
    if not current_user.is_admin and reservation.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Brak uprawnień")
    
    return reservation

@app.put("/api/reservations/{reservation_id}/status")
async def update_reservation_status(
    reservation_id: int,
    status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Brak uprawnień")
    
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Rezerwacja nie została znaleziona")
    
    old_status = reservation.status
    reservation.status = status
    
    # Update equipment status based on reservation status
    equipment = db.query(Equipment).filter(Equipment.id == reservation.equipment_id).first()
    if status == "completed" or status == "cancelled":
        equipment.status = "available"
    elif status == "active":
        equipment.status = "rented"
    
    db.commit()
    
    return {"message": f"Status rezerwacji zmieniony z {old_status} na {status}"}

# ===== STATISTICS ENDPOINTS =====

@app.get("/api/statistics")
async def get_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Brak uprawnień")
    
    total_equipment = db.query(Equipment).count()
    available_equipment = db.query(Equipment).filter(Equipment.status == "available").count()
    rented_equipment = db.query(Equipment).filter(Equipment.status == "rented").count()
    maintenance_equipment = db.query(Equipment).filter(Equipment.status == "maintenance").count()
    
    total_reservations = db.query(Reservation).count()
    active_reservations = db.query(Reservation).filter(Reservation.status == "active").count()
    pending_reservations = db.query(Reservation).filter(Reservation.status == "pending").count()
    completed_reservations = db.query(Reservation).filter(Reservation.status == "completed").count()
    
    total_customers = db.query(User).count()
    
    # Revenue calculation (last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_revenue = db.query(Reservation).filter(
        Reservation.created_at >= thirty_days_ago,
        Reservation.status.in_(["active", "completed"])
    ).all()
    
    monthly_revenue = sum(r.total_cost for r in recent_revenue)
    
    return {
        "equipment": {
            "total": total_equipment,
            "available": available_equipment,
            "rented": rented_equipment,
            "maintenance": maintenance_equipment
        },
        "reservations": {
            "total": total_reservations,
            "active": active_reservations,
            "pending": pending_reservations,
            "completed": completed_reservations
        },
        "customers": {
            "total": total_customers
        },
        "revenue": {
            "monthly": monthly_revenue,
            "currency": "PLN"
        }
    }

# ===== SEED DATA =====

@app.post("/api/seed-data")
async def seed_data(db: Session = Depends(get_db)):
    """Endpoint do wypełnienia bazy danych przykładowymi danymi"""
    
    # Check if data already exists
    if db.query(Equipment).first():
        return {"message": "Dane już istnieją w bazie danych"}
    
    # Create sample equipment
    sample_equipment = [
        {
            "name": "Koparka gąsienicowa CAT 320",
            "category": "Maszyny ziemne",
            "daily_rate": 850.0,
            "description": "Koparka gąsienicowa o masie 20 ton z zasięgiem roboczym 9.5m",
            "weight": "20 ton",
            "fuel_type": "Diesel",
            "power": "129 kW",
            "reach": "9.5m",
            "features": '["GPS", "Klimatyzacja", "Kamera cofania", "Młot hydrauliczny"]',
            "specifications": '{"bucketCapacity": "1.2m³", "maxDepth": "6.8m", "transportWeight": "20500kg", "enginePower": "129kW"}'
        },
        {
            "name": "Żuraw wieżowy Liebherr 85EC",
            "category": "Żurawie",
            "daily_rate": 1200.0,
            "description": "Żuraw wieżowy o udźwigu 6 ton na końcu wysięgnika",
            "weight": "8 ton",
            "fuel_type": "Elektryczny",
            "power": "22 kW",
            "reach": "50m",
            "status": "rented",
            "features": '["Automatyka", "Winda osobowa", "LED oświetlenie", "System antykolizyjny"]',
            "specifications": '{"maxLoad": "6 ton", "jibLength": "50m", "maxHeight": "150m", "liftingSpeed": "120m/min"}'
        },
        {
            "name": "Rusztowanie ramowe 100m²",
            "category": "Rusztowania",
            "daily_rate": 45.0,
            "description": "Kompletne rusztowanie ramowe z podestami i balustradami",
            "weight": "25kg/m²",
            "fuel_type": "Brak",
            "power": "Brak",
            "reach": "20m",
            "features": '["Ocynkowane", "Podesty robocze", "Balustrady", "Drabinki dostępowe"]',
            "specifications": '{"area": "100m²", "maxHeight": "20m", "loadCapacity": "200kg/m²", "material": "Stal ocynkowana"}'
        }
    ]
    
    for equipment_data in sample_equipment:
        equipment = Equipment(**equipment_data)
        db.add(equipment)
    
    # Create admin user
    admin_user = User(
        name="Administrator",
        email="admin@spellbudex.pl",
        phone="+48 123 456 789",
        company="SpellBudex Sp. z o.o.",
        nip="1234567890",
        address="ul. Budowlana 1, 00-001 Warszawa",
        hashed_password=hash_password("admin123"),
        is_admin=True
    )
    db.add(admin_user)
    
    db.commit()
    
    return {"message": "Przykładowe dane zostały dodane do bazy danych"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# ===== requirements.txt =====
"""
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic[email]==2.5.0
python-multipart==0.0.6
bcrypt==4.0.1
PyJWT==2.8.0
python-decouple==3.8
"""

# ===== .env (przykład) =====
"""
SECRET_KEY=your_super_secret_key_here_change_in_production
DATABASE_URL=sqlite:///./spellbudex.db
"""

# ===== Instrukcje uruchomienia =====
"""
1. Instalacja zależności:
   pip install -r requirements.txt

2. Uruchomienie serwera:
   python main.py
   # lub
   uvicorn main:app --reload --host 0.0.0.0 --port 8000

3. Inicjalizacja przykładowych danych:
   POST http://localhost:8000/api/seed-data

4. API Documentation:
   http://localhost:8000/docs

5. Testowanie API:
   - Register: POST /api/auth/register
   - Login: POST /api/auth/login  
   - Equipment: GET /api/equipment
   - Reservations: POST /api/reservations
"""