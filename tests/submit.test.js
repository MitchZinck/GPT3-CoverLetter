import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import Submit from '../components/submit.js';
import { Configuration, OpenAIApi } from 'openai';

// Mocking the OpenAI library
jest.mock('openai', () => {
  return {
    Configuration: jest.fn(),
    OpenAIApi: jest.fn(),
  };
});

// Mocking the fetch API
global.fetch = jest.fn().mockImplementation(() => {
    return Promise.resolve({
      json: () => Promise.resolve({
        openai: 'Generated cover letter',
      })
    });
});


afterEach(() => {
    jest.clearAllMocks();
    Configuration.mockClear();
    OpenAIApi.mockClear();
  });

describe('Submit component', () => {
  let openai;
  beforeEach(() => {
    // Clearing the mocks for Configuration and OpenAIApi
    Configuration.mockClear();
    OpenAIApi.mockClear();
    openai = new OpenAIApi();

    // Setting up the mock for Configuration
    Configuration.mockImplementation(() => {
      return {
        apiKey: process.env.OPENAI_API_KEY,
      };
    });

    // Setting up the mock for OpenAIApi
    OpenAIApi.mockImplementation(() => {
      return openai;
    });
  });

  it('should generate a cover letter on form submit', async () => {
    // Test data
    const data = {
      resume: {
        resumeText: 'Some resume text',
      },
      jobDesc: 'Some job description',
    };

    // Setting the resume in local storage
    localStorage.setItem('resume', JSON.stringify(data.resume));

    // Rendering the Submit component
    const { getByPlaceholderText, getByText, getByTestId } = render(<Submit />);

    // Finding the job description text area and entering the test data
    const jobDescTextArea = getByPlaceholderText('Paste the job description here...');
    fireEvent.change(jobDescTextArea, { target: { value: data.jobDesc } });
    expect(jobDescTextArea.value).toEqual(data.jobDesc);

    // Finding the submit button and clicking it
    const submitButton = getByText('Generate Cover Letter');
    fireEvent.click(submitButton);

    // Finding the progress bar
    const progress = getByTestId('progressbar');
    expect(progress).toBeInTheDocument();

    // Waiting for the progress bar to be hidden
    await waitForElementToBeHidden(progress);

    // Finding the cover letter text area
    const coverLetterTextArea = getByTestId('coverLetterTextArea');
    expect(coverLetterTextArea.value).toBe('Generated cover letter');
  });
});

  
// A utility function to wait for an element to be hidden
const waitForElementToBeHidden = async (element) => {
    const isHidden = () => window.getComputedStyle(element).display === 'none';
    if (isHidden()) {
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (isHidden()) {
          observer.disconnect();
          resolve(true);
        }
      });
      observer.observe(element, { attributes: true });
    });
  };
  