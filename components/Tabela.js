"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";

export default function Tabela({ stolpci, mesec, leto, tableIndex, naziv }) {
  const { updateData } = useData();

  const steviloDniVMesecu = (mesec, leto) => new Date(leto, mesec, 0).getDate();

  const dneviVMesecu = Array.from(
    { length: steviloDniVMesecu(mesec, leto) },
    (_, i) => i + 1
  );

  // ✅ Funkcija preveri vikend
  const jeVikend = (dan, mesec, leto) => {
    const datum = new Date(leto, mesec - 1, dan);
    const danVTednu = datum.getDay();
    return danVTednu === 0 || danVTednu === 6;
  };

  // ✅ Funkcija vrne dan v slovenskem jeziku
  const pridobiImeDneva = (dan, mesec, leto) => {
    const datum = new Date(leto, mesec - 1, dan);
    const dnevi = [
      "nedelja",
      "ponedeljek",
      "torek",
      "sreda",
      "četrtek",
      "petek",
      "sobota",
    ];
    return dnevi[datum.getDay()];
  };

  const [localData, setLocalData] = useState(
    Array.from({ length: dneviVMesecu.length }, () =>
      Array(stolpci.length - 1).fill("")
    )
  );

  useEffect(() => {
    updateData(naziv, localData);
  }, [localData]);

  const handleInputChange = (e, rowIndex, colIndex) => {
    const newData = [...localData];
    newData[rowIndex][colIndex] = e.target.value;
    setLocalData(newData);
  };

  const handlePaste = (e, rowIndex, colIndex) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text/plain");
    const vrstice = clipboardData
      .split("\n")
      .map((vrstica) => vrstica.split("\t"));

    const newData = [...localData];
    vrstice.forEach((vrstica, vrsticaIndex) => {
      vrstica.forEach((celica, stolpecIndex) => {
        if (newData[rowIndex + vrsticaIndex]) {
          newData[rowIndex + vrsticaIndex][colIndex + stolpecIndex] = celica;
        }
      });
    });

    setLocalData(newData);
  };

  const backgroundColors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-purple-50",
    "bg-pink-50",
    "bg-indigo-50",
  ];

  return (
    <div
      className={`mb-8 p-4 rounded-xl shadow-md ${
        backgroundColors[tableIndex % backgroundColors.length]
      }`}
    >
      <h2 className="text-xl text-blue-800 font-bold mb-4 text-center">
        {naziv}
      </h2>

      <div className="w-full">
        <table className="border border-gray-300 w-full table-fixed text-xs">
          <thead>
            <tr>
              {stolpci.map((stolpec, index) => (
                <th
                  key={index}
                  className={`border border-gray-300 px-1 py-1 bg-gray-50 ${
                    index === 0 ? "sticky left-0 z-10 bg-blue-100" : ""
                  }`}
                  style={index === 0 ? { minWidth: "150px" } : {}}
                >
                  {stolpec}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dneviVMesecu.map((dan, index) => {
              const vikend = jeVikend(dan, mesec, leto);
              const danVTednu = pridobiImeDneva(dan, mesec, leto);

              const prikazDatuma = `${dan}.${mesec}.${leto}, ${danVTednu}`;

              return (
                <tr key={index} className={vikend ? "bg-gray-200" : ""}>
                  <td
                    className="border border-gray-300 px-1 py-1 sticky left-0 z-10 bg-blue-100 whitespace-nowrap font-semibold text-xs overflow-hidden text-ellipsis"
                    style={{ minWidth: "150px", maxWidth: "200px" }}
                    title={prikazDatuma} // Tooltip za dodatno pomoč
                  >
                    {prikazDatuma}
                  </td>

                  {stolpci.slice(1).map((_, i) => (
                    <td
                      key={i}
                      className="border border-gray-300 px-1 py-1 text-center"
                    >
                      <input
                        type="text"
                        value={localData[index][i] || ""}
                        onChange={(e) => handleInputChange(e, index, i)}
                        onPaste={(e) => handlePaste(e, index, i)}
                        className="w-full p-1 text-xs"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
