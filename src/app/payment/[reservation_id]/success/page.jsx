"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState(null)
  const reservationId = searchParams.get('reservation_id')

  useEffect(() => {
    if (reservationId) {
      confirmPayment()
    }
  }, [reservationId])

  const confirmPayment = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReservation(response.data)
    } catch (error) {
      console.error('Błąd potwierdzania płatności:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Potwierdzanie płatności...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 text-center border border-white/20 max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-white mb-4">Płatność zakończona pomyślnie!</h1>
        
        {reservation && (
          <div className="bg-black/60 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-2">Szczegóły rezerwacji:</h3>
            <div className="text-sm text-white/80 space-y-1">
              <p>Umowa: {reservation.contract_number}</p>
              <p>Sprzęt: {reservation.equipment?.name}</p>
              <p>Kwota: {reservation.total_cost?.toLocaleString()} zł</p>
              <p>Status: {reservation.status}</p>
            </div>
          </div>
        )}
        
        <p className="text-white/70 mb-6">
          Dziękujemy za skorzystanie z naszych usług. Potwierdzenie płatności zostało wysłane na Twój email.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-colors"
          >
            Powrót do strony głównej
          </Link>
          
          {reservation && (
            <Link 
              href={`/dashboard`}
              className="block w-full py-3 bg-black/60 hover:bg-black/80 text-white border border-white/20 rounded-lg transition-colors"
            >
              Zobacz moje rezerwacje
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
