"use client"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Imię musi mieć co najmniej 2 znaki" }),
  lastName: z.string().min(2, { message: "Nazwisko musi mieć co najmniej 2 znaki" }),
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
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
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      marketingConsent: false,
    },
  })

  function onSubmit(values) {
    console.log(values)
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6 text-white", className)} {...props}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-white">Zarejestruj się w SpellBudex!</h1>
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="firstName" className="text-white">Imię</FormLabel>
                  <FormControl>
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="Imię" 
                      {...field} 
                      className="border-white text-white placeholder:text-gray-400" 
                    />
                  </FormControl>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel htmlFor="lastName" className="text-white">Nazwisko</FormLabel>
                  <FormControl>
                    <Input 
                      id="lastName" 
                      type="text" 
                      placeholder="Nazwisko" 
                      {...field} 
                      className="border-white text-white placeholder:text-gray-400" 
                    />
                  </FormControl>
                  <FormMessage className="text-white" />
                </FormItem>
              )}
            />
          </div>
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
                    className="border-white text-white placeholder:text-gray-400" 
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
                    className="border-white text-white placeholder:text-gray-400" 
                  />
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="grid gap-3">
                <FormLabel htmlFor="confirmPassword" className="text-white">Potwierdź hasło</FormLabel>
                <FormControl>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Potwierdź hasło" 
                    {...field} 
                    className="border-white text-white placeholder:text-gray-400" 
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
              <FormItem className="items-top flex space-x-3 border border-white rounded p-3">
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
          {/* <FormField
            control={form.control}
            name="marketingConsent"
            render={({ field }) => (
              <FormItem className="items-top flex space-x-3 border border-white rounded p-3">
                <FormControl>
                  <Checkbox 
                    id="marketingConsent" 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                    className="border-white"
                  />
                </FormControl>
                <div className="grid gap-1.5 leading-none">
                  <FormDescription className="text-sm text-white">
                    (Opcjonalne) Wyrażam zgodę na otrzymywanie informacji marketingowych i newslettera
                  </FormDescription>
                </div>
              </FormItem>
            )}
          /> */}
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
            Zarejestruj się
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