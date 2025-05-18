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

export default function PricingPage() {
  // Car categories with their prices and features
  const carCategories = [
    {
      name: "Ekonomiczne",
      pricePerDay: 149,
      pricePerWeek: 899,
      image: "/images/economy-car.jpg",
      features: [
        "Klimatyzacja",
        "Radio",
        "5 miejsc",
        "Małe zużycie paliwa",
        "Zasięg pełnego baku: 700 km"
      ],
      examples: ["Toyota Yaris", "Volkswagen Polo", "Opel Corsa"]
    },
    {
      name: "Komfortowe",
      pricePerDay: 249,
      pricePerWeek: 1499,
      image: "/images/comfort-car.jpg",
      popular: true,
      features: [
        "Klimatyzacja dwustrefowa",
        "System multimedialny",
        "5 miejsc",
        "Czujniki parkowania",
        "Tempomat",
        "Zasięg pełnego baku: 800 km"
      ],
      examples: ["Toyota Corolla", "Volkswagen Golf", "Mazda 3"]
    },
    {
      name: "Premium",
      pricePerDay: 399,
      pricePerWeek: 2399,
      image: "/images/premium-car.jpg",
      features: [
        "Pełne wyposażenie",
        "System nawigacji",
        "Skórzana tapicerka",
        "Podgrzewane fotele",
        "Kamera cofania",
        "Asystent pasa ruchu",
        "Zasięg pełnego baku: 750 km"
      ],
      examples: ["BMW Seria 3", "Mercedes-Benz C-Class", "Audi A4"]
    },
    {
      name: "SUV",
      pricePerDay: 349,
      pricePerWeek: 2099,
      image: "/images/suv-car.jpg",
      features: [
        "Napęd 4x4",
        "Zwiększony prześwit",
        "Duży bagażnik",
        "Klimatyzacja dwustrefowa",
        "5-7 miejsc",
        "System multimedialny",
        "Zasięg pełnego baku: 700 km"
      ],
      examples: ["Toyota RAV4", "Volkswagen Tiguan", "Hyundai Tucson"]
    }
  ];

  // Additional options/services
  const additionalOptions = [
    { name: "Dodatkowy kierowca", price: 25, unit: "dzień" },
    { name: "Fotelik dla dziecka", price: 15, unit: "dzień" },
    { name: "GPS", price: 20, unit: "dzień" },
    { name: "Pełne ubezpieczenie", price: 35, unit: "dzień" },
    { name: "Wi-Fi", price: 15, unit: "dzień" },
    { name: "Odbiór/zwrot poza godzinami pracy", price: 50, unit: "jednorazowo" }
  ];

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
                    <NavigationMenuLink className="text-white hover:text-gray-300 font-bold">
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
      
      {/* Main content */}
      <main className="flex-1 relative" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Page header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nasze <span className="text-white">ceny</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Oferujemy konkurencyjne ceny i przejrzysty cennik bez ukrytych opłat. 
              Wybierz kategorię, która najlepiej odpowiada Twoim potrzebom.
            </p>
          </div>
          
          {/* Pricing plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {carCategories.map((category, index) => (
              <div 
                key={index} 
                className={`relative rounded-2xl overflow-hidden ${
                  category.popular 
                    ? 'ring-2 ring-white bg-black/60' 
                    : 'bg-black/40'
                } backdrop-blur-md`}
              >
                {category.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-white text-black text-center text-sm py-1 font-medium">
                    Najpopularniejszy wybór
                  </div>
                )}
                
                <div className="p-6 pb-8">
                  {/* Car image */}
                  <div className="w-full h-40 rounded-lg bg-black/50 mb-4 overflow-hidden relative">
                    {/* This would be replaced with actual car images */}
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🚗</div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white">
                      {category.pricePerDay} zł
                      <span className="text-white/60 text-sm font-normal"> / dzień</span>
                    </div>
                    <div className="text-white/60 text-sm">
                      lub {category.pricePerWeek} zł / tydzień
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-white/80 text-sm mb-2">Przykładowe modele:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.examples.map((model, i) => (
                        <span 
                          key={i} 
                          className="inline-block bg-white/10 rounded-full px-3 py-1 text-xs text-white/80"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-8">
                    {category.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-white mr-2">✓</span>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href={`/rezerwacja?category=${category.name}`}
                    className={`block w-full text-center rounded-full py-3 font-medium transition-all ${
                      category.popular 
                        ? 'bg-white hover:bg-gray-200 text-black' 
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    Zarezerwuj teraz
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional options */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Dodatkowe usługi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalOptions.map((option, index) => (
                <div key={index} className="flex justify-between items-center p-4 rounded-lg bg-black/30 hover:bg-black/50 transition-colors">
                  <span className="text-white">{option.name}</span>
                  <span className="text-white font-medium">
                    {option.price} zł / {option.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ section */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Najczęściej zadawane pytania</h2>
            
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-medium mb-2">Jaki jest minimalny okres wynajmu?</h3>
                <p className="text-white/70">Minimalny okres wynajmu to 24 godziny. Możliwy jest również wynajem na godziny w wybranych lokalizacjach.</p>
              </div>
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-medium mb-2">Czy potrzebuję kaucji?</h3>
                <p className="text-white/70">Tak, wymagamy kaucji w wysokości 1000-2000 zł w zależności od kategorii pojazdu. Kaucja jest zwracana po oddaniu samochodu w nienaruszonym stanie.</p>
              </div>
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-medium mb-2">Czy mogę odebrać samochód w jednym mieście i oddać w innym?</h3>
                <p className="text-white/70">Tak, oferujemy usługę odbioru w innej lokalizacji. Wiąże się to z dodatkową opłatą zależną od odległości między punktami.</p>
              </div>
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-white font-medium mb-2">Jakie dokumenty są potrzebne do wynajęcia samochodu?</h3>
                <p className="text-white/70">Potrzebujesz ważnego prawa jazdy (min. 1 rok), dowodu osobistego lub paszportu oraz karty kredytowej.</p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">Co w przypadku awarii lub wypadku?</h3>
                <p className="text-white/70">Zapewniamy całodobową pomoc drogową. W przypadku awarii niezawinionej przez kierowcę, dostarczamy samochód zastępczy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Call to action */}
      <section className="relative py-12 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Potrzebujesz specjalnej oferty dla firm?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Oferujemy atrakcyjne rabaty dla firm oraz możliwość długoterminowego wynajmu. 
            Skontaktuj się z nami, aby otrzymać spersonalizowaną ofertę.
          </p>
          <Link
            href="/kontakt"
            className="inline-block bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full shadow-lg transition-all"
          >
            Skontaktuj się z nami
          </Link>
        </div>
      </section>
    </div>
  )
}