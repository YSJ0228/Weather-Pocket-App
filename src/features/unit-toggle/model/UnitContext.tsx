import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

type Unit = "C" | "F";

interface UnitContextType {
  unit: Unit;
  toggleUnit: () => void;
  convertTemp: (temp: number) => number;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider = ({ children }: { children: ReactNode }) => {
  const [unit, setUnit] = useState<Unit>(() => {
    return (localStorage.getItem("weather-pocket-unit") as Unit) || "C";
  });

  useEffect(() => {
    localStorage.setItem("weather-pocket-unit", unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const convertTemp = (temp: number) => {
    if (unit === "C") return temp;
    return (temp * 9) / 5 + 32;
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit, convertTemp }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) throw new Error("useUnit must be used within a UnitProvider");
  return context;
};
