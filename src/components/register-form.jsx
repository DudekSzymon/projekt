"use client"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
import { useState } from "react"
import axios from "axios"

const API_BASE_URL = 'http://localhost:8000';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Imię musi mieć co najmniej 2 znaki" }),
  lastName: z.string().min(2, { message: "Nazwisko musi mieć co najmniej 2 znaki" }),
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  phone: z.string().min(9, { message: "Numer telefonu musi mieć co najmniej 9 cyfr" }),
  company: z.string().min(2, { message: "Nazwa firmy jest wymagana" }),
  nip: z.string().optional(),
  address: z.string().min(5, { message: "Adres jest wymagany" }),
  password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
  confirmPassword: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
  terms: z.boolean().refine(value => value === true, {
    message: "Musisz zaakceptować warunki",
  }),
  marketingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła muszą być identyczne",
  path: ["confirmPassword"],
})

export function RegisterForm({ className, ...props }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      nip: "",
      address: "",
      password: "",
      confirmPassword: "",
      terms: false,
      marketingConsent: false,
    },
  })

  async function onSubmit(values) {
    setLoading(true);
    setError('');
    
    try {
      // Przygotuj dane do wysłania
      const registerData = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.phone,
        company: values.company,
        nip: values.nip || '',
        address: values.address,
        password: values.password
      };

      console.log('Wysyłanie danych rejestracji:', registerData);

      // Wyślij żądanie rejestracji
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, registerData);
      
      console.log('Rejestracja pomyślna:', response.data);

      // Automatycznie zaloguj użytkownika po rejestracji
      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: values.email,
        password: values.password
      });

      // Zapisz token i dane użytkownika
      localStorage.setItem('token', loginResponse.data.access_token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));

      console.log('Automatyczne logowanie pomyślne');

      // Przekieruj do strony głównej
      router.push('/?welcome=true');

    } catch (error) {
      console.error('Błąd rejestracji:', error);
      
      if (error.response?.status === 400) {
        const detail = error.response.data.detail;
        if (detail === "Email już jest zarejestrowany") {
          setError('Ten adres email jest już zarejestrowany. Spróbuj się zalogować.');
        } else {
          setError(detail || 'Błąd w danych rejestracji');
        }
      } else if (error.response?.status === 422) {
        setError('Nieprawidłowe dane. Sprawdź wszystkie pola.');
      } else {
        setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6 text-white", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-white">Zarejestruj się w SpellBudex!</h1>
          <p className="text-white/80 text-sm">
            Utwórz konto, aby móc wynajmować sprzęt budowlany
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="firstName" className="text-white">Imię *</FormLabel>
                  <FormControl>
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="Imię" 
                      {...field} 
                      className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="lastName" className="text-white">Nazwisko *</FormLabel>
                  <FormControl>
                    <Input 
                      id="lastName" 
                      type="text" 
                      placeholder="Nazwisko" 
                      {...field} 
                      className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="email" className="text-white">Email *</FormLabel>
                <FormControl>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="E-mail" 
                    {...field} 
                    className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="phone" className="text-white">Telefon *</FormLabel>
                <FormControl>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+48 123 456 789" 
                    {...field} 
                    className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="company" className="text-white">Firma *</FormLabel>
                  <FormControl>
                    <Input 
                      id="company" 
                      type="text" 
                      placeholder="Nazwa firmy" 
                      {...field} 
                      className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="nip" className="text-white">NIP</FormLabel>
                  <FormControl>
                    <Input 
                      id="nip" 
                      type="text" 
                      placeholder="1234567890" 
                      {...field} 
                      className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="address" className="text-white">Adres *</FormLabel>
                <FormControl>
                  <Input 
                    id="address" 
                    type="text" 
                    placeholder="ul. Budowlana 1, 00-001 Warszawa" 
                    {...field} 
                    className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
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
                <FormLabel htmlFor="password" className="text-white">Hasło *</FormLabel>
                <FormControl>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Hasło (min. 8 znaków)" 
                    {...field} 
                    className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="confirmPassword" className="text-white">Potwierdź hasło *</FormLabel>
                <FormControl>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Potwierdź hasło" 
                    {...field} 
                    className="border-white/30 bg-black/20 text-white placeholder:text-gray-400"
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

          <FormField
            control={form.control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="items-top flex space-x-3 border border-white/30 rounded p-3">
                <FormControl>
                  <Checkbox 
                    id="marketingConsent" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    disabled={loading}
                  />
                </FormControl>
                <div className="grid gap-1.5 leading-none">
                  <FormDescription className="text-sm text-white">
                    (Opcjonalne) Wyrażam zgodę na otrzymywanie informacji marketingowych i newslettera
                  </FormDescription>
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
                Rejestrowanie...
              </div>
            ) : (
              'Zarejestruj się'
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-white">
          Masz już konto?{" "}
          <Link href="/login" className="text-white underline underline-offset-4">
            Zaloguj się
          </Link>
        </div>
      </form>
    </Form>
  );
}