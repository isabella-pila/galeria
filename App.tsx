import React from 'react';
import { MediaProvider, useMedia } from './src/context/PhotoContext'; // 1. Importe o Provider
import AppNavigator from './src/navigations/AppNavigator';

export default function App() {
  return (
    // 2. Envolva o AppNavigator com o PhotoProvider
<MediaProvider>
      <AppNavigator />
      </MediaProvider>
   
  );
}