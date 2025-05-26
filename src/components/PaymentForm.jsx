"use client"
import { useState, useEffect } from 'react'
import { useStripe, useElements, CardElement, PaymentElement } from '@stripe/react-stripe-js'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export function PaymentForm({ reservation, onSuccess, onError, onCancel }) {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [error, setError] = useState('')

  useEffect(() => {
    createPaymentIntent()
  }, [reservation.id])

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await axios.post(`${API_BASE_URL}/api/payments/create-intent`, {
        reservation_id: reservation.id,
        payment_method: paymentMethod,
        return_url: `${window.location.origin}/payment/success`,
        metadata: {
          equipment_name: reservation.equipment?.name,
          customer_email: reservation.customer?.email
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setClientSecret(response.data.client_secret)
    } catch (error) {
      console.error('Błąd tworzenia płatności:', error)
      setError('Nie udało się utworzyć płatności. Spróbuj ponownie.')
      onError?.(error.response?.data?.detail || 'Błąd płatności')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setProcessing(true)
    setError('')

    try {
      // Użyj PaymentElement dla nowoczesnej integracji
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message)
        setProcessing(false)
        return
      }

      // Potwierdź płatność
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?reservation_id=${reservation.id}`,
          receipt_email: reservation.customer?.email
        },
        redirect: 'if_required'
      })

      if (error) {
        setError(error.message)
        onError?.(error.message)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Płatność udana
        onSuccess?.(paymentIntent)
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // Wymaga dodatkowej autoryzacji (3D Secure)
        setError('Płatność wymaga dodatkowej autoryzacji. Sprawdź swój telefon lub email.')
      }
    } catch (error) {
      setError('Wystąpił nieoczekiwany błąd podczas płatności.')
      onError?.(error.message)
    } finally {
      setProcessing(false)
    }
  }

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Przygotowywanie płatności...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
      {/* Podsumowanie płatności */}
      <div className="mb-6 p-4 bg-black/60 rounded-lg">
        <h3 className="text-lg font-bold text-white mb-3">Podsumowanie płatności</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-white/80">
            <span>Sprzęt:</span>
            <span>{reservation.equipment?.name}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Umowa:</span>
            <span>{reservation.contract_number}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Okres:</span>
            <span>
              {new Date(reservation.start_date).toLocaleDateString('pl-PL')} - 
              {new Date(reservation.end_date).toLocaleDateString('pl-PL')}
            </span>
          </div>
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex justify-between text-white font-bold text-lg">
              <span>Do zapłaty:</span>
              <span>{formatPrice(reservation.total_cost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formularz płatności */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wybór metody płatności */}
        <div>
          <label className="block text-white/80 mb-3 text-sm font-medium">
            Metoda płatności
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-lg border transition-all ${
                paymentMethod === 'card'
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/30 bg-black/30 text-white/70 hover:bg-white/5'
              }`}
            >
              💳 Karta
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('blik')}
              className={`p-3 rounded-lg border transition-all ${
                paymentMethod === 'blik'
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/30 bg-black/30 text-white/70 hover:bg-white/5'
              }`}
            >
              📱 BLIK
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('p24')}
              className={`p-3 rounded-lg border transition-all ${
                paymentMethod === 'p24'
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/30 bg-black/30 text-white/70 hover:bg-white/5'
              }`}
            >
              🏦 Przelewy24
            </button>
          </div>
        </div>

        {/* Element płatności Stripe */}
        {clientSecret && (
          <div className="bg-black/60 p-4 rounded-lg">
            <PaymentElement 
              options={{
                layout: 'tabs',
                paymentMethodOrder: [paymentMethod, 'card'],
                defaultValues: {
                  billingDetails: {
                    email: reservation.customer?.email,
                    name: reservation.customer?.name
                  }
                }
              }}
            />
          </div>
        )}

        {/* Błąd */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Przyciski */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors"
            disabled={processing}
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            className="flex-1 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Przetwarzanie...
              </div>
            ) : (
              `Zapłać ${formatPrice(reservation.total_cost)}`
            )}
          </button>
        </div>
      </form>

      {/* Informacje o bezpieczeństwie */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-center space-x-4 text-white/60 text-xs">
          <span>🔒 Płatność zabezpieczona przez Stripe</span>
          <span>•</span>
          <span>🛡️ SSL/TLS szyfrowanie</span>
          <span>•</span>
          <span>✅ PCI DSS compliant</span>
        </div>
      </div>
    </div>
  )
}
