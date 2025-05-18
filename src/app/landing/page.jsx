"use client"

import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  // Car features section data
  const features = [
    { 
      icon: "🔄", 
      title: "Szybka rezerwacja", 
      description: "Zarezerwuj potrzebne Ci narzędzia w kilka minut, odbierz gdy będziesz gotowy" 
    },
    { 
      icon: "🛡️", 
      title: "Pełne ubezpieczenie", 
      description: "Wszystkie nasze narzędzia posiadają kompleksowe ubezpieczenie" 
    },
    { 
      icon: "🔧", 
      title: "Wsparcie 24/7", 
      description: "Nasz zespół służy pomocą przez całą dobę" 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
      {/* Navigation Header */}
      <header className="z-10 relative bg-black/50 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <span className="text-white text-2xl mr-2 font-bold">*</span>
            <span className="text-white text-xl font-medium">SpellBudex</span>
          </Link>
          
          <div className="flex-1 flex justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-4 md:gap-6">
                <NavigationMenuItem>
                  <Link href="/flota" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
                      Nasz sprzęt
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
                  <Link href="/lokalizacje" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
                      Lokalizacje
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/kontakt" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
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
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col relative text-white" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side content */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
                Buduj bez kompromisów ze SpellBudex
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg">
                Wynajem niezawodnego sprzętu budowlanego – koparki, zagęszczarki, rusztowania i wiele więcej. Elastyczne warunki, szybki odbiór, konkurencyjne ceny.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/flota"
                  className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full shadow-lg transition-all"
                >
                  Przeglądaj sprzęt
                </Link>
                <Link
                  href="/promocje"
                  className="bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-white/30 text-white font-medium px-8 py-3 rounded-full shadow-lg transition-all"
                >
                  Sprawdź promocje
                </Link>
              </div>

              {/* Feature list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {features.map((feature, index) => (
                  <div key={index} className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - Car image */}
            <div className="hidden md:block relative">
              <div className="relative h-[500px] w-full">
                <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>
                <Image
                  src="/images/landingPage.jpg"
                  alt="Luksusowy samochód"
                  fill
                  className="object-contain p-6 grayscale"
                />
              </div>
              
              {/* Floating elements */}
              {/* <div className="absolute top-10 right-10 bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
                <div className="text-white font-bold text-xl">499 zł</div>
                <div className="text-white/70 text-sm">za dzień</div>
              </div> */}
              
                <div>
                  {/* <div className="text-white font-bold">4.9/5</div>
                  <div className="text-white/70 text-xs">2371 ocen</div> */}
                </div>
              </div>
            </div>
          </div>
      </main>
      
      {/* Call to action */}
      <section className="relative py-12 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Gotowy do pracy? Zarezerwuj potrzebny sprzęt już teraz!
          </h2>
          <Link
            href="/rezerwacja"
            className="inline-block bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full shadow-lg transition-all"
          >
            Rozpocznij rezerwację
          </Link>
        </div>
      </section>
    </div>
  )
}