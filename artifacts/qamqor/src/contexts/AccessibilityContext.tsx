import React, { createContext, useContext, useEffect, useState } from "react";

interface AccessibilityContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("qamqor-high-contrast") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
    localStorage.setItem("qamqor-high-contrast", String(isHighContrast));
  }, [isHighContrast]);

  const toggleHighContrast = () => setIsHighContrast((prev) => !prev);

  return (
    <AccessibilityContext.Provider value={{ isHighContrast, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
