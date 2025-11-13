import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useMedia } from '../context/PhotoContext'; // Use o seu MediaContext

export default function ImagePickerOnlyScreen() {
  const navigation = useNavigation<any>();
  const { addMedia } = useMedia();

  // 1. Pegar os dois hooks de permissão do ImagePicker
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

  // 2. Pedir ambas as permissões ao carregar
  useEffect(() => {
    (async () => {
      const cameraStatus = await requestCameraPermission();
      const mediaStatus = await requestMediaLibraryPermission();

      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert('Permissões necessárias', 'Precisamos de acesso à câmera e à galeria.');
      }
    })();
  }, []);

  // 3. Função para ABRIR A CÂMERA (com ImagePicker)
  const openCamera = async () => {
    if (cameraPermission?.status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Permite tirar fotos ou gravar vídeos
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      // A câmera nativa SÓ retorna UM asset
      const asset = result.assets[0];
      const mediaType = asset.type === 'image' ? 'photo' : 'video';
      
      addMedia(asset.uri, mediaType);
      navigation.navigate('Minhas Fotos');
    }
  };

  // 4. Função para ABRIR A GALERIA (com ImagePicker)
  const openGallery = async () => {
    if (mediaLibraryPermission?.status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ // <-- CORREÇÃO AQUI
      mediaTypes: ImagePicker.MediaTypeOptions.All, 
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled && result.assets) {
      for (const asset of result.assets) {
        const mediaType = asset.type === 'image' ? 'photo' : 'video';
        addMedia(asset.uri, mediaType);
      }
      navigation.navigate('Minhas Fotos');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button 
          title="Tirar Foto (Câmera Nativa)" 
          onPress={openCamera} 
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Escolher da Galeria (Galeria Nativa)" 
          onPress={openGallery} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  }
});