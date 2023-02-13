import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ResumeUpload from '../components/resumeupload.js';

// Mock the global `fetch` function
global.fetch = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    json: () => Promise.resolve({
      resume: 'resume content',
    })
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

function setUploadingResume() {

}

/**
 * Test the Resumeupload component
 */
describe('Resumeupload component', () => {
  /**
   * Test the label for file upload
   */
  it('renders the correct label for file upload', () => {
    const { getByText } = render(<ResumeUpload 
      setUploadingResume={setUploadingResume}/>);
    const label = getByText(/Upload/);
    expect(label).toBeInTheDocument();
  });
  
  /**
   * Test the label update after a file is uploaded
   */
  it('updates the label after a file is uploaded', () => {
    const { container, getByText} = render(<ResumeUpload 
      setUploadingResume={setUploadingResume}/>);
    const file = new File(["resume content"], "resume.txt", {
      type: "text/plain",
    });
    const input = container.querySelector(`input[name="file"]`);
    fireEvent.change(input, { target: { files: [file] } });
    const label = getByText(/Uploaded Successfully!/);
    expect(label).toBeInTheDocument();
  });
  
  /**
   * Test saving the uploaded file to local storage
   */
  it('saves the uploaded file to local storage', () => {
    const { container, getByText } = render(<ResumeUpload 
      setUploadingResume={setUploadingResume}/>);
    const file = new File(["resume content"], "resume.txt", {
      type: "text/plain",
    });
    const input = container.querySelector(`input[name="file"]`);
    fireEvent.change(input, { target: { files: [file] } });
    const resume = JSON.parse(localStorage.getItem('resume'));
    expect(resume.name).toBe('resume.txt');
    expect(resume.resumeText).toBe('resume content');
  });
});