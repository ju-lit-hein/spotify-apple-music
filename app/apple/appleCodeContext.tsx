"use client";

import React, { createContext, useContext, useState } from 'react';

const AppleCodeContext = createContext({
  appleCode: null as string | null,
  setAppleCode: (code: string | null) => {},
});

export const AppleCodeProvider = ({ children }: { children: React.ReactNode }) => {
  const [appleCode, setAppleCode] = useState<string | null>(null);
  return (
    <AppleCodeContext.Provider value={{ appleCode, setAppleCode }}>
      {children}
    </AppleCodeContext.Provider>
  );
};

export const useAppleCode = () => useContext(AppleCodeContext);