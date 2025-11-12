import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { 
  CameraView, 
  CameraType, 
  useCameraPermissions, 
  CameraCapturedPicture,
  useMicrophonePermissions,
  VideoQuality // 1. Importar permissão de microfone
} from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMedia } from '../context/PhotoContext'; // 2. Importar o hook do app (useMedia)

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const { addMedia } = useMedia(); // 3. Pegar a função 'addMedia'

  // Permissões
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions(); // 4. Hook do microfone

  // States
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // 5. Novos states para vídeo
  const [mode, setMode] = useState<'picture' | 'video'>('picture');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // 6. Pedir AMBAS as permissões
    (async () => {
      const cameraStatus = await requestCameraPermission();
      const micStatus = await requestMicPermission();
      
      if (cameraStatus.status !== 'granted' || micStatus.status !== 'granted') {
        Alert.alert('Permissões necessárias', 'Precisamos de acesso à câmera e ao microfone.');
        navigation.goBack();
      }
    })();
  }, []);

  // 7. Função de "Registro de FOTO"
  function handleUsePhoto() {
    if (photo) {
      // Adiciona a FOTO ao contexto
      addMedia(photo.uri, 'photo'); 
      setPhoto(null); 
      navigation.navigate('Minhas Fotos'); 
    }
  }

  // 8. Função de "Shutter" (Tirar Foto OU Gravar Vídeo)
  const handleShutterPress = async () => {
    if (mode === 'picture') {
      // --- MODO FOTO ---
      if (cameraRef.current) {
        const pic = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        setPhoto(pic);
      }
    } else {
      // --- MODO VÍDEO ---
      if (isRecording) {
        // PARAR gravação
        cameraRef.current?.stopRecording();
        setIsRecording(false);
      } else {
        // COMEÇAR gravação
        setIsRecording(true);
        if (cameraRef.current) {
          try {
            const video = await cameraRef.current.recordAsync({
          
            });
            if (video) {
    addMedia(video.uri, 'video'); // Adiciona o VÍDEO ao contexto
    navigation.navigate('Minhas Fotos'); // Navega para a galeria
  }
          } catch (e) {
            console.error("Falha ao gravar vídeo:", e);
          } finally {
            setIsRecording(false); // Garante que o estado resete
          }
        }
      }
    }
  };

  // 9. Botão para trocar o modo
  const toggleMode = () => {
    setMode(m => (m === 'picture' ? 'video' : 'picture'));
  };

  // Tela de PREVIEW (Apenas para fotos)
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

  // Tela da CÂMERA (ativa)
  return (
    <View style={styles.container}>

      <CameraView 
        ref={cameraRef} 
        facing={facing} 
        style={StyleSheet.absoluteFill}
        mode={mode} 
     
      />
      
      <View style={styles.bottomButtonContainer}>
        {/* 11. Botão de trocar modo */}
        <TouchableOpacity onPress={toggleMode} style={styles.modeButton}>
          <Ionicons 
            name={mode === 'picture' ? 'camera' : 'videocam'} 
            size={30} 
            color="white" 
          />
        </TouchableOpacity>

        {/* 12. Botão Shutter (muda de cor/estilo) */}
        <TouchableOpacity 
          onPress={handleShutterPress} 
          style={[
            styles.shutterButton,
            mode === 'video' && styles.shutterButtonVideo, // Estilo base de vídeo
            isRecording && styles.shutterButtonRecording // Estilo gravando
          ]} 
        />
        
        {/* Botão de virar câmera (movido para baixo) */}
        <TouchableOpacity onPress={() => setFacing(c => (c === 'back' ? 'front' : 'back'))} style={styles.flipButton}>
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// (Estilos atualizados para vídeo)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  previewContainer: { flex: 1, justifyContent: 'flex-end' },
  previewButtonRow: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 50 },
  previewButton: { alignItems: 'center' },
  previewButtonText: { color: 'white', fontSize: 16 },
  
  bottomButtonContainer: { 
    position: 'absolute', 
    bottom: 40, 
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  
  // Estilos do Shutter (Círculo branco)
  shutterButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: 'white'
  },
  // Círculo vermelho para modo vídeo
  shutterButtonVideo: {
    backgroundColor: '#E63946', // Vermelho
    borderColor: '#E63946',
  },
  // Quadrado vermelho para gravando
  shutterButtonRecording: {
    borderRadius: 10, // Vira um quadrado
    width: 60,
    height: 60,
    backgroundColor: '#E63946',
  },

  // Botões de controle (Virar Câmera, Trocar Modo)
  modeButton: { padding: 10 },
  flipButton: { padding: 10 },
});