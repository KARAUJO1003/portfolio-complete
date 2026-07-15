"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ModalContextValue = {
  openKey: string | null;
  open: (key: string) => void;
  close: () => void;
  isOpen: (key: string) => boolean;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const value = useMemo<ModalContextValue>(
    () => ({
      openKey,
      open: setOpenKey,
      close: () => setOpenKey(null),
      isOpen: (key) => openKey === key,
    }),
    [openKey],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}
