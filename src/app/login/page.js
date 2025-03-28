// src/app/login/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tutaj dodaj logikę logowania
    console.log('Logowanie z danymi:', { email, password, isChecked });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Lewa strona - obrazek */}
      <div className="relative hidden md:block md:w-1/2 bg-black">
        <div 
          className="absolute inset-0 bg-black opacity-60"
          style={{
            backgroundColor: '#000000', // Dodajemy czarny kolor tła jako fallback
            backgroundImage: 'url(/images/surgeon.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)',
          }}
        />
        
        {/* Logo */}
        <div className="absolute top-10 left-10 text-white z-10">
          <h1 className="text-xl font-semibold flex items-center">
            <span className="mr-2">✳</span> Neurevo Med
          </h1>
        </div>
        
        {/* Cytat */}
        <div className="absolute bottom-10 left-10 text-white z-10 max-w-md">
          <p className="text-lg font-medium">"Sztuczna inteligencja to narzędzie, które przybliży lekarzy do perfekcji"</p>
          <p className="mt-2 text-sm">Prof. Paweł Łęgosz</p>
        </div>
      </div>
      
      {/* Prawa strona - formularz logowania */}
      <div className="w-full md:w-1/2 bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Witamy w Neurevo Med!</h2>
            <p className="text-sm text-gray-400 mt-2">Wprowadź swój adres email i hasło</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-400 block">Adres e-mail</label>
              <input
                id="email"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-400 block">Hasło</label>
              <input
                id="password"
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-black border border-gray-700 rounded text-white"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                id="terms" 
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="border-gray-500 h-4 w-4"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-400"
              >
                Wyrażam zgodę. Warunki korzystania z usługi oraz{' '}
                <Link href="/polityka" className="text-white underline hover:text-gray-300">
                  Polityka prywatności
                </Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="w-full p-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
            >
              Zaloguj się
            </button>
          </form>
          
          <div className="text-center text-sm text-gray-400">
            <p>
              Nie posiadasz konta?{' '}
              <Link href="/register" className="text-white underline hover:text-gray-300">
                Utwórz konto
              </Link>
            </p>
            <p className="mt-1">
              Zapomniałeś hasła?{' '}
              <Link href="/reset-password" className="text-white underline hover:text-gray-300">
                Kliknij tutaj
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}