"use client";

import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  const updateData = (key, newData) => {
    setData((prev) => ({ ...prev, [key]: newData }));
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
