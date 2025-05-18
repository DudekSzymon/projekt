"use client"

import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { useState } from "react"

export default function LocationsPage() {
  // Active location for showing details
  const [activeLocation, setActiveLocation] = useState('warszawa');
  
  // Locations data
  const locations = [
    {
      id: 'warszawa',
      name: 'Warszawa - Centrum',
      address: 'ul. Motorowa 42, 00-001 Warszawa',
      phone: '+48 22 123 45 67',
      hours: 'Pon-Pt: 8:00-20:00, Sob-Nd: 9:00-18:00',
      email: 'warszawa@autorent.pl',
      coordinates: [52.229676, 21.012229],
      cars: 45,
      features: ['Punkt odbioru 24/7', 'Parking', 'Poczekalnia', 'Wi-Fi', 'Kawa/herbata'],
    },
    {
      id: 'warszawa_lotnisko',
      name: 'Warszawa - Lotnisko Chopina',
      address: 'Terminal A, 00-906 Warszawa',
      phone: '+48 22 123 45 68',
      hours: 'Pon-Nd: 6:00-23:00',
      email: 'lotnisko.waw@autorent.pl',
      coordinates: [52.1672, 20.9679],
      cars: 30,
      features: ['Obsługa przylotów', 'Punkt odbioru 24/7', 'Parking', 'Poczekalnia'],
    },
    {
      id: 'krakow',
      name: 'Kraków - Centrum',
      address: 'ul. Samochodowa 15, 30-001 Kraków',
      phone: '+48 12 345 67 89',
      hours: 'Pon-Pt: 8:00-20:00, Sob-Nd: 9:00-18:00',
      email: 'krakow@autorent.pl',
      coordinates: [50.0647, 19.9450],
      cars: 35,
      features: ['Parking', 'Poczekalnia', 'Wi-Fi', 'Kawa/herbata'],
    },
    {
      id: 'krakow_lotnisko',
      name: 'Kraków - Lotnisko Balice',
      address: 'Terminal Główny, 32-083 Balice',
      phone: '+48 12 345 67 90',
      hours: 'Pon-Nd: 6:00-23:00',
      email: 'lotnisko.krk@autorent.pl',
      coordinates: [50.0769, 19.7881],
      cars: 25,
      features: ['Obsługa przylotów', 'Punkt odbioru 24/7', 'Parking'],
    },
    {
      id: 'gdansk',
      name: 'Gdańsk',
      address: 'ul. Rajdowa 8, 80-001 Gdańsk',
      phone: '+48 58 987 65 43',
      hours: 'Pon-Pt: 8:00-20:00, Sob-Nd: 10:00-18:00',
      email: 'gdansk@autorent.pl',
      coordinates: [54.3520, 18.6466],
      cars: 30,
      features: ['Parking', 'Poczekalnia', 'Wi-Fi'],
    },
    {
      id: 'poznan',
      name: 'Poznań',
      address: 'ul. Transportowa 22, 61-001 Poznań',
      phone: '+48 61 123 45 67',
      hours: 'Pon-Pt: 8:00-20:00, Sob-Nd: 9:00-17:00',
      email: 'poznan@autorent.pl',
      coordinates: [52.4064, 16.9252],
      cars: 25,
      features: ['Parking', 'Poczekalnia', 'Wi-Fi', 'Kawa/herbata'],
    },
    {
      id: 'wroclaw',
      name: 'Wrocław',
      address: 'ul. Kierowców 10, 50-001 Wrocław',
      phone: '+48 71 234 56 78',
      hours: 'Pon-Pt: 8:00-20:00, Sob-Nd: 10:00-16:00',
      email: 'wroclaw@autorent.pl',
      coordinates: [51.1079, 17.0385],
      cars: 20,
      features: ['Parking', 'Poczekalnia', 'Wi-Fi'],
    },
  ];
  
  // Get current location data
  const currentLocation = locations.find(loc => loc.id === activeLocation) || locations[0];
  
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
                    <NavigationMenuLink className="text-white hover:text-gray-300 font-bold">
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
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nasze <span className="text-white">Lokalizacje</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Wybierz jedną z naszych wielu lokalizacji w całej Polsce. 
              Oferujemy odbiór i zwrot samochodów w najważniejszych miastach i lotniskach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Locations sidebar */}
            <div className="md:col-span-1 space-y-4">
              {locations.map(location => (
                <div 
                  key={location.id}
                  onClick={() => setActiveLocation(location.id)}
                  className={`
                    p-4 rounded-lg cursor-pointer transition-all
                    ${activeLocation === location.id
                      ? 'bg-black/50 border-l-4 border-white'
                      : 'bg-black/30 hover:bg-black/40'
                    }
                  `}
                >
                  <h3 className="font-bold text-white text-lg">{location.name}</h3>
                  <p className="text-white/70 text-sm">{location.address}</p>
                </div>
              ))}
            </div>
            
            {/* Location details */}
            <div className="md:col-span-2">
              <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden">
                {/* Location map placeholder */}
                <div className="h-64 bg-black/60 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white/50">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📍</div>
                      <p>Mapa lokalizacji</p>
                      <p className="text-xs mt-1">
                        Współrzędne: {currentLocation.coordinates[0]}, {currentLocation.coordinates[1]}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Location details */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">{currentLocation.name}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Informacje kontaktowe</h3>
                      <ul className="space-y-2 text-white/80">
                        <li className="flex items-start">
                          <span className="text-white mr-2">📍</span>
                          <span>{currentLocation.address}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-white mr-2">📞</span>
                          <span>{currentLocation.phone}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-white mr-2">✉️</span>
                          <span>{currentLocation.email}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-white mr-2">🕒</span>
                          <span>{currentLocation.hours}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Udogodnienia</h3>
                      <ul className="space-y-2 text-white/80">
                        {currentLocation.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-white mr-2">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-4 p-3 bg-black/60 rounded-lg">
                        <p className="text-white">
                          <span className="text-white font-medium">Dostępne samochody:</span> {currentLocation.cars}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-4">
                    <Link 
                      href={`/flota`}
                      className="flex-1 bg-black/60 hover:bg-black/80 text-white text-center py-2 rounded-lg transition-colors"
                    >
                      Zobacz dostępne samochody
                    </Link>
                    <Link 
                      href={`/rezerwacja?location=${currentLocation.id}`}
                      className="flex-1 bg-white hover:bg-gray-200 text-black text-center py-2 rounded-lg transition-colors"
                    >
                      Zarezerwuj w tej lokalizacji
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Additional info section */}
      <section className="relative py-12 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Dlaczego warto wybrać AutoRent?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl text-center">
              <div className="text-white text-3xl mb-3">🌍</div>
              <h3 className="text-white text-lg font-medium mb-2">Wiele lokalizacji</h3>
              <p className="text-white/70">
                Odbierz samochód w jednej lokalizacji i zwróć w innej – bez dodatkowych opłat w obrębie tego samego miasta.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl text-center">
              <div className="text-white text-3xl mb-3">🕒</div>
              <h3 className="text-white text-lg font-medium mb-2">Elastyczne godziny</h3>
              <p className="text-white/70">
                Większość naszych lokalizacji oferuje odbiór i zwrot samochodów poza standardowymi godzinami pracy.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl text-center">
              <div className="text-white text-3xl mb-3">🚗</div>
              <h3 className="text-white text-lg font-medium mb-2">Rezerwacja online</h3>
              <p className="text-white/70">
                Zarezerwuj samochód online, wybierając preferowaną lokalizację odbioru i zwrotu, a my zadbamy o resztę.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}