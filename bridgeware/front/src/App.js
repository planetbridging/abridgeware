import logo from './logo.svg';
import './App.css';

import * as React from 'react'

import Home from "./home";
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  )
}

export default App;
