"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StripeProvider } from '@/components/StripeProvider'
import { PaymentForm } from '@/components/PaymentForm'
import axios from 'axios'
import Link from 'next/link'

const API_BASE_URL = 'http://localhost:8000'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    fetchReservation()
  }, [params.reservation_id])

  const fetchReservation = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await axios.get(`${API_BASE_URL}/api/reservations/${params.reservation_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setReservation(response.data)
    } catch (error) {
      console.error('Błąd pobierania rezerwacji:', error)
      setError('Nie znaleziono rezerwacji lub brak uprawnień')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Płatność udana:', paymentIntent)
    setPaymentSuccess(true)
    
    // Opcjonalnie przekieruj po 3 sekundach
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  const handlePaymentError = (error) => {
    console.error('Błąd płatności:', error)
    setError(`Błąd płatności: ${error}`)
  }

  const handleCancel = () => {
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie...</div>
      </div>
    )
  }

  if (error && !reservation) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <Link href="/" className="text-white underline">
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 text-center border border-white/20 max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-4">Płatność udana!</h2>
          <p className="text-white/80 mb-6">
            Dziękujemy za płatność. Twoja rezerwacja została potwierdzona.
          </p>
          <div className="space-y-2 text-sm text-white/60 mb-6">
            <p>Umowa: {reservation?.contract_number}</p>
            <p>Sprzęt: {reservation?.equipment?.name}</p>
          </div>
          <Link 
            href="/"
            className="block w-full py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-colors"
          >
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-white/10 p-4">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-white text-2xl mr-2 font-bold">*</span>
            <span className="text-white text-xl font-medium">SpellBudex</span>
          </Link>
          <div className="ml-auto">
            <span className="text-white/60">Płatność za rezerwację</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Finalizacja płatności</h1>
            <p className="text-white/70">
              Dokończ płatność za wynajem sprzętu budowlanego
            </p>
          </div>

          {reservation && (
            <StripeProvider>
              <PaymentForm
                reservation={reservation}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handleCancel}
              />
            </StripeProvider>
          )}

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}