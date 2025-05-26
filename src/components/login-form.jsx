"use client"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "axios"

const API_BASE_URL = 'http://localhost:8000';

// Definiowanie schematu walidacji
const formSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
  terms: z.boolean().refine(value => value === true, {
    message: "Musisz zaakceptować warunki",
  }),
})

export function LoginForm({ className, ...props }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
  
  // Inicjalizacja formularza z react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  })

  // Sprawdź czy użytkownik już jest zalogowany (ale nie przekierowuj automatycznie)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Tylko sprawdź token, ale nie przekierowuj - użytkownik może chcieć się wylogować
      validateTokenSilent(token);
    }
  }, []);

  // Walidacja tokenu (bez automatycznego przekierowania)
  const validateTokenSilent = async (token) => {
    try {
      await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Token jest ważny - można dodać info dla użytkownika
      console.log('Użytkownik już zalogowany');
    } catch (error) {
      // Token nieważny, usuń go
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Funkcja obsługująca submit formularza
  async function onSubmit(values) {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: values.email,
        password: values.password
      });

      // Zapisz token i dane użytkownika
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Sukces! Przekieruj użytkownika
      if (response.data.user.is_admin) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }

    } catch (error) {
      console.error('Błąd logowania:', error);
      
      if (error.response?.status === 401) {
        setError('Nieprawidłowy email lub hasło');
      } else if (error.response?.status === 422) {
        setError('Nieprawidłowe dane. Sprawdź email i hasło.');
      } else {
        setError('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Inicjalizacja Google OAuth z oficjalnym przyciskiem
  useEffect(() => {
    const loadGoogleScript = () => {
      if (typeof window !== 'undefined' && !window.google && !googleScriptLoaded) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogle;
        script.onerror = () => {
          console.error('Nie udało się załadować Google OAuth');
          setError('Nie udało się załadować logowania Google');
        };
        document.head.appendChild(script);
        setGoogleScriptLoaded(true);
      } else if (window.google) {
        initializeGoogle();
      }
    };

    const initializeGoogle = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: '80597607362-vh5kr756eo165ae6uja1beln48hj9dbp.apps.googleusercontent.com',
          callback: handleGoogleLogin,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Renderuj oficjalny przycisk Google
        const googleButtonDiv = document.getElementById('google-signin-div');
        if (googleButtonDiv) {
          window.google.accounts.id.renderButton(
            googleButtonDiv,
            {
              theme: 'filled_blue',
              size: 'large',
              shape: 'rectangular',
              width: '100%',
              text: 'signin_with',
              logo_alignment: 'left'
            }
          );
        }
      } catch (error) {
        console.error('Błąd inicjalizacji Google OAuth:', error);
      }
    };

    // Opóźnij ładowanie o 100ms żeby DOM się załadował
    const timeoutId = setTimeout(loadGoogleScript, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [googleScriptLoaded]);

  // Obsługa logowania Google
  const handleGoogleLogin = async (response) => {
    setGoogleLoading(true);
    setError('');
    
    try {
      // Dekoduj token Google (w rzeczywistej aplikacji rób to na backendzie!)
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Sprawdź czy użytkownik istnieje w bazie
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: payload.email,
          password: 'google_oauth_temp' // Tymczasowe hasło dla użytkowników Google
        });
        
        localStorage.setItem('token', loginResponse.data.access_token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        
        if (loginResponse.data.user.is_admin) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
        
      } catch (loginError) {
        // Użytkownik nie istnieje, zarejestruj go
        const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, {
          name: payload.name,
          email: payload.email,
          phone: '', // Google nie daje telefonu
          company: payload.email.split('@')[1] || '', // Użyj domeny jako firmy
          nip: '',
          address: '',
          password: 'google_oauth_temp'
        });
        
        // Zaloguj nowo utworzonego użytkownika
        const newLoginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: payload.email,
          password: 'google_oauth_temp'
        });
        
        localStorage.setItem('token', newLoginResponse.data.access_token);
        localStorage.setItem('user', JSON.stringify(newLoginResponse.data.user));
        
        // Przekieruj do strony głównej z info o uzupełnieniu profilu
        router.push('/?welcome=true');
      }
      
    } catch (error) {
      console.error('Błąd logowania Google:', error);
      setError('Wystąpił błąd podczas logowania przez Google. Spróbuj ponownie.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Funkcja do manualnego uruchomienia Google popup (backup)
  const handleGoogleButtonClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setError('Popup Google został zablokowany. Spróbuj ponownie lub użyj przycisku poniżej.');
        }
      });
    } else {
      setError('Google OAuth nie jest dostępne. Odśwież stronę.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6 text-white", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-white">Witamy w SpellBudex!</h1>
          <p className="text-white text-sm text-balance">
            Wprowadź swój adres email i hasło lub zaloguj się przez Google
          </p>
        </div>

        {/* Oficjalny przycisk Google */}
        <div className="w-full">
          <div id="google-signin-div" className="w-full flex justify-center"></div>
          
          {/* Backup przycisk Google (jeśli oficjalny nie działa) */}
          <Button
            type="button"
            onClick={handleGoogleButtonClick}
            disabled={googleLoading}
            className="w-full bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-3 py-3 mt-2"
            style={{ display: googleScriptLoaded ? 'none' : 'flex' }}
          >
            {googleLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Logowanie...' : 'Zaloguj się przez Google'}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-900 px-2 text-white/70">lub zaloguj się emailem</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="email" className="text-white">Email</FormLabel>
                <FormControl>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="E-mail" 
                    {...field} 
                    className="border-white/30 bg-black/20 text-white placeholder:text-gray-400 focus:border-white focus:ring-white" 
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="password" className="text-white">Hasło</FormLabel>
                <FormControl>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Hasło" 
                    {...field} 
                    className="border-white/30 bg-black/20 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="items-top flex space-x-3 border border-white/30 rounded p-3">
                <FormControl>
                  <Checkbox 
                    id="terms" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    disabled={loading}
                  />
                </FormControl>
                <div className="grid gap-1.5 leading-none">
                  <FormDescription className="text-sm text-white">
                    (Wymagane) Akceptuję <a href="#" className="text-white underline underline-offset-4">Warunki</a> korzystania z usługi oraz <a href="#" className="text-white underline underline-offset-4">Politykę prywatności</a> 
                  </FormDescription>
                  <FormMessage className="text-red-300" />
                </div>
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Logowanie...
              </div>
            ) : (
              'Zaloguj się'
            )}
          </Button>
        </div>
        <div className="text-center text-sm text-white">
          Nie posiadasz konta?{" "}
          <Link href="/register" className="text-white underline underline-offset-4">
            Utwórz konto
          </Link>
        </div>
        <div className="text-center text-sm text-white">
          Zapomniałeś hasła?{" "}
          <a href="#" className="text-white underline underline-offset-4">
            Kliknij tutaj
          </a>
        </div>
      </form>
    </Form>
  );
}