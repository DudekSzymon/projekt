// components/CarCard.jsx
"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CarCard = ({ car }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Status badge component
  const StatusBadge = ({ available }) => (
    <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${
      available ? 'bg-white text-black' : 'bg-gray-600 text-white'
    }`}>
      {available ? 'Dostępny' : 'Niedostępny'}
    </div>
  );

  return (
    <div className="bg-black rounded-lg shadow-lg overflow-hidden border border-gray-800 hover:border-white transition-all duration-300">
      {/* Car Image */}
      <div className="h-48 relative">
        {car.image ? (
          <Image 
            src={car.image} 
            alt={`${car.brand} ${car.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover grayscale"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <span className="text-3xl text-gray-500">🚗</span>
          </div>
        )}
        <StatusBadge available={car.available} />
      </div>

      {/* Car Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{car.brand} {car.model}</h3>
          <p className="text-white font-bold">{car.price} zł/dzień</p>
        </div>
        
        <div className="text-gray-300 text-sm mb-4">
          <p>Rok produkcji: {car.year}</p>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4">
          <div className="flex items-center">
            <span className="mr-1">⚙️</span>
            <span>{car.transmission || 'Automatyczna'}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⛽</span>
            <span>{car.fuel || 'Benzyna'}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">👥</span>
            <span>{car.seats || '5'} miejsc</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">🧳</span>
            <span>{car.luggage || '3'} walizki</span>
          </div>
        </div>

        {/* Expandable Details */}
        <div>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-white hover:text-gray-300 text-sm flex items-center mb-2"
          >
            {showDetails ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
            <span className="ml-1">{showDetails ? '▲' : '▼'}</span>
          </button>
          
          {showDetails && (
            <div className="text-sm text-gray-300 mt-2 pl-2 border-l-2 border-white">
              <p>• Klimatyzacja</p>
              <p>• System nawigacji GPS</p>
              <p>• Bluetooth</p>
              <p>• Kamera cofania</p>
              {car.features?.map((feature, index) => (
                <p key={index}>• {feature}</p>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link 
            href={`/samochody/${car.id}`}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 text-center rounded text-sm"
          >
            Szczegóły
          </Link>
          
          <button
            disabled={!car.available}
            className={`
              flex-1 py-2 text-center rounded text-sm font-medium
              ${car.available 
                ? 'bg-white hover:bg-gray-200 text-black' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
            `}
          >
            Zarezerwuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;