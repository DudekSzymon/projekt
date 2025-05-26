"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [equipment, setEquipment] = useState([])
  const [reservations, setReservations] = useState([])
  const [customers, setCustomers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState('')

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    daily_rate: '',
    description: '',
    weight: '',
    fuel_type: '',
    power: '',
    reach: ''
  })

  // Sprawdzenie uprawnień administratora
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.is_admin) {
        alert('Brak uprawnień administratora!')
        router.push('/')
        return
      }
      
      setUser(parsedUser)
      fetchDashboardData()
    } catch (error) {
      console.error('Błąd:', error)
      localStorage.clear()
      router.push('/login')
    }
  }, [router])

  // Pobieranie danych
  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token')
    
    try {
      setLoading(true)
      
      const [statsRes, equipmentRes, reservationsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/statistics`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/equipment`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reservations`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      setStats(statsRes.data)
      setEquipment(equipmentRes.data)
      setReservations(reservationsRes.data)

    } catch (error) {
      console.error('Błąd:', error)
      if (error.response?.status === 401) {
        localStorage.clear()
        router.push('/login')
      }
      setError('Błąd pobierania danych')
    } finally {
      setLoading(false)
    }
  }

  // Wylogowanie
  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  // Modal functions
  const openModal = (type, item = null) => {
    setModalType(type)
    setEditingItem(item)
    if (item && type === 'equipment') {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        daily_rate: item.daily_rate || '',
        description: item.description || '',
        weight: item.weight || '',
        fuel_type: item.fuel_type || '',
        power: item.power || '',
        reach: item.reach || ''
      })
    } else {
      setFormData({
        name: '',
        category: '',
        daily_rate: '',
        description: '',
        weight: '',
        fuel_type: '',
        power: '',
        reach: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({
      name: '',
      category: '',
      daily_rate: '',
      description: '',
      weight: '',
      fuel_type: '',
      power: '',
      reach: ''
    })
  }

  // Zapisz sprzęt
  const handleSaveEquipment = async () => {
    const token = localStorage.getItem('token')
    
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        daily_rate: parseFloat(formData.daily_rate),
        description: formData.description,
        weight: formData.weight,
        fuel_type: formData.fuel_type,
        power: formData.power,
        reach: formData.reach,
        features: [],
        specifications: {}
      }

      if (editingItem) {
        await axios.put(`${API_BASE_URL}/api/equipment/${editingItem.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_BASE_URL}/api/equipment`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      fetchDashboardData()
      closeModal()
      alert('Sprzęt zapisany!')
    } catch (error) {
      console.error('Błąd:', error)
      alert('Błąd zapisywania sprzętu')
    }
  }

  // Usuń sprzęt
  const handleDeleteEquipment = async (id) => {
    if (!confirm('Usunąć sprzęt?')) return
    
    const token = localStorage.getItem('token')
    
    try {
      await axios.delete(`${API_BASE_URL}/api/equipment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDashboardData()
      alert('Sprzęt usunięty!')
    } catch (error) {
      console.error('Błąd:', error)
      alert('Błąd usuwania')
    }
  }

  // Zmień status rezerwacji
  const handleUpdateReservationStatus = async (id, status) => {
    const token = localStorage.getItem('token')
    
    try {
      await axios.put(`${API_BASE_URL}/api/reservations/${id}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchDashboardData()
      alert(`Status zmieniony na: ${status}`)
    } catch (error) {
      console.error('Błąd:', error)
      alert('Błąd zmiany statusu')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'rented': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      'available': 'Dostępny',
      'rented': 'Wypożyczony',
      'maintenance': 'Konserwacja',
      'active': 'Aktywne',
      'pending': 'Oczekujące',
      'completed': 'Zakończone'
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">* SpellBudex Dashboard</h1>
            <span className="text-gray-400">Admin: {user?.name}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              🏠 Strona główna
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              🚪 Wyloguj
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { id: 'overview', label: '📊 Przegląd' },
              { id: 'equipment', label: '🔧 Sprzęt' },
              { id: 'reservations', label: '📅 Rezerwacje' },
              { id: 'customers', label: '👥 Klienci' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded ${
                  activeTab === tab.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {error && (
            <div className="bg-red-900 border border-red-700 rounded p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">📊 Przegląd firmy</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-400">{stats.equipment?.total || 0}</div>
                  <div className="text-gray-400">Łączny sprzęt</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{stats.equipment?.available || 0}</div>
                  <div className="text-gray-400">Dostępny sprzęt</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-400">{stats.reservations?.active || 0}</div>
                  <div className="text-gray-400">Aktywne rezerwacje</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-400">{(stats.revenue?.monthly || 0).toLocaleString()} zł</div>
                  <div className="text-gray-400">Przychód miesięczny</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-4">📋 Ostatnie rezerwacje</h3>
                  <div className="space-y-3">
                    {reservations.slice(0, 5).map(reservation => {
                      const equipmentItem = equipment.find(e => e.id === reservation.equipment_id)
                      return (
                        <div key={reservation.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                          <div>
                            <div className="font-medium">{equipmentItem?.name || 'Nieznany sprzęt'}</div>
                            <div className="text-sm text-gray-400">{reservation.contract_number}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(reservation.status)}`}>
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-4">📈 Status sprzętu</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Dostępny</span>
                      <span className="text-green-400">{stats.equipment?.available || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wypożyczony</span>
                      <span className="text-yellow-400">{stats.equipment?.rented || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Konserwacja</span>
                      <span className="text-red-400">{stats.equipment?.maintenance || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">🔧 Zarządzanie sprzętem</h2>
                <button 
                  onClick={() => openModal('equipment')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  ➕ Dodaj sprzęt
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4">Nazwa</th>
                      <th className="text-left py-3 px-4">Kategoria</th>
                      <th className="text-left py-3 px-4">Stawka/dzień</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map(item => (
                      <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-400">{item.description}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4">{item.daily_rate} zł</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openModal('equipment', item)}
                              className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs"
                            >
                              ✏️ Edytuj
                            </button>
                            <button 
                              onClick={() => handleDeleteEquipment(item.id)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                            >
                              🗑️ Usuń
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">📅 Zarządzanie rezerwacjami</h2>
              
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left py-3 px-4">Nr umowy</th>
                      <th className="text-left py-3 px-4">Sprzęt</th>
                      <th className="text-left py-3 px-4">Okres</th>
                      <th className="text-left py-3 px-4">Koszt</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(reservation => {
                      const equipmentItem = equipment.find(e => e.id === reservation.equipment_id)
                      return (
                        <tr key={reservation.id} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="py-3 px-4 font-mono text-sm">{reservation.contract_number}</td>
                          <td className="py-3 px-4">{equipmentItem?.name || 'Nieznany'}</td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(reservation.start_date).toLocaleDateString('pl-PL')} - 
                            {new Date(reservation.end_date).toLocaleDateString('pl-PL')}
                          </td>
                          <td className="py-3 px-4">{reservation.total_cost?.toLocaleString()} zł</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(reservation.status)}`}>
                              {getStatusText(reservation.status)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {reservation.status === 'pending' && (
                                <button 
                                  onClick={() => handleUpdateReservationStatus(reservation.id, 'active')}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                                >
                                  ✅ Zatwierdź
                                </button>
                              )}
                              {reservation.status === 'active' && (
                                <button 
                                  onClick={() => handleUpdateReservationStatus(reservation.id, 'completed')}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                                >
                                  🏁 Zakończ
                                </button>
                              )}
                              <button 
                                onClick={() => handleUpdateReservationStatus(reservation.id, 'cancelled')}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                              >
                                ❌ Anuluj
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">👥 Lista klientów</h2>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <p className="text-gray-400 mb-4">Klienci tworzeni automatycznie podczas rezerwacji</p>
                <div className="text-2xl font-bold text-blue-400">{stats?.customers?.total || 0} klientów</div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingItem ? 'Edytuj sprzęt' : 'Dodaj sprzęt'}
            </h3>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nazwa sprzętu"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="">Wybierz kategorię</option>
                <option value="Maszyny ziemne">Maszyny ziemne</option>
                <option value="Żurawie">Żurawie</option>
                <option value="Rusztowania">Rusztowania</option>
                <option value="Transport betonu">Transport betonu</option>
                <option value="Narzędzia pneumatyczne">Narzędzia pneumatyczne</option>
                <option value="Zagęszczanie">Zagęszczanie</option>
              </select>
              
              <input
                type="number"
                placeholder="Stawka dzienna (zł)"
                value={formData.daily_rate}
                onChange={(e) => setFormData({...formData, daily_rate: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              
              <textarea
                placeholder="Opis"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                rows="2"
              />
              
              <input
                type="text"
                placeholder="Waga (np. 20 ton)"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              
              <input
                type="text"
                placeholder="Typ paliwa (np. Diesel)"
                value={formData.fuel_type}
                onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              
              <input
                type="text"
                placeholder="Moc (np. 129 kW)"
                value={formData.power}
                onChange={(e) => setFormData({...formData, power: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              
              <input
                type="text"
                placeholder="Zasięg (np. 9.5m)"
                value={formData.reach}
                onChange={(e) => setFormData({...formData, reach: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Anuluj
              </button>
              <button 
                onClick={handleSaveEquipment}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                {editingItem ? 'Zapisz' : 'Dodaj'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}