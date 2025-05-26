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

const API_BASE_URL = 'http://localhost:8000';

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [featuredEquipment, setFeaturedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sprawdź czy użytkownik jest zalogowany
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Błąd parsowania danych użytkownika');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Pobierz statystyki i sprzęt
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Pobierz dostępny sprzęt (pierwszych 6 dla featured)
      const equipmentResponse = await axios.get(`${API_BASE_URL}/api/equipment?available_only=true`);
      setFeaturedEquipment(equipmentResponse.data.slice(0, 6));
      
      // Pobierz statystyki jeśli użytkownik jest adminem
      if (user?.is_admin) {
        const token = localStorage.getItem('token');
        const statsResponse = await axios.get(`${API_BASE_URL}/api/statistics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsResponse.data);
      } else {
        // Podstawowe statystyki dla niezalogowanych
        setStats({
          equipment: { 
            total: equipmentResponse.data.length,
            available: equipmentResponse.data.filter(e => e.available).length
          }
        });
      }
      
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  // Aktualizowane features z prawdziwymi statystykami
  const features = [
    { 
      icon: "🔄", 
      title: "Szybka rezerwacja", 
      description: "Zarezerwuj potrzebny sprzęt w kilka minut, odbierz gdy będziesz gotowy",
      stat: stats?.equipment?.available ? `${stats.equipment.available} dostępnych` : "Dostępne 24/7"
    },
    { 
      icon: "🛡️", 
      title: "Pełne ubezpieczenie", 
      description: "Wszystkie nasze maszyny posiadają kompleksowe ubezpieczenie",
      stat: "100% ubezpieczone"
    },
    { 
      icon: "🔧", 
      title: "Wsparcie 24/7", 
      description: "Nasz zespół służy pomocą przez całą dobę",
      stat: stats?.customers?.total ? `${stats.customers.total}+ klientów` : "24/7 wsparcie"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
      {/* Navigation Header */}
      <header className="z-10 relative bg-black/50 backdrop-blur-md border-b border-white/10">
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

                {user?.is_admin && (
                  <NavigationMenuItem>
                    <Link href="/dashboard" legacyBehavior passHref>
                      <NavigationMenuLink className="text-white hover:text-gray-300">
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white">Witaj, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300"
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
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
              
              {/* Statystyki na żywo */}
              {stats && !loading && (
                <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6 w-full max-w-md">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">{stats.equipment?.available || 0}</div>
                      <div className="text-white/70 text-sm">Dostępny sprzęt</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{stats.equipment?.total || 0}</div>
                      <div className="text-white/70 text-sm">Łączny sprzęt</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/flota"
                  className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full shadow-lg transition-all"
                >
                  Przeglądaj sprzęt
                </Link>
                <Link
                  href="/rezerwacja"
                  className="bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-white/30 text-white font-medium px-8 py-3 rounded-full shadow-lg transition-all"
                >
                  Zarezerwuj teraz
                </Link>
              </div>

              {/* Feature list z dynamicznymi statystykami */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                {features.map((feature, index) => (
                  <div key={index} className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col items-center md:items-start text-center md:text-left hover:bg-black/50 transition-colors">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm mb-2">{feature.description}</p>
                    <div className="text-green-400 text-xs font-medium">{feature.stat}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side - Sprzęt budowlany */}
            <div className="hidden md:block relative">
              <div className="relative h-[500px] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/30 rounded-3xl backdrop-blur-sm border border-white/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/60 text-8xl">🏗️</div>
                </div>
                
                {/* Floating price card */}
                {featuredEquipment.length > 0 && (
                  <div className="absolute top-10 right-10 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
                    <div className="text-white font-bold text-xl">od {Math.min(...featuredEquipment.map(e => e.daily_rate))} zł</div>
                    <div className="text-white/70 text-sm">za dzień</div>
                  </div>
                )}
                
                {/* Floating stats card */}
                {stats && (
                  <div className="absolute bottom-10 left-10 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
                    <div className="text-green-400 font-bold text-lg">{stats.equipment?.available || 0} dostępnych</div>
                    <div className="text-white/70 text-xs">maszyn gotowych do pracy</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Featured Equipment Section */}
      {featuredEquipment.length > 0 && (
        <section className="py-16 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Polecany sprzęt
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Sprawdź nasz najpopularniejszy sprzęt budowlany dostępny do wynajmu
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEquipment.map((item) => (
                <div key={item.id} className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/50 transition-colors">
                  <div className="h-32 bg-black/60 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">
                      {item.category === "Maszyny ziemne" && "🚜"}
                      {item.category === "Żurawie" && "🏗️"}
                      {item.category === "Rusztowania" && "🏗️"}
                      {item.category === "Transport betonu" && "🚛"}
                      {item.category === "Narzędzia pneumatyczne" && "🔨"}
                      {item.category === "Zagęszczanie" && "⚡"}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-white/60 text-sm mb-3">{item.category}</p>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold text-white">{item.daily_rate} zł</div>
                      <div className="text-white/60 text-sm">za dzień</div>
                    </div>
                    <Link 
                      href={`/rezerwacja?equipment=${item.id}`}
                      className="bg-white hover:bg-gray-200 text-black font-medium px-4 py-2 rounded-full text-sm transition-colors"
                    >
                      Zarezerwuj
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/flota"
                className="inline-block bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-white/30 text-white font-medium px-8 py-3 rounded-full shadow-lg transition-all"
              >
                Zobacz cały sprzęt
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section dla zalogowanych użytkowników */}
      {user && stats && (
        <section className="py-16 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {user.is_admin ? 'Statystyki firmy' : 'Witaj ponownie!'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{stats.equipment?.available || 0}</div>
                <div className="text-white/70">Dostępny sprzęt</div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stats.reservations?.active || 0}</div>
                <div className="text-white/70">Aktywne rezerwacje</div>
              </div>
              
              {user.is_admin && (
                <>
                  <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.customers?.total || 0}</div>
                    <div className="text-white/70">Klientów</div>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{(stats.revenue?.monthly || 0).toLocaleString()}</div>
                    <div className="text-white/70">zł miesięcznie</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Call to action */}
      <section className="relative py-12 bg-black/50 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {user ? `${user.name}, gotowy na kolejny projekt?` : 'Gotowy do pracy? Zarezerwuj potrzebny sprzęt już teraz!'}
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Profesjonalny sprzęt budowlany dostępny natychmiast. Konkurencyjne ceny i pełne wsparcie techniczne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezerwacja"
              className="inline-block bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Rozpocznij rezerwację
            </Link>
            <Link
              href="/kontakt"
              className="inline-block bg-black/60 backdrop-blur-sm hover:bg-black/80 border border-white/30 text-white font-medium px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Skontaktuj się z nami
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}