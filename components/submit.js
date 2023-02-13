import submitStyle from './submit.module.css';
import { useState, useEffect } from 'react';
import { Progress, Box, FormControl, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Heading } from '@chakra-ui/react';
import { AutoResizeTextarea } from './AutoResizeTextArea';

/**
* Submit component for generating cover letters
*/
function Submit({uploadingResume}) {
  // State hook to store the selected tab index
  const [tabIndex, setTabIndex] = useState(0);
  // State hook to store the generated cover letter
  const [coverLetter, setCoverLetter] = useState();
  // State hook to store the state of the form
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    setGenerating(uploadingResume);
  }, [uploadingResume]);
  
  /**
  * Handles the submit event on form submit
  * @param {Event} event - The submit event object
  */
  const handleSubmit = async (event) => {
    console.log("Submitting...");
    setGenerating(true);
    setTabIndex(1);
    
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();
    
    // Get the resume data from local storage
    const resume = JSON.parse(localStorage.getItem("resume"));
    // Get the job description from the form
    const jobDesc = event.target.elements.jobDesc.value;
    
    // Create data object to send to OpenAI
    const data = {
      resume: resume,
      jobDesc: jobDesc
    };
    
    // Convert the data object to JSON format
    const JSONdata = JSON.stringify(data);
    
    // API endpoint for sending form data
    let endpoint = '/api/openapi';
    
    // Form the request options for sending data to the server
    const options = {
      // The request method is POST because we are sending data
      method: 'POST',
      // Specify the request header as application/json
      headers: {
        'Content-Type': 'application/json',
      },
      // The request body is the JSON data we created above
      body: JSONdata,
    };
    
    // Send the request to the server
    const response = await fetch(endpoint, options);
    
    // Get the response from the server
    const result = await response.json();
    console.log(result);
    
    // Set the generated cover letter in the state
    setCoverLetter(result.openai);
    setGenerating(false);
  };
  
  /**
  * Handle the change event of the tabs
  * @param {Number} index - The index of the selected tab
  */
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };
  
  return (
    // Render the form
    <form onSubmit={handleSubmit}>
    <Button width={["100%", "85%", "50%"]} boxShadow='xl' p='6' rounded='md' type='submit' isLoading={generating} 
    loadingText={uploadingResume ? 'Please wait...' : 'Generating'} colorScheme='green' variant='solid'>
    {uploadingResume ? 'Please wait...' : 'Generate Cover Letter'}
    </Button>
    <br />
    <br />
    <FormControl>
    <Box borderWidth='1px' borderRadius='lg' borderColor="orange" overflow='hidden' boxShadow='xl' p='6' rounded='md' bg='white'>
    <Tabs isFitted index={tabIndex} onChange={handleTabsChange}>
    <TabList>
    <Tab _selected={{ color: 'white', bg: 'orange.500' }}>Job Description</Tab>
    <Tab _selected={{ color: 'white', bg: 'orange.500' }}>Cover Letter</Tab>
    </TabList>
    <TabPanels>
    <TabPanel>
    <AutoResizeTextarea variant="flushed" size="sm" id="jobDesc" name="jobDesc" placeholder="Paste the job description here..." />
    </TabPanel>
    <TabPanel>
    <Progress style={{display: generating ? 'block' : 'none'}} size='xs' data-testid="progressbar" colorScheme="orange" isIndeterminate />
    <AutoResizeTextarea style={{display: !generating ? 'block' : 'none'}} data-testid="coverLetterTextArea" variant="flushed" size="sm" isReadOnly value={coverLetter} />
    </TabPanel>
    </TabPanels>
    </Tabs>
    </Box>
    </FormControl>
    </form>
    )
  }
  
  export default Submit