import submitStyle from './submit.module.css'
import { useState } from 'react';
import { Progress, Box, FormControl, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Heading} from '@chakra-ui/react';
import { AutoResizeTextarea } from './AutoResizeTextArea';

function buildReqPrompt(resume, jobDesc) {
    let prompt = null;
    if(resume.resumeText && jobDesc) {
        prompt = "Using less than 300 words, create a professional cover letter for me that is based on this job: '" + 
                jobDesc + 
                "' and also based on my resume: '" + 
                resume.resumeText + "'";
    } else if(jobDesc) {
        prompt = "Using less than 300 words, create a professional cover letter for me based on this job: '" + 
                jobDesc + "'"; 
    }
    return prompt;
};

function Submit() {
    const [tabIndex, setTabIndex] = useState(0);
    const [coverLetter, setCoverLetter] = useState('test');
    const [generating, setGenerating] = useState(false);

    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
      console.log("Submitting...");
      setGenerating(true);
      setTabIndex(1);

      // Stop the form from submitting and refreshing the page.
      event.preventDefault()
    
      const resume = JSON.parse(localStorage.getItem("resume"));
      const jobDesc = event.target.jobDesc.value;
      const prompt = buildReqPrompt(resume, jobDesc);

      if(prompt == null) {
        console.log("Generated prompt is null, bad submit.");
      }
  
      // Create data object to send to openapi
      const data = {
        prompt: prompt,
        resume: resume,
        jobDesc: jobDesc
      }
  
      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify(data)
  
      // API endpoint where we send form data.
      const endpoint = '/api/openapi'
  
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      }
  
      const response = await fetch(endpoint, options);
  
      const result = await response.json();
      console.log(result);
      
      setCoverLetter(result.openai);
      setGenerating(false);
    }

    const handleTabsChange = (index) => {
      setTabIndex(index)
    }

    return (
      // We pass the event to the handleSubmit() function on submit.
        <form onSubmit={handleSubmit}>
          <Button width={["100%", "85%", "50%"]} boxShadow='xl' p='6' rounded='md' type='submit' isLoading={generating} loadingText='Generating' colorScheme='green' variant='solid'>
              Generate Cover Letter
            </Button>
            <br />
            <br />
          <FormControl>
            <Box borderWidth='1px' borderRadius='lg' borderColor="orange" overflow='hidden' boxShadow='xl' p='6' rounded='md' bg='white'>
              <Tabs isFitted index={tabIndex} onChange={handleTabsChange}>
                <TabList>
                  <Tab _selected={{ color: 'white', bg: 'orange.500' }}>Job Desc.</Tab>
                  <Tab _selected={{ color: 'white', bg: 'orange.500' }}>Cover Letter</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <AutoResizeTextarea variant="flushed" size="sm" id="jobDesc" name="jobDesc" placeholder="Paste the job description here..." />
                  </TabPanel>
                  <TabPanel>
                    <Progress style={{display: {generating ? block : 'display:none'}}} size='xs' colorScheme="orange" isIndeterminate />,
                    <AutoResizeTextarea style={{!generating ? 'display:block' : 'display:none'}} variant="flushed" size="sm" isReadOnly value={coverLetter} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            </FormControl>
        </form>
    )
  }

  export default Submit