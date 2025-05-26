"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"

export default function FleetPage() {
  // Categories for filtering - zmienione na sprzęt budowlany
  const categories = ["Wszystkie", "Maszyny ziemne", "Żurawie", "Rusztowania", "Transport betonu", "Narzędzia pneumatyczne", "Zagęszczanie"];
  const [activeCategory, setActiveCategory] = useState("Wszystkie");
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name, price, availability
  
  // Pobieranie danych sprzętu z API
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      // Wywołanie do backend API
      const response = await axios.get('http://localhost:8000/api/equipment');
      setEquipment(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania sprzętu:', error);
      // Fallback na przykładowe dane jeśli API nie działa
      setEquipment([
        {
          id: 1,
          name: "Koparka gąsienicowa CAT 320",
          category: "Maszyny ziemne",
          dailyRate: 850,
          image: "/images/excavator-cat320.jpg",
          weight: "20 ton",
          fuelType: "Diesel",
          power: "129 kW",
          reach: "9.5m",
          available: true,
          features: ["GPS", "Klimatyzacja", "Kamera cofania", "Młot hydrauliczny"],
          description: "Koparka gąsienicowa o masie 20 ton z zasięgiem roboczym 9.5m",
          specifications: {
            bucketCapacity: "1.2m³",
            maxDepth: "6.8m",
            transportWeight: "20500kg",
            enginePower: "129kW"
          }
        },
        {
          id: 2,
          name: "Żuraw wieżowy Liebherr 85EC",
          category: "Żurawie",
          dailyRate: 1200,
          image: "/images/crane-liebherr.jpg",
          weight: "8 ton",
          fuelType: "Elektryczny",
          power: "22 kW", 
          reach: "50m",
          available: false,
          features: ["Automatyka", "Winda osobowa", "LED oświetlenie", "System antykolizyjny"],
          description: "Żuraw wieżowy o udźwigu 6 ton na końcu wysięgnika",
          specifications: {
            maxLoad: "6 ton",
            jibLength: "50m",
            maxHeight: "150m",
            liftingSpeed: "120m/min"
          }
        },
        {
          id: 3,
          name: "Rusztowanie ramowe 100m²",
          category: "Rusztowania",
          dailyRate: 45,
          image: "/images/scaffolding.jpg",
          weight: "25kg/m²",
          fuelType: "Brak",
          power: "Brak",
          reach: "20m",
          available: true,
          features: ["Ocynkowane", "Podesty robocze", "Balustrady", "Drabinki dostępowe"],
          description: "Kompletne rusztowanie ramowe z podestami i balustradami",
          specifications: {
            area: "100m²",
            maxHeight: "20m",
            loadCapacity: "200kg/m²",
            material: "Stal ocynkowana"
          }
        },
        {
          id: 4,
          name: "Betoniarka samojezdna Schwing",
          category: "Transport betonu",
          dailyRate: 950,
          image: "/images/concrete-mixer.jpg",
          weight: "32 ton",
          fuelType: "Diesel",
          power: "260 kW",
          reach: "28m",
          available: true,
          features: ["Autopilot", "Kamera 360°", "System płukania", "Pilot zdalny"],
          description: "Betoniarka samojezdna o pojemności 8m³ z pompą betonu",
          specifications: {
            capacity: "8m³",
            pumpReach: "28m",
            outputCapacity: "160m³/h",
            mobility: "4x4"
          }
        },
        {
          id: 5,
          name: "Młot wyburzeniowy Atlas Copco",
          category: "Narzędzia pneumatyczne", 
          dailyRate: 180,
          image: "/images/demolition-hammer.jpg",
          weight: "500kg",
          fuelType: "Hydrauliczny",
          power: "15 kW",
          reach: "N/A",
          available: true,
          features: ["Absorpcja drgań", "Quick-change", "Auto-stop", "Smarowanie auto"],
          description: "Młot wyburzeniowy hydrauliczny 500kg do robót rozbiórkowych",
          specifications: {
            impactEnergy: "1200J",
            frequency: "1200 uderzeń/min",
            oilFlow: "80-120l/min",
            weight: "500kg"
          }
        },
        {
          id: 6,
          name: "Zagęszczarka płytowa Weber MT",
          category: "Zagęszczanie",
          dailyRate: 85,
          image: "/images/compactor.jpg",
          weight: "350kg",
          fuelType: "Diesel",
          power: "25 kW",
          reach: "N/A", 
          available: true,
          features: ["Nawilżanie", "Maty gumowe", "Składany uchwyt", "Licznik godzin"],
          description: "Zagęszczarka płytowa do gruntu o szerokości 60cm",
          specifications: {
            plateWidth: "60cm",
            compactionForce: "80kN",
            workingSpeed: "25m/min",
            fuelConsumption: "2.5l/h"
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrowanie i sortowanie sprzętu
  const filteredEquipment = equipment
    .filter(item => {
      const matchesCategory = activeCategory === "Wszystkie" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.dailyRate - b.dailyRate;
        case "availability":
          return b.available - a.available;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Funkcja zarezerwowania sprzętu
  const handleReserve = async (equipmentId) => {
    try {
      await axios.post('http://localhost:8000/api/reservations', {
        equipmentId,
        // Dodatkowe dane rezerwacji będą pobrane z formularza
      });
      
      // Przekierowanie do strony rezerwacji z ID sprzętu
      window.location.href = `/rezerwacja?equipment=${equipmentId}`;
    } catch (error) {
      console.error('Błąd podczas rezerwacji:', error);
      // Fallback - przekierowanie bez API
      window.location.href = `/rezerwacja?equipment=${equipmentId}`;
    }
  };

  // Komponent karty sprzętu - zaktualizowany
  const EquipmentCard = ({ item }) => (
    <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden hover:bg-black/50 transition-all border border-gray-800 hover:border-white">
      {/* Zdjęcie sprzętu */}
      <div className="h-48 bg-black/60 relative">
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          {item.category === "Maszyny ziemne" && "🚜"}
          {item.category === "Żurawie" && "🏗️"}
          {item.category === "Rusztowania" && "🏗️"}
          {item.category === "Transport betonu" && "🚛"}
          {item.category === "Narzędzia pneumatyczne" && "🔨"}
          {item.category === "Zagęszczanie" && "⚡"}
        </div>
        {item.available ? (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Dostępny
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Wypożyczony
          </div>
        )}
      </div>
      
      {/* Szczegóły sprzętu */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <span className="text-white font-bold">{item.dailyRate} zł/dzień</span>
        </div>
        
        <div className="mb-3">
          <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>
        
        {/* Specyfikacja techniczna */}
        <div className="grid grid-cols-2 gap-2 text-sm text-white/70 mb-3">
          <div className="flex items-center">
            <span className="mr-1">⚖️</span>
            <span>{item.weight}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⛽</span>
            <span>{item.fuelType}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">🔋</span>
            <span>{item.power}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📏</span>
            <span>{item.reach}</span>
          </div>
        </div>
        
        {/* Cechy */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {item.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="inline-block bg-white/5 text-white/60 text-xs px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
            {item.features.length > 3 && (
              <span className="inline-block bg-white/5 text-white/60 text-xs px-2 py-1 rounded-full">
                +{item.features.length - 3} więcej
              </span>
            )}
          </div>
        </div>
        
        {/* Przyciski akcji */}
        <div className="flex space-x-2">
          <Link 
            href={`/sprzet/${item.id}`}
            className="flex-1 bg-black/60 text-white text-center py-2 rounded-lg hover:bg-black/80 transition-colors"
          >
            Szczegóły
          </Link>
          <button
            onClick={() => handleReserve(item.id)}
            disabled={!item.available}
            className={`
              flex-1 text-center py-2 rounded-lg transition-colors
              ${item.available 
                ? 'bg-white hover:bg-gray-200 text-black' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            {item.available ? 'Zarezerwuj' : 'Niedostępny'}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="text-white text-xl">Ładowanie sprzętu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
      {/* Navigation Header - zmienione branding */}
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
                    <NavigationMenuLink className="text-white hover:text-gray-300 font-bold">
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
      
      {/* Main content */}
      <main className="flex-1 relative" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Page header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nasz <span className="text-white">Sprzęt Budowlany</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Profesjonalny sprzęt budowlany najwyższej jakości. Koparki, żurawie, rusztowania i więcej.
            </p>
          </div>

          {/* Filtry i wyszukiwanie */}
          <div className="mb-8 space-y-4">
            {/* Wyszukiwanie */}
            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Szukaj sprzętu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Sortowanie */}
            <div className="flex justify-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-black/40 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white"
              >
                <option value="name">Sortuj: Nazwa A-Z</option>
                <option value="price">Sortuj: Cena rosnąco</option>
                <option value="availability">Sortuj: Dostępność</option>
              </select>
            </div>
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
          
          {/* Equipment grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map(item => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
          
          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white text-xl">Brak dostępnego sprzętu w tej kategorii.</p>
            </div>
          )}

          {/* Statystyki */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">{equipment.length}</div>
              <div className="text-white/70">Łączny sprzęt</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {equipment.filter(item => item.available).length}
              </div>
              <div className="text-white/70">Dostępny teraz</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">{categories.length - 1}</div>
              <div className="text-white/70">Kategorii sprzętu</div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Call to action */}
      <section className="relative py-12 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Potrzebujesz pomocy w wyborze sprzętu?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Nasi eksperci pomogą Ci wybrać odpowiedni sprzęt do Twojego projektu budowlanego.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/kontakt"
              className="bg-black/60 hover:bg-black/80 text-white font-medium px-8 py-3 rounded-full transition-colors"
            >
              Skontaktuj się
            </Link>
            <Link
              href="/rezerwacja"
              className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Rozpocznij rezerwację
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}