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
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        {!prikaziTabele ? (
          <>
            <div className="flex flex-col">
              <label>Mesec</label>
              <input
                type="number"
                value={mesec}
                onChange={(e) => setMesec(Number(e.target.value))}
                className="border p-2"
              />
            </div>
            <div className="flex flex-col">
              <label>Leto</label>
              <input
                type="number"
                value={leto}
                onChange={(e) => setLeto(Number(e.target.value))}
                className="border p-2"
              />
            </div>
            <button
              onClick={() => setPrikaziTabele(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Potrdi
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-blue-800 mb-6">
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

            <h1 className="text-3xl font-bold text-blue-800 mb-6">
              Tedenska delovišča
            </h1>
            <PivotTabela
              mesec={mesec}
              leto={leto}
              sections={sections}
              workplaceMapping={workplaceMapping}
              workplaces={workplaces}
            />
          </>
        )}
      </div>
    </DataProvider>
  );
}
