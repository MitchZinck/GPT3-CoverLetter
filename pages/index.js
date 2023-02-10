import Link from 'next/link'
import Head from 'next/head'
import ResumeUpload from '../components/resumeupload'
import Submit from '../components/submit'
import { Box, Heading, Center, Text, ListItem, OrderedList, Divider } from '@chakra-ui/react'

/**
 * HomePage component displays the GPT-3 Cover Letter generator form
 * 
 * @component
 * 
 * @returns {JSX.Element} A React component that renders the form for generating cover letters
 */
function HomePage() {
  return (
    <>
      <Box p={4} width={['95%', '85%', '70%']} margin='auto'>
        <Center>
          <Heading as='h2'>GPT-3 Cover Letter</Heading>
        </Center>
        <Divider colorScheme='blue' />
        <br />
        <OrderedList>
          <ListItem>(Optional) Upload your resume</ListItem>
          <ListItem>Paste a job description below</ListItem>
          <ListItem>Click 'Generate Cover Letter'</ListItem>
        </OrderedList>
        <br />
        <ResumeUpload />
        <br />
        <Submit />
      </Box>
    </>
  )
}

export default HomePage