"use client"

import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export default function PromotionsPage() {
  // Promotional offers data
  const promotions = [
    {
      id: 'weekend-special',
      title: 'Weekend Special',
      description: 'Wynajmij samochód na weekend (piątek-poniedziałek) i zapłać tylko za 2 dni.',
      validUntil: '30.06.2025',
      discount: '33%',
      code: 'WEEKEND33',
      categories: ['Ekonomiczne', 'Komfortowe', 'Premium'],
      conditions: ['Wynajem od piątku do poniedziałku', 'Minimum 3 dni', 'Limit kilometrów: 800 km']
    },
    {
      id: 'long-term',
      title: 'Długoterminowa promocja',
      description: 'Im dłużej wynajmujesz, tym więcej oszczędzasz. Wynajmij na tydzień lub dłużej i skorzystaj z rabatu.',
      validUntil: '31.12.2025',
      discount: 'do 25%',
      code: 'LONG25',
      categories: ['Wszystkie kategorie'],
      conditions: ['7-13 dni: 15% rabatu', '14-29 dni: 20% rabatu', '30+ dni: 25% rabatu']
    },
    {
      id: 'business',
      title: 'Oferta biznesowa',
      description: 'Specjalna oferta dla firm i klientów biznesowych. Stałe stawki i dodatkowe benefity.',
      validUntil: 'Bezterminowo',
      discount: '20%',
      code: 'BIZNES20',
      categories: ['Komfortowe', 'Premium', 'SUV'],
      conditions: ['Wymagana rejestracja firmowa', 'Minimum 3 wynajmy w ciągu roku', 'Faktura VAT']
    },
    {
      id: 'first-rental',
      title: 'Pierwszy wynajem',
      description: 'Wynajmujesz z nami po raz pierwszy? Skorzystaj z specjalnego rabatu na start!',
      validUntil: 'Bezterminowo',
      discount: '15%',
      code: 'FIRST15',
      categories: ['Wszystkie kategorie'],
      conditions: ['Tylko dla nowych klientów', 'Minimum 2 dni wynajmu', 'Nie łączy się z innymi promocjami']
    },
    {
      id: 'family',
      title: 'Pakiet rodzinny',
      description: 'Wynajem samochodów dla rodzin z dziećmi. Fotelik dla dziecka i GPS w cenie!',
      validUntil: '31.08.2025',
      discount: 'Dodatkowe opcje gratis',
      code: 'FAMILY',
      categories: ['Komfortowe', 'SUV'],
      conditions: ['Minimum 3 dni wynajmu', 'Maksymalnie 2 foteliki na rezerwację', 'Wymagane potwierdzenie']
    },
    {
      id: 'last-minute',
      title: 'Last Minute',
      description: 'Specjalne zniżki na rezerwacje w ostatniej chwili. Sprawdź dostępność!',
      validUntil: 'Zmienna',
      discount: 'do 40%',
      code: 'LAST40',
      categories: ['Zależne od dostępności'],
      conditions: ['Rezerwacja max 48h przed odbiorem', 'Ograniczona dostępność', 'Pełna płatność z góry']
    }
  ];

  // Seasonal/Special offers
  const specialOffers = [
    {
      title: 'Wakacyjna promocja',
      description: 'Planujesz wakacje? Skorzystaj z naszej specjalnej promocji letniej i zaoszczędź nawet 30% na wynajmie samochodu.',
      buttonText: 'Sprawdź szczegóły',
      buttonLink: '/promocje/wakacje',
      highlight: true
    },
    {
      title: 'Program lojalnościowy',
      description: 'Dołącz do naszego programu lojalnościowego i zbieraj punkty za każdy wynajem. Wymieniaj punkty na darmowe dni wynajmu i dodatkowe usługi.',
      buttonText: 'Dołącz teraz',
      buttonLink: '/program-lojalnosciowy',
      highlight: false
    }
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
                  <Link href="/promocje" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300 font-bold">
                      Promocje
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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Aktualne <span className="text-white">Promocje</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Skorzystaj z naszych specjalnych ofert i rabatów. Zarezerwuj samochód już teraz i oszczędzaj!
            </p>
          </div>
          
          {/* Special/Seasonal offers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {specialOffers.map((offer, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden rounded-xl border ${
                  offer.highlight 
                    ? 'border-white bg-black/60' 
                    : 'border-white/10 bg-black/40'
                } p-6`}
              >
                {offer.highlight && (
                  <div className="absolute top-0 right-0 bg-white text-black text-xs px-3 py-1 rounded-bl-lg">
                    Promocja limitowana
                  </div>
                )}
                <h2 className="text-2xl font-bold text-white mb-3">{offer.title}</h2>
                <p className="text-white/80 mb-6">{offer.description}</p>
                <Link
                  href={offer.buttonLink}
                  className={`inline-block px-6 py-2 rounded-full ${
                    offer.highlight 
                      ? 'bg-white hover:bg-gray-200 text-black' 
                      : 'bg-black/60 hover:bg-black/80 text-white'
                  }`}
                >
                  {offer.buttonText}
                </Link>
              </div>
            ))}
          </div>
          
          {/* Regular promotions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map(promo => (
              <div 
                key={promo.id}
                className="bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/50 transition-all"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-block bg-white text-black text-xs font-medium px-2 py-1 rounded-full">
                      {promo.discount} zniżki
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{promo.title}</h3>
                  <p className="text-white/70 mb-4">{promo.description}</p>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Kod promocyjny:</span>
                      <span className="font-mono bg-black/60 text-white px-2 py-1 rounded">{promo.code}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Ważne do:</span>
                      <span className="text-white">{promo.validUntil}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Kategorie:</span>
                      <span className="text-white">{promo.categories.join(", ")}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/60 text-sm mb-2">Warunki:</p>
                    <ul className="text-white/70 text-sm space-y-1">
                      {promo.conditions.map((condition, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-white mr-2">•</span>
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href={`/rezerwacja?promo=${promo.code}`}
                      className="block w-full text-center py-2 bg-white hover:bg-gray-200 text-black rounded-lg transition-colors"
                    >
                      Zarezerwuj z promocją
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* How to use promotions */}
          <div className="mt-16 bg-black/40 border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Jak skorzystać z promocji?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Wybierz promocję</h3>
                <p className="text-white/70">Znajdź promocję, która najlepiej odpowiada Twoim potrzebom</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Zapamiętaj kod</h3>
                <p className="text-white/70">Zapisz kod promocyjny z wybranej oferty</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Wprowadź kod</h3>
                <p className="text-white/70">Podczas rezerwacji wprowadź kod, aby otrzymać zniżkę</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Newsletter signup */}
      <section className="relative py-12 bg-black/60">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Nie przegap żadnej promocji!
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Zapisz się do naszego newslettera, aby otrzymywać informacje o nowych promocjach i ofertach specjalnych.
          </p>
          
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Twój adres email" 
              className="flex-1 px-4 py-3 rounded-full bg-black/60 border border-white/10 text-white focus:outline-none focus:border-white"
            />
            <button className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-3 rounded-full transition-colors">
              Zapisz się
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}