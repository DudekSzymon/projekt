"use client"

import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
      {/* Navigation Header */}
      <header className="z-10 relative bg-black/50 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <span className="text-white text-2xl mr-2 font-bold">🚗</span>
            <span className="text-white text-xl font-medium">AutoRent</span>
          </Link>
          
          <div className="flex-1 flex justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-4 md:gap-6">
                <NavigationMenuItem>
                  <Link href="/flota" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
                      Nasza Flota
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/cennik" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
                      Cennik
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/kontakt" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300 font-bold">
                      Kontakt
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white hover:text-gray-300"
            >
              Zaloguj
            </Link>
            <Link
              href="/register"
              className="bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded-full"
            >
              Zarejestruj
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 relative" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 text-white">
                Skontaktuj się z <span className="text-white">nami</span>
              </h1>
              <p className="text-white/80 text-lg">
                Masz pytania? Jesteśmy tu, aby pomóc. Skorzystaj z poniższych danych kontaktowych
                lub wypełnij formularz, a odpowiemy najszybciej jak to możliwe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Phone */}
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl text-center">
                <div className="text-white text-3xl mb-3">📞</div>
                <h3 className="text-white font-medium mb-2">Telefon</h3>
                <p className="text-white/80">+48 123 456 789</p>
                <p className="text-white/60 text-sm mt-2">Czynne codziennie 8:00-20:00</p>
              </div>
              
              {/* Email */}
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl text-center">
                <div className="text-white text-3xl mb-3">✉️</div>
                <h3 className="text-white font-medium mb-2">Email</h3>
                <p className="text-white/80">kontakt@autorent.pl</p>
                <p className="text-white/60 text-sm mt-2">Odpowiadamy w ciągu 24h</p>
              </div>
              
              {/* Address */}
              <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl text-center">
                <div className="text-white text-3xl mb-3">📍</div>
                <h3 className="text-white font-medium mb-2">Główna siedziba</h3>
                <p className="text-white/80">ul. Motorowa 42</p>
                <p className="text-white/80">00-001 Warszawa</p>
              </div>
            </div>
            
            {/* Contact form */}
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Formularz kontaktowy</h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-1 text-sm">Imię i nazwisko</label>
                    <input 
                      type="text" 
                      className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-1 text-sm">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="jan.kowalski@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Temat</label>
                  <select className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <option>Rezerwacja</option>
                    <option>Pytanie o dostępność</option>
                    <option>Pytanie o cennik</option>
                    <option>Współpraca biznesowa</option>
                    <option>Inny temat</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 mb-1 text-sm">Wiadomość</label>
                  <textarea 
                    className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white min-h-32"
                    placeholder="Tutaj wpisz swoją wiadomość..."
                  ></textarea>
                </div>
                
                <div className="text-right">
                  <button 
                    type="submit" 
                    className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-full font-medium"
                  >
                    Wyślij wiadomość
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}