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
import { useSearchParams } from 'next/navigation'

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const carId = searchParams.get('car');
  
  // Form state
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: '',
    pickupLocation: 'warszawa',
    returnLocation: 'warszawa',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    additionalDriver: false,
    childSeat: false,
    gps: false,
    fullInsurance: false,
  });
  
  // Selected car state (would normally be fetched from API based on carId)
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Mock car data
  const cars = [
    {
      id: "1",
      name: "Toyota Yaris",
      category: "Ekonomiczne",
      price: 149,
      image: "/images/toyota-yaris.jpg",
    },
    {
      id: "3",
      name: "Toyota Corolla",
      category: "Komfortowe",
      price: 249,
      image: "/images/toyota-corolla.jpg",
    },
    {
      id: "5",
      name: "BMW Seria 3",
      category: "Premium",
      price: 399,
      image: "/images/bmw-3.jpg",
    },
    {
      id: "7",
      name: "Toyota RAV4",
      category: "SUV",
      price: 349,
      image: "/images/toyota-rav4.jpg",
    },
  ];
  
  // Locations
  const locations = [
    { id: 'warszawa', name: 'Warszawa - Centrum' },
    { id: 'warszawa_lotnisko', name: 'Warszawa - Lotnisko Chopina' },
    { id: 'krakow', name: 'Kraków - Centrum' },
    { id: 'krakow_lotnisko', name: 'Kraków - Lotnisko Balice' },
    { id: 'gdansk', name: 'Gdańsk' },
    { id: 'poznan', name: 'Poznań' },
    { id: 'wroclaw', name: 'Wrocław' },
  ];
  
  // Set the car based on URL parameter
  useEffect(() => {
    if (carId) {
      const car = cars.find(c => c.id === carId);
      if (car) {
        setSelectedCar(car);
      }
    }
  }, [carId]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle car selection
  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setCurrentStep(2);
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Calculate total price
  const calculateTotal = () => {
    if (!selectedCar) return 0;
    
    // Calculate number of days
    const pickupDate = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const diffTime = Math.abs(returnDate - pickupDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    let total = selectedCar.price * diffDays;
    
    // Add extras
    if (formData.additionalDriver) total += 25 * diffDays;
    if (formData.childSeat) total += 15 * diffDays;
    if (formData.gps) total += 20 * diffDays;
    if (formData.fullInsurance) total += 35 * diffDays;
    
    return total;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Would normally send data to server here
    alert('Rezerwacja została złożona! Dziękujemy.');
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Wybierz samochód</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cars.map(car => (
                <div 
                  key={car.id}
                  onClick={() => handleCarSelect(car)}
                  className={`
                    bg-black/40 backdrop-blur-md rounded-lg p-4 cursor-pointer transition-all
                    ${selectedCar?.id === car.id 
                      ? 'ring-2 ring-white bg-black/60' 
                      : 'hover:bg-black/50'
                    }
                  `}
                >
                  <div className="h-32 bg-black/60 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-3xl">🚗</span>
                  </div>
                  <h3 className="font-bold text-white">{car.name}</h3>
                  <p className="text-white/70 text-sm">{car.category}</p>
                  <p className="text-white font-bold mt-2">{car.price} zł/dzień</p>
                </div>
              ))}
            </div>
            
            {selectedCar && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-2 rounded-full"
                >
                  Dalej
                </button>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Szczegóły rezerwacji</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-1 text-sm">Data odbioru</label>
                <input 
                  type="date" 
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Data zwrotu</label>
                <input 
                  type="date" 
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Miejsce odbioru</label>
                <select 
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Miejsce zwrotu</label>
                <select 
                  name="returnLocation"
                  value={formData.returnLocation}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-white mt-6">Dodatkowe opcje</h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="additionalDriver"
                  name="additionalDriver"
                  checked={formData.additionalDriver}
                  onChange={handleChange}
                  className="mr-3 h-4 w-4"
                />
                <label htmlFor="additionalDriver" className="text-white">
                  Dodatkowy kierowca (+25 zł/dzień)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="childSeat"
                  name="childSeat"
                  checked={formData.childSeat}
                  onChange={handleChange}
                  className="mr-3 h-4 w-4"
                />
                <label htmlFor="childSeat" className="text-white">
                  Fotelik dla dziecka (+15 zł/dzień)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gps"
                  name="gps"
                  checked={formData.gps}
                  onChange={handleChange}
                  className="mr-3 h-4 w-4"
                />
                <label htmlFor="gps" className="text-white">
                  GPS (+20 zł/dzień)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="fullInsurance"
                  name="fullInsurance"
                  checked={formData.fullInsurance}
                  onChange={handleChange}
                  className="mr-3 h-4 w-4"
                />
                <label htmlFor="fullInsurance" className="text-white">
                  Pełne ubezpieczenie (+35 zł/dzień)
                </label>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevStep}
                className="bg-black/60 hover:bg-black/80 text-white font-medium px-6 py-2 rounded-full"
              >
                Wstecz
              </button>
              <button
                onClick={handleNextStep}
                className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-2 rounded-full"
                disabled={!formData.pickupDate || !formData.returnDate}
              >
                Dalej
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Dane osobowe</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-1 text-sm">Imię</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Nazwisko</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Telefon</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
            </div>
            
            <div className="mt-8 p-4 rounded-lg bg-black/60">
              <h3 className="text-lg font-medium text-white mb-3">Podsumowanie rezerwacji</h3>
              
              {selectedCar && (
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <div>
                    <p className="text-white font-bold">{selectedCar.name}</p>
                    <p className="text-white/70 text-sm">{selectedCar.category}</p>
                  </div>
                  <p className="text-white font-bold">{selectedCar.price} zł/dzień</p>
                </div>
              )}
              
              <div className="py-3 border-b border-white/10">
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Data odbioru:</span>
                  <span>{formData.pickupDate}</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm mt-1">
                  <span>Data zwrotu:</span>
                  <span>{formData.returnDate}</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm mt-1">
                  <span>Miejsce odbioru:</span>
                  <span>{locations.find(l => l.id === formData.pickupLocation)?.name}</span>
                </div>
                <div className="flex justify-between text-white/80 text-sm mt-1">
                  <span>Miejsce zwrotu:</span>
                  <span>{locations.find(l => l.id === formData.returnLocation)?.name}</span>
                </div>
              </div>
              
              <div className="py-3">
                <div className="text-lg font-bold flex justify-between text-white">
                  <span>Łączna kwota:</span>
                  <span>{calculateTotal()} zł</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevStep}
                className="bg-black/60 hover:bg-black/80 text-white font-medium px-6 py-2 rounded-full"
              >
                Wstecz
              </button>
              <button
                onClick={handleSubmit}
                className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-2 rounded-full"
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
              >
                Potwierdź rezerwację
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

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
          <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 text-white">
                Rezerwacja <span className="text-white">samochodu</span>
              </h1>
              <p className="text-white/80 text-lg">
                Wybierz samochód, datę i dodatkowe opcje, aby rozpocząć przygodę z AutoRent.
              </p>
            </div>
            
            {/* Progress steps */}
            <div className="flex justify-between mb-10 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2" />
              
              {[1, 2, 3].map(step => (
                <div 
                  key={step} 
                  className={`relative flex flex-col items-center z-10`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${currentStep >= step 
                        ? 'bg-white text-black' 
                        : 'bg-black/60 text-white/50'
                      }
                    `}
                  >
                    {step}
                  </div>
                  <div 
                    className={`text-sm mt-2
                      ${currentStep >= step 
                        ? 'text-white' 
                        : 'text-white/50'
                      }
                    `}
                  >
                    {step === 1 ? 'Samochód' : step === 2 ? 'Szczegóły' : 'Dane osobowe'}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Form content based on current step */}
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}