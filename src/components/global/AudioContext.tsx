import React, { createContext, useContext, useState } from 'react';

type AudioContextType = {
  audioPath: string | null;
  setAudioPath: (path: string) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audioPath, setAudioPath] = useState<string | null>(null);

  return (
    <AudioContext.Provider value={{ audioPath, setAudioPath }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
