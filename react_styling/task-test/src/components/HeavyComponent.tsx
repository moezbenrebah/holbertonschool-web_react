'use client';

import React, { useEffect, useState } from 'react';

// Simuler un composant lourd qui prend du temps à charger
const HeavyComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simuler une opération intensive
  useEffect(() => {
    // Simuler un chargement long
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-md p-4 mx-auto mt-5 bg-white rounded-md shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Composant chargé dynamiquement</h2>
      <p className="mb-6 text-gray-700">
        Ce composant a été chargé dynamiquement avec next/dynamic,
        ce qui améliore le temps de chargement initial de la page.
        {isLoaded ? (
          <span className="block mt-2 font-semibold text-green-600">
            Contenu complètement chargé !
          </span>
        ) : null}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Action 1
        </button>
        <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
          Action 2
        </button>
      </div>
    </div>
  );
};

export default HeavyComponent;
