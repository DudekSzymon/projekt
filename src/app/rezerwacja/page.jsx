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
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000';

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const equipmentId = searchParams.get('equipment');
  
  // Form state
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: '',
    // Dane osobowe (jeśli nie zalogowany)
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    nip: '',
    address: ''
  });
  
  // App state
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  
  // Sprawdź czy użytkownik jest zalogowany
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    }
  }, []);
  
  // Pobierz dane użytkownika
const fetchUserInfo = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(response.data);
    
    // Wypełnij dane użytkownika - ale pozwól na edycję jeśli są niepełne
    const userData = response.data;
    const nameParts = userData.name?.split(' ') || ['', ''];
    
    setFormData(prev => ({
      ...prev,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: userData.email || '',
      phone: userData.phone || '', // Może być puste z Google
      company: userData.company || '', // Może być puste z Google
      nip: userData.nip || '',
      address: userData.address || '' // Może być puste z Google
    }));
  } catch (error) {
    console.error('Błąd pobierania danych użytkownika:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
  
  // Pobierz sprzęt z API
  useEffect(() => {
    fetchEquipment();
  }, []);
  
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/equipment?available_only=true`);
      setEquipment(response.data);
      
      // Jeśli przekazano ID sprzętu w URL, ustaw go jako wybrany
      if (equipmentId) {
        const selected = response.data.find(item => item.id === parseInt(equipmentId));
        if (selected) {
          setSelectedEquipment(selected);
          setCurrentStep(2);
        }
      }
    } catch (error) {
      console.error('Błąd pobierania sprzętu:', error);
      setError('Nie udało się pobrać listy sprzętu');
    } finally {
      setLoading(false);
    }
  };
  
  // Obsługa zmian w formularzu
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Wybór sprzętu
  const handleEquipmentSelect = (equipment) => {
    setSelectedEquipment(equipment);
    setCurrentStep(2);
  };
  
  // Nawigacja między krokami
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Obliczanie kosztu całkowitego
  const calculateTotal = () => {
    if (!selectedEquipment || !formData.startDate || !formData.endDate) return 0;
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return selectedEquipment.daily_rate * diffDays;
  };
  
  // Obliczanie liczby dni
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  
  // Wysyłanie rezerwacji - ZAKTUALIZOWANE Z PRZEKIEROWANIEM NA PŁATNOŚĆ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token && !user) {
        // Jeśli nie zalogowany, najpierw zarejestruj użytkownika
        const registerData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          nip: formData.nip,
          address: formData.address,
          password: 'temp123456' // Tymczasowe hasło
        };
        
        const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, registerData);
        
        // Zaloguj nowo utworzonego użytkownika
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: formData.email,
          password: 'temp123456'
        });
        
        localStorage.setItem('token', loginResponse.data.access_token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        setUser(loginResponse.data.user);
      }
      
      // Utwórz rezerwację
      const reservationData = {
        equipment_id: selectedEquipment.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        notes: formData.notes
      };
      
      const currentToken = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/reservations`, reservationData, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      
      // Sukces! - ZMIENIONE PRZEKIEROWANIE
      const reservationId = response.data.id;
      const contractNumber = response.data.contract_number;
      const totalCost = response.data.total_cost;
      
      // Pokaż komunikat sukcesu
      alert(`🎉 Rezerwacja została złożona pomyślnie!

📋 Numer umowy: ${contractNumber}
💰 Koszt całkowity: ${totalCost} zł
🏗️ Sprzęt: ${selectedEquipment.name}

Teraz zostaniesz przekierowany do bezpiecznej płatności Stripe.`);
      
      // Przekieruj na stronę płatności zamiast na główną
      router.push(`/payment/${reservationId}`);
      
    } catch (error) {
      console.error('Błąd podczas składania rezerwacji:', error);
      
      if (error.response?.status === 401) {
        setError('Błąd autoryzacji. Proszę się zalogować.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.detail || 'Błąd w danych rezerwacji');
      } else {
        setError('Wystąpił błąd podczas składania rezerwacji. Spróbuj ponownie.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Funkcja renderująca zawartość kroku
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Wybierz sprzęt budowlany</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="text-white text-xl">Ładowanie sprzętu...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => handleEquipmentSelect(item)}
                    className={`
                      bg-black/40 backdrop-blur-md rounded-lg p-4 cursor-pointer transition-all border
                      ${selectedEquipment?.id === item.id 
                        ? 'ring-2 ring-white bg-black/60 border-white' 
                        : 'hover:bg-black/50 border-white/20'
                      }
                    `}
                  >
                    <div className="h-32 bg-black/60 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-3xl">
                        {item.category === "Maszyny ziemne" && "🚜"}
                        {item.category === "Żurawie" && "🏗️"}
                        {item.category === "Rusztowania" && "🏗️"}
                        {item.category === "Transport betonu" && "🚛"}
                        {item.category === "Narzędzia pneumatyczne" && "🔨"}
                        {item.category === "Zagęszczanie" && "⚡"}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm">{item.name}</h3>
                    <p className="text-white/70 text-xs">{item.category}</p>
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-white font-bold">{item.daily_rate} zł/dzień</p>
                      <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full">
                        Dostępny
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedEquipment && !loading && (
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
                <label className="block text-white/80 mb-1 text-sm">Data rozpoczęcia</label>
                <input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Data zakończenia</label>
                <input 
                  type="date" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 mb-1 text-sm">Uwagi do rezerwacji</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Dodatkowe informacje, wymagania specjalne, itp."
                className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
              />
            </div>
            
            {/* Podsumowanie wybranego sprzętu */}
            {selectedEquipment && (
              <div className="mt-6 p-4 rounded-lg bg-black/60 border border-white/20">
                <h3 className="text-lg font-medium text-white mb-3">Wybrany sprzęt</h3>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold">{selectedEquipment.name}</p>
                    <p className="text-white/70 text-sm">{selectedEquipment.category}</p>
                    <p className="text-white/60 text-sm mt-1">{selectedEquipment.description}</p>
                    <div className="mt-2 text-sm text-white/60">
                      <div>Waga: {selectedEquipment.weight}</div>
                      <div>Zasilanie: {selectedEquipment.fuel_type}</div>
                      <div>Moc: {selectedEquipment.power}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">{selectedEquipment.daily_rate} zł</p>
                    <p className="text-white/60 text-sm">za dzień</p>
                  </div>
                </div>
              </div>
            )}
            
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
                disabled={!formData.startDate || !formData.endDate}
              >
                Dalej
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              {user ? 'Potwierdzenie danych' : 'Dane kontaktowe'}
            </h2>
            
            {!user && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-blue-200 text-sm">
                  💡 Nie masz konta? Nie ma problemu! Utworzymy je automatycznie podczas składania rezerwacji.
                </p>
              </div>
            )}

            {/* Dodana informacja dla użytkowników Google */}
            {user && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-green-200 text-sm">
                  ✅ Zalogowano przez Google jako <strong>{user.email}</strong>
                  <br />
                  💡 Uzupełnij brakujące dane (telefon, firma, adres) aby kontynuować.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-1 text-sm">Imię *</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  // USUNIĘTE: disabled={!!user}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Nazwisko *</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  // USUNIĘTE: disabled={!!user}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!user} // POZOSTAWIONE - email z Google nie powinien być edytowalny
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
                  required
                />
                {user && (
                  <p className="text-white/60 text-xs mt-1">Email z konta Google - nie można edytować</p>
                )}
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Telefon *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  // USUNIĘTE: disabled={!!user}
                  placeholder={user ? "Uzupełnij numer telefonu" : "Numer telefonu"}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">Firma *</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  // USUNIĘTE: disabled={!!user}
                  placeholder={user ? "Uzupełnij nazwę firmy" : "Nazwa firmy"}
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-1 text-sm">NIP</label>
                <input 
                  type="text" 
                  name="nip"
                  value={formData.nip}
                  onChange={handleChange}
                  // USUNIĘTE: disabled={!!user}
                  placeholder="NIP firmy (opcjonalnie)"
                  className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 mb-1 text-sm">Adres *</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                // USUNIĘTE: disabled={!!user}
                rows="2"
                placeholder={user ? "Uzupełnij adres firmy" : "Adres firmy"}
                className="w-full p-3 rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
                required
              />
            </div>
            
            {/* Podsumowanie całej rezerwacji z informacją o płatności */}
            <div className="mt-8 p-6 rounded-lg bg-black/60 border border-white/20">
              <h3 className="text-lg font-medium text-white mb-4">Podsumowanie rezerwacji</h3>
              
              {selectedEquipment && (
                <>
                  <div className="flex justify-between items-start pb-4 border-b border-white/10">
                    <div>
                      <p className="text-white font-bold">{selectedEquipment.name}</p>
                      <p className="text-white/70 text-sm">{selectedEquipment.category}</p>
                    </div>
                    <p className="text-white font-bold">{selectedEquipment.daily_rate} zł/dzień</p>
                  </div>
                  
                  <div className="py-4 border-b border-white/10 space-y-2">
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>Data rozpoczęcia:</span>
                      <span>{formData.startDate ? new Date(formData.startDate).toLocaleDateString('pl-PL') : '-'}</span>
                    </div>
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>Data zakończenia:</span>
                      <span>{formData.endDate ? new Date(formData.endDate).toLocaleDateString('pl-PL') : '-'}</span>
                    </div>
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>Liczba dni:</span>
                      <span>{calculateDays()} dni</span>
                    </div>
                    {formData.notes && (
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>Uwagi:</span>
                        <span className="text-right max-w-xs">{formData.notes}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-b border-white/10 pb-4">
                    <div className="text-xl font-bold flex justify-between text-white">
                      <span>Koszt całkowity:</span>
                      <span>{calculateTotal().toLocaleString()} zł</span>
                    </div>
                    <p className="text-white/60 text-sm text-right mt-1">
                      ({selectedEquipment.daily_rate} zł × {calculateDays()} dni)
                    </p>
                  </div>
                  
                  {/* Informacja o płatności */}
                  <div className="pt-4">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <span className="mr-2">💳</span>
                        Następny krok: Bezpieczna płatność
                      </h4>
                      <p className="text-blue-200 text-sm">
                        Po potwierdzeniu rezerwacji zostaniesz przekierowany do bezpiecznej płatności przez Stripe. 
                        Akceptujemy karty płatnicze, BLIK i Przelewy24.
                      </p>
                      <div className="mt-2 flex items-center text-xs text-blue-300">
                        <span>🔒 SSL</span>
                        <span className="mx-2">•</span>
                        <span>🛡️ PCI DSS</span>
                        <span className="mx-2">•</span>
                        <span>✅ Bezpieczne płatności</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevStep}
                className="bg-black/60 hover:bg-black/80 text-white font-medium px-6 py-2 rounded-full"
                disabled={submitting}
              >
                Wstecz
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.company || !formData.address}
                className="bg-white hover:bg-gray-200 text-black font-medium px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Składanie rezerwacji...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💳</span>
                    Potwierdź i przejdź do płatności
                  </>
                )}
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
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-white">Witaj, {user.name}</span>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    window.location.reload();
                  }}
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
      
      {/* Main content */}
      <main className="flex-1 relative" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Page header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4 text-white">
                Rezerwacja <span className="text-white">sprzętu budowlanego</span>
              </h1>
              <p className="text-white/80 text-lg">
                Wybierz sprzęt, datę i szczegóły rezerwacji, a następnie dokonaj bezpiecznej płatności.
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-medium
                      ${currentStep >= step 
                        ? 'bg-white text-black' 
                        : 'bg-black/60 text-white/50'
                      }
                    `}
                  >
                    {step}
                  </div>
                  <div 
                    className={`text-sm mt-2 text-center
                      ${currentStep >= step 
                        ? 'text-white' 
                        : 'text-white/50'
                      }
                    `}
                  >
                    {step === 1 ? 'Wybór sprzętu' : step === 2 ? 'Terminy' : 'Potwierdzenie'}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Form content based on current step */}
            <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/20">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}