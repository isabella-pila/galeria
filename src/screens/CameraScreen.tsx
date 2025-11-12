import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePhotos } from '../context/PhotoContext'; // 1. Importar o hook do app

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const { addPhoto } = usePhotos(); // 2. Pegar a função do "cérebro"

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    // (Lógica para pedir permissão...)
  }, []);

  async function takePicture() {
    if (cameraRef.current) {
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setPhoto(pic);
    }
  }

  // 3. Função de "Registro"
  function handleUsePhoto() {
    if (photo) {
      // Adiciona a foto ao nosso "cérebro" (Context)
      addPhoto(photo.uri); 
      
      // Limpa a tela de preview
      setPhoto(null); 
      
      // 4. Navega para a outra aba para o usuário ver
      navigation.navigate('Minhas Fotos'); 
    }
  }

  // Se uma foto foi tirada (preview)
  if (photo) {
    return (
      <ImageBackground source={{ uri: photo.uri }} style={styles.previewContainer}>
        <View style={styles.previewButtonRow}>
          <TouchableOpacity onPress={() => setPhoto(null)} style={styles.previewButton}>
            <Ionicons name="refresh" size={40} color="white" />
            <Text style={styles.previewButtonText}>Repetir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUsePhoto} style={styles.previewButton}>
            <Ionicons name="checkmark" size={40} color="white" />
            <Text style={styles.previewButtonText}>Usar Foto</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  // Se nenhuma foto foi tirada (câmera ativa)
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} facing={facing} style={StyleSheet.absoluteFill} />
      
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity onPress={takePicture} style={styles.shutterButton} />
      </View>
      <View style={styles.topButtonContainer}>
        <TouchableOpacity onPress={() => setFacing(c => (c === 'back' ? 'front' : 'back'))}>
          <Ionicons name="camera-reverse" size={35} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// (Estilos simplificados para a câmera...)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  previewContainer: { flex: 1, justifyContent: 'flex-end' },
  previewButtonRow: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 50 },
  previewButton: { alignItems: 'center' },
  previewButtonText: { color: 'white', fontSize: 16 },
  bottomButtonContainer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
  topButtonContainer: { position: 'absolute', top: 60, right: 20 },
  shutterButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white' }
});