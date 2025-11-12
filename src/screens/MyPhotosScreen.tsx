import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { usePhotos } from '../context/PhotoContext'; // 1. Importar o hook

const { width } = Dimensions.get('window');
const imageSize = width / 3; // 3 colunas

export default function MyPhotosScreen() {
  // 2. Pegar a lista de fotos do "cérebro" do app
  const { photos } = usePhotos();

  return (
    <View style={styles.container}>
      <FlatList
        data={photos} // 3. Usar o array do contexto
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma foto registrada. Vá para a aba "Câmera" para tirar uma!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 10 },
  image: { 
    width: imageSize, 
    height: imageSize, 
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