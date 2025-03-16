"use client";

import { useMemo } from "react";
import { useData } from "@/context/DataContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function PivotTabela({
  mesec,
  leto,
  sections,
  workplaceMapping,
  workplaces,
}) {
  const { data } = useData();

  const jeVikend = (datumString) => {
    if (!datumString) return false;

    const [dan, mesec, leto] = datumString.split(".").map(Number);
    const datum = new Date(leto, mesec - 1, dan);
    const danVTednu = datum.getDay();

    return danVTednu === 0 || danVTednu === 6;
  };

  const zdruzeniPodatki = useMemo(() => {
    const zdruzeni = {};

    workplaces.forEach((delovisce) => {
      const mappings = workplaceMapping[delovisce];
      if (!mappings) return;

      if (!zdruzeni[delovisce]) {
        zdruzeni[delovisce] = {};
      }

      mappings.forEach((mapiranKljuc) => {
        const [imeOddelka, stolpec] = mapiranKljuc.split(".");
        const tableData = data[imeOddelka];
        if (!tableData) return;

        const stolpci = sections[imeOddelka];
        const colIndex = stolpci.indexOf(stolpec);
        if (colIndex === -1) return;

        tableData.forEach((row, rowIndex) => {
          const value = row[colIndex - 1];
          if (!value) return;

          const datum = `${rowIndex + 1}.${mesec}.${leto}`;

          if (!zdruzeni[delovisce][datum]) {
            zdruzeni[delovisce][datum] = [];
          }

          zdruzeni[delovisce][datum].push(value);
        });
      });
    });

    Object.keys(zdruzeni).forEach((delovisce) => {
      Object.keys(zdruzeni[delovisce]).forEach((datum) => {
        const vrednosti = zdruzeni[delovisce][datum];
        zdruzeni[delovisce][datum] = vrednosti.join(", ");
      });
    });

    return zdruzeni;
  }, [data, mesec, leto, sections, workplaceMapping, workplaces]);

  const weeks = useMemo(() => {
    const totalDays = new Date(leto, mesec, 0).getDate();
    const firstDay = new Date(leto, mesec - 1, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const weeks = [];
    let week = [];
    const dayNames = ["Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"];

    for (let i = 0; i < offset; i++) {
      week.push({ dan: dayNames[i], datum: null });
    }

    for (let day = 1; day <= totalDays; day++) {
      const datumObj = new Date(leto, mesec - 1, day);
      const dayIndex = datumObj.getDay() === 0 ? 6 : datumObj.getDay() - 1;

      week.push({
        dan: dayNames[dayIndex],
        datum: `${day}.${mesec}.${leto}`,
      });

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ dan: "", datum: null });
      }
      weeks.push(week);
    }

    return weeks;
  }, [mesec, leto]);

  const backgroundColors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-purple-50",
    "bg-pink-50",
    "bg-indigo-50",
  ];

  const exportToExcelWithExcelJS = async () => {
    const workbook = new ExcelJS.Workbook();

    weeks.forEach((week, weekIndex) => {
      const worksheet = workbook.addWorksheet(`Teden ${weekIndex + 1}`);

      const headerRow = ["Delovišče", ...week.map((d) => d.dan || "")];
      const dateRow = ["", ...week.map((d) => d.datum || "")];

      worksheet.addRow(headerRow);
      worksheet.addRow(dateRow);

      workplaces.forEach((delovisce) => {
        const row = [delovisce];
        week.forEach((day) => {
          const datum = day.datum;
          const vrednost = datum
            ? zdruzeniPodatki[delovisce]?.[datum] || ""
            : "";
          row.push(vrednost);
        });
        worksheet.addRow(row);
      });

      worksheet.columns.forEach((col, index) => {
        col.width = index === 0 ? 25 : 12;
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          cell.alignment = {
            vertical: "middle",
            horizontal: colNumber === 1 ? "left" : "center",
          };

          cell.font = {
            name: "Arial",
            size: 10,
          };

          if (rowNumber === 2) {
            cell.border.bottom = { style: "medium" };
          }

          if (
            rowNumber > 2 &&
            workplaces[rowNumber - 3] === "Dežurni Neonatolog"
          ) {
            cell.border.bottom = { style: "medium" };
          }

          const isWeekend =
            rowNumber >= 3 &&
            week[colNumber - 1] &&
            jeVikend(week[colNumber - 1].datum);

          if (isWeekend) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE0E0E0" },
            };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `Dezurstva_${mesec}_${leto}.xlsx`);
  };

  return (
    <div className="w-full px-4">
      {weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className={`mb-8 p-4 rounded-xl shadow-md ${
            backgroundColors[weekIndex % backgroundColors.length]
          }`}
        >
          <h2 className="text-xl text-red-800 font-bold mb-4 text-center">
            Teden {weekIndex + 1}
          </h2>

          <div className="w-full overflow-x-auto">
            <table className="border border-gray-300 w-full text-xs">
              <thead>
                <tr>
                  <th
                    className="border border-gray-300 px-2 py-2 bg-blue-100 sticky left-0 top-0 z-20 whitespace-nowrap text-left"
                    style={{ minWidth: "150px" }}
                  >
                    Delovišče
                  </th>
                  {week.map((day, index) => (
                    <th
                      key={index}
                      className={`border border-gray-300 px-2 py-2 bg-gray-50 sticky top-0 z-10 ${
                        jeVikend(day.datum) ? "bg-gray-200" : ""
                      }`}
                    >
                      {day.dan}
                    </th>
                  ))}
                </tr>
                <tr className="border-b-2 border-gray-300">
                  <th
                    className="border border-gray-300 px-2 py-2 bg-blue-100 sticky left-0 top-[2.5rem] z-20 whitespace-nowrap text-left"
                    style={{ minWidth: "150px" }}
                  ></th>
                  {week.map((day, index) => (
                    <th
                      key={index}
                      className={`border border-gray-300 px-2 py-2 bg-gray-50 sticky top-[2.5rem] z-10 ${
                        jeVikend(day.datum) ? "bg-gray-200" : ""
                      }`}
                    >
                      {day.datum || ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workplaces.map((delovisce) => {
                  const isNeonatolog = delovisce === "Dežurni Neonatolog";
                  return (
                    <tr
                      key={delovisce}
                      className={
                        isNeonatolog ? "border-b-2 border-gray-400" : ""
                      }
                    >
                      <td
                        className="border border-gray-300 px-2 py-2 font-semibold bg-blue-100 sticky left-0 z-10 whitespace-nowrap text-left"
                        style={{ minWidth: "150px" }}
                      >
                        {delovisce}
                      </td>
                      {week.map((day, index) => (
                        <td
                          key={index}
                          className={`border border-gray-300 px-2 py-2 text-center ${
                            jeVikend(day.datum) ? "bg-gray-200" : "bg-white"
                          }`}
                        >
                          {day.datum && zdruzeniPodatki[delovisce]?.[day.datum]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          onClick={exportToExcelWithExcelJS}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all duration-300 mt-8"
        >
          Izvozi v Excel (ExcelJS)
        </button>
      </div>
    </div>
  );
}
