import React, { useState, useEffect} from 'react';
import { FileUploader } from 'react-drag-drop-files';

/**
 * Resumeupload component allows users to upload a resume file.
 * If a file has already been uploaded, the component will display the file name along with the option to re-upload.
 * The uploaded file is stored in the local storage.
 */
function Resumeupload({setUploadingResume}) {
  // state to store the uploaded file
  const [file, setFile] = useState(null);
  // state to store the upload label
  const [uploadLabel, setUploadLabel] = useState('Upload or drop a file right here ');

  /**
   * Function to handle file upload
   * @param {Object} uploadedFile - uploaded file object
   */
  const handleChange = uploadedFile => {
    setFile(uploadedFile);
  };

  /**
   * useEffect hook to check if a file has already been uploaded and if so, it updates the upload label to display the file name.
   */
  useEffect(() => {
    if(localStorage.getItem("resume")) {
      setUploadLabel(JSON.parse(localStorage.getItem("resume")).name + " (Click or drag to reupload)");
    }
  }, []);

  /**
   * useEffect hook to trigger the file upload process when a file has been selected.
   */
  useEffect(() => {
    if(file) {
      uploadToServer();
    }
  }, [file]);

  /**
   * Async function to upload the file to the server using fetch API
   */
  const uploadToServer = async () => {
    setUploadingResume(true);
    const body = new FormData();
    body.append("file", file);
    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        body
      });
      const data = await response.json();
      const resume = {
        resumeText: data.resume,
        name: file.name
      };
      localStorage.setItem("resume", JSON.stringify(resume));
    } catch (error) {
      console.error('Unable to successfully post to resume api:', error);
    }
    setUploadingResume(false);
  };

  return (
    <>
      <FileUploader 
        handleChange={handleChange} 
        name="file" 
        label={uploadLabel}
      />
    </>
  );
}

export default Resumeupload;
