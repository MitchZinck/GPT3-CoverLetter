import Link from 'next/link'
import Head from 'next/head'
import Resumeupload from '../components/resumeupload'
import Submit from '../components/submit'
import { Box, Heading, Center, Text, ListItem, OrderedList, Divider } from '@chakra-ui/react';

function HomePage(props) {
    return (
        <>
            <Box p={4} width={["95%", "85%", "70%"]} margin='auto'>
                <Center>
                    <Heading as='h2'>
                       GPT-3 Cover Letter
                    </Heading>
                </Center>
                <Divider colorScheme="blue" />
                <br />
                <OrderedList>
                    <ListItem>(Optional) Upload your resume</ListItem>
                    <ListItem>Paste a job description below</ListItem>
                    <ListItem>Click 'Generate Cover Letter'</ListItem>
                </OrderedList>
                <br />
                <Resumeupload />
                <br />
                <Submit />
            </Box>
        </>   
     )
 }
 
 export default HomePage