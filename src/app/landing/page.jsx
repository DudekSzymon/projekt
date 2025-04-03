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
  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
      <header className="z-10 relative" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/" className="flex items-center">
            <span className="text-white text-2xl mr-2 font-bold">*</span>
            <span className="text-white text-xl font-medium">Neurevo Med</span>
          </Link>
          
          <div className="flex-1 flex justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-4 md:gap-6">
                <NavigationMenuItem>
                  <Link href="/projekt" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
                      Projekt
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/plan-cenowy" legacyBehavior passHref>
                    <NavigationMenuLink className="text-white hover:text-gray-300">
                      Plan cenowy
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
          
          <div>
            <Link
              href="/login"
              className="text-white hover:text-gray-300"
            >
              Zaloguj
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row relative text-white">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left justify-center px-8 md:px-12 py-12 md:py-20 z-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Algorytmy AI wspierające decyzje lekarzy.
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            Inteligentna pomoc w wykrywaniu zmian chorobowych
          </p>
        </div>

        <div className="hidden md:flex w-full md:w-1/2">
        </div>
        
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 z-0">
          <div className="relative w-full h-full" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
            <Image
              src="/images/xray.jpg"
              alt="Zdjęcie rentgenowskie"
              fill
              sizes="50vw"
              className="opacity-20 mix-blend-screen"
              style={{
                objectFit: 'cover',
                objectPosition: 'center right',
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}