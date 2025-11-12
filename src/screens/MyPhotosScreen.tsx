import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { useMedia } from '../context/PhotoContext'; // 1. Importar o hook (useMedia)
import { VideoView, useVideoPlayer } from 'expo-video'; // 2. Importar o Player de Vídeo

const { width } = Dimensions.get('window');
const mediaSize = width / 3; // 3 colunas

// 3. Componente de item (para otimizar o FlatList)
const MediaItem = ({ item }: { item: any }) => {
  
  // Hook do player (só será usado se for vídeo)
  const player = useVideoPlayer(item.uri, player => {
    player.play();
  player.loop = true;
 player.muted = true;
  });

  if (item.type === 'video') {
    return (
      <VideoView
        style={styles.media}
        player={player}
        allowsFullscreen={false} // Desabilita fullscreen no grid
      />
    );
  }

  // Se for foto
  return (
    <Image source={{ uri: item.uri }} style={styles.media} />
  );
};

export default function MyPhotosScreen() {
  // 4. Pegar a lista de mídia do "cérebro"
  const { media } = useMedia();

  return (
    <View style={styles.container}>
      <FlatList
        data={media} // 5. Usar o array 'media'
        keyExtractor={(item) => item.uri} // Usar a URI como chave
        numColumns={3}
        renderItem={({ item }) => <MediaItem item={item} />} // 6. Renderizar o novo componente
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum item registrado. Vá para a aba "Câmera"!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 2 }, // Ajuste no padding
  media: { // 7. Estilo unificado para foto e vídeo
    width: mediaSize, 
    height: mediaSize, 
    borderWidth: 1, 
    borderColor: '#fff' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    paddingHorizontal: 20
  }
});