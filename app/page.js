"use client";

import { useState } from "react";
import { DataProvider } from "@/context/DataContext";
import Tabela from "@/components/Tabela";
import PivotTabela from "@/components/PivotTabela";
import { sections } from "@/config/config";
import { workplaces, workplaceMapping } from "@/config/workplaces";

export default function Home() {
  const [mesec, setMesec] = useState(1);
  const [leto, setLeto] = useState(2024);
  const [prikaziTabele, setPrikaziTabele] = useState(false);

  return (
    <DataProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        {!prikaziTabele ? (
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            {/* Ikona */}
            <img
              src="/ikona.png"
              alt="Ikona"
              className="w-16 h-16 mx-auto mb-4"
            />

            {/* Naslov */}
            <h1 className="text-xl font-semibold text-gray-800 mb-6">
              Izberi mesec in leto za izdelavo tedenskih delovišč
            </h1>

            {/* Preostali del forme */}
            <div className="flex flex-col mb-4">
              <label className="text-gray-700 mb-1">Mesec</label>
              <input
                type="number"
                value={mesec}
                onChange={(e) => setMesec(Number(e.target.value))}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col mb-6">
              <label className="text-gray-700 mb-1">Leto</label>
              <input
                type="number"
                value={leto}
                onChange={(e) => setLeto(Number(e.target.value))}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              onClick={() => setPrikaziTabele(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-300"
            >
              Potrdi
            </button>
          </div>
        ) : (
          <div className="w-full px-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
              Vnesi podatke v tabele dežurstev in oddelkov ter avtomatsko
              ustvari tedenska delovišča
            </h1>

            {Object.keys(sections).map((nazivSekcije, index) => (
              <Tabela
                key={nazivSekcije}
                stolpci={sections[nazivSekcije]}
                mesec={mesec}
                leto={leto}
                naziv={nazivSekcije}
              />
            ))}

            <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
              Tedenska delovišča
            </h1>

            <PivotTabela
              mesec={mesec}
              leto={leto}
              sections={sections}
              workplaceMapping={workplaceMapping}
              workplaces={workplaces}
            />
          </div>
        )}
      </div>
    </DataProvider>
  );
}
