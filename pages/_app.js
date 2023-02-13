import '../styles/style.css'
import { useState } from 'react';

import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }) {
   const [uploadingResume, setUploadingResume] = useState(false);
   return (
      <ChakraProvider>
         <Component 
         {...pageProps}
         uploadingResume={uploadingResume}
         setUploadingResume={setUploadingResume} />
      </ChakraProvider>
   );
}