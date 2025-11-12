import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Defina o que o Contexto fornece
interface PhotoContextData {
  photos: string[]; // O array com as URIs das fotos salvas
  addPhoto: (uri: string) => void;
}

// 2. Crie o Contexto
const PhotoContext = createContext<PhotoContextData>({} as PhotoContextData);

// 3. Crie o Provedor
export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<string[]>([]);

  const addPhoto = (uri: string) => {
    // Adiciona a nova foto no início da lista
    setPhotos(prev => [uri, ...prev]); 
  };

  return (
    <PhotoContext.Provider value={{ photos, addPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
};

// 4. Crie o Hook customizado
export const usePhotos = () => {
  return useContext(PhotoContext);
};