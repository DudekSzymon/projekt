"use client"

import * as React from "react"
import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import Image from "next/image"

export default function FleetPage() {
  // Categories for filtering
  const categories = ["Wszystkie", "Ekonomiczne", "Komfortowe", "Premium", "SUV"];
  const [activeCategory, setActiveCategory] = useState("Wszystkie");
  
  // Cars data
  const cars = [
    {
      id: 1,
      name: "Toyota Yaris",
      category: "Ekonomiczne",
      price: 149,
      image: "/images/toyota-yaris.jpg", // Placeholder path
      transmission: "Manualna",
      fuel: "Benzyna",
      seats: 5,
      luggage: 2,
      available: true,
      features: ["Klimatyzacja", "Radio", "USB", "Bluetooth"],
    },
    {
      id: 2,
      name: "Volkswagen Polo",
      category: "Ekonomiczne",
      price: 159,
      image: "/images/vw-polo.jpg", // Placeholder path
      transmission: "Manualna",
      fuel: "Benzyna",
      seats: 5,
      luggage: 2,
      available: true,
      features: ["Klimatyzacja", "Radio", "USB", "Bluetooth"],
    },
    {
      id: 3,
      name: "Toyota Corolla",
      category: "Komfortowe",
      price: 249,
      image: "/images/toyota-corolla.jpg", // Placeholder path
      transmission: "Automatyczna",
      fuel: "Hybryda",
      seats: 5,
      luggage: 3,
      available: true,
      features: ["Klimatyzacja dwustrefowa", "System multimedialny", "Kamera cofania", "Tempomat"],
    },
    {
      id: 4,
      name: "Volkswagen Golf",
      category: "Komfortowe",
      price: 259,
      image: "/images/vw-golf.jpg", // Placeholder path
      transmission: "Automatyczna",
      fuel: "Diesel",
      seats: 5,
      luggage: 3,
      available: false,
      features: ["Klimatyzacja dwustrefowa", "System multimedialny", "Czujniki parkowania", "Tempomat"],
    },
    {
      id: 5,
      name: "BMW Seria 3",
      category: "Premium",
      price: 399,
      image: "/images/bmw-3.jpg", // Placeholder path
      transmission: "Automatyczna",
      fuel: "Benzyna",
      seats: 5,
      luggage: 3,
      available: true,
      features: ["Pełne wyposażenie", "System nawigacji", "Skórzana tapicerka", "Podgrzewane fotele"],
    },
    {
      id: 6,
      name: "Mercedes-Benz C-Class",
      category: "Premium",
      price: 419,
      image: "/images/mercedes-c.jpg", // Placeholder path
      transmission: "Automatyczna",
      fuel: "Diesel",
      seats: 5,
      luggage: 3,
      available: true,
      features: ["Pełne wyposażenie", "System nawigacji", "Skórzana tapicerka", "Asystent pasa ruchu"],
    },
    {
      id: 7,
      name: "Toyota RAV4",
      category: "SUV",
      price: 349,
      image: "/images/toyota-rav4.jpg", // Placeholder path
      transmission: "Automatyczna",
      fuel: "Hybryda",
      seats: 5,
      luggage: 4,
      available: true,
      features: ["Napęd 4x4", "Klimatyzacja dwustrefowa", "Duży bagażnik", "System multimedialny"],
    },
    {
      id: 8,
      name: "Volkswagen Tiguan",
      category: "SUV",
      price: 369,
      image: "/images/vw-tiguan.jpg", // Placeholder path
      transmission: "Automatyczna",
      fuel: "Diesel",
      seats: 5,
      luggage: 4,
      available: true,
      features: ["Napęd 4x4", "Klimatyzacja dwustrefowa", "Duży bagażnik", "System multimedialny"],
    },
  ];

  // Filter cars based on active category
  const filteredCars = activeCategory === "Wszystkie" 
    ? cars 
    : cars.filter(car => car.category === activeCategory);
  
  // Car card component
  const CarCard = ({ car }) => (
    <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden hover:bg-black/50 transition-all border border-gray-800 hover:border-white">
      {/* Car Image Placeholder */}
      <div className="h-48 bg-black/60 relative">
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🚗</div>
        {car.available ? (
          <div className="absolute top-2 right-2 bg-white text-black text-xs px-2 py-1 rounded-full">
            Dostępny
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
            Niedostępny
          </div>
        )}
      </div>
      
      {/* Car Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{car.name}</h3>
          <span className="text-white font-bold">{car.price} zł/dzień</span>
        </div>
        
        <div className="mb-3">
          <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            {car.category}
          </span>
        </div>
        
        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-2 text-sm text-white/70 mb-3">
          <div className="flex items-center">
            <span className="mr-1">⚙️</span>
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⛽</span>
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">👥</span>
            <span>{car.seats} miejsc</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">🧳</span>
            <span>{car.luggage} walizki</span>
          </div>
        </div>
        
        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {car.features.map((feature, i) => (
              <span key={i} className="inline-block bg-white/5 text-white/60 text-xs px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            href={`/samochody/${car.id}`}
            className="flex-1 bg-black/60 text-white text-center py-2 rounded-lg hover:bg-black/80 transition-colors"
          >
            Szczegóły
          </Link>
          <Link 
            href={`/rezerwacja?car=${car.id}`}
            className={`
              flex-1 text-center py-2 rounded-lg
              ${car.available 
                ? 'bg-white hover:bg-gray-200 text-black' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            Zarezerwuj
          </Link>
        </div>
      </div>
    </div>
  );

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
                    <NavigationMenuLink className="text-white hover:text-gray-300 font-bold">
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
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nasza <span className="text-white">Flota</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Wybierz z naszej szerokiej gamy samochodów - od ekonomicznych miejskich aut po luksusowe limuzyny i przestronne SUV-y.
            </p>
          </div>
          
          {/* Category filter */}
          <div className="flex justify-center mb-10 flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${activeCategory === category
                    ? 'bg-white text-black'
                    : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Cars grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
          
          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white text-xl">Brak dostępnych samochodów w tej kategorii.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Call to action */}
      <section className="relative py-12 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Nie znalazłeś odpowiedniego samochodu?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Skontaktuj się z nami, aby sprawdzić dostępność innych modeli lub zarezerwować wybrany samochód już teraz.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/kontakt"
              className="bg-black/60 hover:bg-black/80 text-white font-medium px-8 py-3 rounded-full transition-colors"
            >
              Kontakt
            </Link>
            <Link
              href="/rezerwacja"
              className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Rezerwacja
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}