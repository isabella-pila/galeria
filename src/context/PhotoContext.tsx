import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Defina o Tipo de Mídia
export type Media = {
  uri: string;
  type: 'photo' | 'video';
}

// 2. Defina o que o Contexto fornece
interface MediaContextData {
  media: Media[]; // O array de objetos Media
  addMedia: (uri: string, type: 'photo' | 'video') => void; // A função que adiciona
}

// 3. Crie o Contexto
// (Renomeado para MediaContext para clareza)
const MediaContext = createContext<MediaContextData>({} as MediaContextData);

// 4. Crie o Provedor
// (Renomeado para MediaProvider)
export const MediaProvider = ({ children }: { children: ReactNode }) => {
  
  // CORREÇÃO 1: O estado agora é do tipo Media[]
  const [media, setMedia] = useState<Media[]>([]);

  // CORREÇÃO 2: A função agora aceita 'uri' e 'type'
  const addMedia = (uri: string, type: 'photo' | 'video') => {
    
    // CORREÇÃO 3: Crie o novo objeto de mídia
    const newMedia: Media = { uri, type };
    
    // Adiciona o novo objeto no início da lista
    setMedia(prev => [newMedia, ...prev]); 
  };

  return (
    // CORREÇÃO 4: Passe os valores corretos
    <MediaContext.Provider value={{ media, addMedia }}>
      {children}
    </MediaContext.Provider>
  );
};

// 5. Crie o Hook customizado
// (Renomeado para useMedia)
export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia deve ser usado dentro de um MediaProvider');
  }
  return context;
};