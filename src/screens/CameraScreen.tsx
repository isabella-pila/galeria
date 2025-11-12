import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { 
  CameraView, 
  CameraType, 
  useCameraPermissions, 
  CameraCapturedPicture,
  useMicrophonePermissions,
  VideoQuality
} from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useMedia } from '../context/PhotoContext'; // Importar o useMedia
import * as ImagePicker from 'expo-image-picker'; // 1. Importar o ImagePicker

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const { addMedia } = useMedia();

  // Permissões
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  // 2. Adicionar hook de permissão da galeria
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

  // States
  const [facing, setFacing] = useState<CameraType>('back');
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [mode, setMode] = useState<'picture' | 'video'>('picture');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // 3. Pedir TODAS as 3 permissões
    (async () => {
      const cameraStatus = await requestCameraPermission();
      const micStatus = await requestMicPermission();
      const mediaStatus = await requestMediaLibraryPermission(); // Pedir permissão da galeria
      
      if (cameraStatus.status !== 'granted' || micStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert('Permissões necessárias', 'Precisamos de acesso à câmera, microfone e galeria.');
        navigation.goBack();
      }
    })();
  }, []);

  // 4. NOVA FUNÇÃO: Abrir a galeria com ImagePicker
  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Aceita fotos e vídeos
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        // Loop nos assets e adiciona ao contexto
        for (const asset of result.assets) {
          // O ImagePicker usa 'image', o nosso contexto usa 'photo'
          const mediaType = asset.type === 'image' ? 'photo' : 'video';
          addMedia(asset.uri, mediaType);
        }
        // Navega para a galeria para ver os itens adicionados
        navigation.navigate('Minhas Fotos');
      }
    } catch (e) {
      console.error("Erro ao abrir galeria:", e);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  // Função de "Registro de FOTO" (sem mudança)
  function handleUsePhoto() {
    if (photo) {
      addMedia(photo.uri, 'photo'); 
      setPhoto(null); 
      navigation.navigate('Minhas Fotos'); 
    }
  }

  // Função de "Shutter" (sem mudança)
  const handleShutterPress = async () => {
    if (mode === 'picture') {
      if (cameraRef.current) {
        const pic = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        setPhoto(pic);
      }
    } else {
      if (isRecording) {
        cameraRef.current?.stopRecording();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        if (cameraRef.current) {
          try {
            const video = await cameraRef.current.recordAsync();
            if (video) {
              addMedia(video.uri, 'video');
              navigation.navigate('Minhas Fotos');
            }
          } catch (e) {
            console.error("Falha ao gravar vídeo:", e);
          } finally {
            setIsRecording(false);
          }
        }
      }
    }
  };

  const toggleMode = () => {
    setMode(m => (m === 'picture' ? 'video' : 'picture'));
  };

  // Tela de PREVIEW (Apenas para fotos) (sem mudança)
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
      
      {/* Botão de Virar Câmera (Canto superior) */}
      <View style={styles.topButtonContainer}>
        <TouchableOpacity onPress={() => setFacing(c => (c === 'back' ? 'front' : 'back'))} style={styles.flipButton}>
          <Ionicons name="camera-reverse" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Botões de baixo */}
      <View style={styles.bottomButtonContainer}>
        
        {/* 5. BOTÃO DE GALERIA (Novo) */}
        <TouchableOpacity onPress={openImagePicker} style={styles.galleryButton}>
          <Ionicons name="images" size={30} color="white" />
        </TouchableOpacity>

        {/* Botão Shutter Central */}
        <View style={styles.shutterArea}>
          {/* 6. Botão de trocar modo (Movido para cima do shutter) */}
          <TouchableOpacity onPress={toggleMode} style={styles.modeButton}>
            <Ionicons 
              name={mode === 'picture' ? 'camera' : 'videocam'} 
              size={25} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleShutterPress} 
            style={[
              styles.shutterButton,
              mode === 'video' && styles.shutterButtonVideo,
              isRecording && styles.shutterButtonRecording
            ]} 
          />
        </View>

        {/* Placeholder para centralizar o Shutter */}
        <View style={styles.placeholder} />
      </View>
    </View>
  );
}

// (Estilos atualizados)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  // ... (Estilos de preview)
  previewContainer: { flex: 1, justifyContent: 'flex-end' },
  previewButtonRow: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 50 },
  previewButton: { alignItems: 'center' },
  previewButtonText: { color: 'white', fontSize: 16 },

  // Botão de virar (canto superior)
  topButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  flipButton: { 
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50
  },
  
  // Botões de baixo
  bottomButtonContainer: { 
    position: 'absolute', 
    bottom: 40, 
    width: '100%', 
    flexDirection: 'row',
    justifyContent: 'space-between', // MUDADO
    alignItems: 'center',
    paddingHorizontal: 30, // Adicionado padding
  },
  
  // Botão de Galeria (NOVO)
  galleryButton: { 
    padding: 10,
    width: 50, // Largura fixa
  },

  // Área central (shutter + modo)
  shutterArea: {
    alignItems: 'center',
  },
  modeButton: {
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    marginBottom: 10, // Espaço entre o modo e o shutter
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
  shutterButtonVideo: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  shutterButtonRecording: {
    borderRadius: 10,
    width: 60,
    height: 60,
    backgroundColor: '#E63946',
  },

  // Placeholder para manter o Shutter centralizado
  placeholder: {
    width: 50, // Mesmo tamanho do botão de galeria
  }
});