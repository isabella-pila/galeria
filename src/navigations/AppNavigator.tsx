import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importe suas duas telas
import CameraScreen from '../screens/CameraScreen';
import MyPhotosScreen from '../screens/MyPhotosScreen';
import ImagePickerScreen from '../screens/Camera-imgPicker';
import CameraScreen_midia from '../screens/Camera-midia-library'

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconName = route.name === 'Câmera'
              ? focused ? 'camera' : 'camera-outline'
              : focused ? 'images' : 'images-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Câmera" 
          component={CameraScreen} 
          options={{ headerShown: false }} // Esconde o header da câmera
        />
        <Tab.Screen 
          name="Minhas Fotos" 
          component={MyPhotosScreen} 
        />
         <Tab.Screen 
          name="ImagePicker" 
          component={ImagePickerScreen} 
          options={{ headerShown: false }} // Esconde o header da câmera
        />
              <Tab.Screen 
          name="midia-libary" 
          component={CameraScreen_midia} 
          options={{ headerShown: false }} // Esconde o header da câmera
        />
      </Tab.Navigator>
         
  
    </NavigationContainer>
  );
}