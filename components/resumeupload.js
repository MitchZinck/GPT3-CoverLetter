import React, { useState, useEffect} from 'react';
import { FileUploader } from 'react-drag-drop-files';
// import { Text} from '@chakra-ui/react';

function Resumeupload() {
  const [file, setFile] = useState(null);
  const [uploadLabel, setUploadLabel] = useState('Upload or drop a file right here ');
  
  const handleChange = file => {
    setFile(file);
  };
  
  useEffect(() => {
    if(localStorage.getItem("resume")) {
      setUploadLabel(JSON.parse(localStorage.getItem("resume")).name + " (Click or drag to reupload)");
    }
  }, []);
  
  useEffect(() => {
    if(file != null) {
      uploadToServer();
    }
  }, [file]);
  
  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/resume", {
      method: "POST",
      body
    }).then(res => res.json()).then(data => {
      const resume = {
        resumeText: data.resume,
        name: file.name
      };
      localStorage.setItem("resume", JSON.stringify(resume));
    }).catch(error => console.error('Unable to successfully post to resume api:', error));
  };
  
  return (
    <>
    <FileUploader 
    handleChange={handleChange} 
    name="file" 
    label={uploadLabel}
    />
    {/* <Text fontSize='xs'>{message}</Text> */}
    </>
    
    );
  }
  
  export default Resumeupload