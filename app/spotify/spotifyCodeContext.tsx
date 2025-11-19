"use client";

import React, { createContext, useContext, useState } from 'react';

const SpotifyCodeContext = createContext({
  spotifyCode: null as string | null,
  setSpotifyCode: (code: string | null) => {},
});

export const SpotifyCodeProvider = ({ children }: { children: React.ReactNode }) => {
  const [spotifyCode, setSpotifyCode] = useState<string | null>(null);
  return (
    <SpotifyCodeContext.Provider value={{ spotifyCode, setSpotifyCode }}>
      {children}
    </SpotifyCodeContext.Provider>
  );
};

export const useSpotifyCode = () => useContext(SpotifyCodeContext);