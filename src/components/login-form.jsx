"use client"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
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

// Definiowanie schematu walidacji
const formSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  password: z.string().min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
  terms: z.boolean().refine(value => value === true, {
    message: "Musisz zaakceptować warunki",
  }),
})

export function LoginForm({ className, ...props }) {
  // Inicjalizacja formularza z react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      terms: false,
    },
  })

  // Funkcja obsługująca submit formularza
  function onSubmit(values) {
    console.log(values)
    // Tutaj dodaj logikę logowania
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6 text-white", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-white">Witamy w Neuvero Med!</h1>
          <p className="text-white text-sm text-balance">
            Wprowadź swój adres email i hasło
          </p>
        </div>
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
                    className="bg-black border-white text-white placeholder:text-gray-400" 
                  />
                </FormControl>
                <FormMessage className="text-white" />
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
                    className="bg-black border-white text-white placeholder:text-gray-400" 
                  />
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="items-top flex space-x-3 border border-white rounded p-3 bg-black">
                <FormControl>
                  <Checkbox 
                    id="terms" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    className="border-white"
                  />
                </FormControl>
                <div className="grid gap-1.5 leading-none">
                  <FormDescription className="text-sm text-white">
                    (Wymagane) Akceptuję <a href="#" className="text-white underline underline-offset-4">Warunki</a> korzystania z usługi oraz <a href="#" className="text-white underline underline-offset-4">Politykę prywatności</a> 
                  </FormDescription>
                  <FormMessage className="text-white" />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
            Zaloguj się
          </Button>
        </div>
        <div className="text-center text-sm text-white">
          Nie posiadasz konta?{" "}
          <a href="#" className="text-white underline underline-offset-4">
            Utwórz konto
          </a>
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