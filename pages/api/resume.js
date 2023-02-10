import formidable from "formidable";
import fs from "fs";
import textract from "textract";
import pdfparse from "pdf-parse";
import wordExtractor from "@gmr-fms/word-extractor";

/**
 * API Configuration
 */
export const config = {
  api: {
    bodyParser: false
  }
};

/**
 * POST request handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const post = async (req, res) => {
  // Create a new instance of the formidable form
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    let result = "";
    try {
      // Read the file and extract its text
      result = await readFile(files.file, files.file.originalFilename).then(text => {
        return text;
      }).catch(error => { 
        throw error;
      });
    } catch(error) {
      console.log(error.message);
      return res.status(400).json(); 
    }
    // Prepare the response object
    const response = {
      resume: result
    }
    return res.json(response);
  });
};

/**
 * Read the contents of a file and extract its text
 * @param {Object} file - File object
 * @param {String} fileName - Original file name
 * @returns {Promise} - Resolves with the extracted text
 */
async function readFile(file, fileName) {
  // Read the contents of the file into a buffer
  const buffer = fs.readFileSync(file.filepath);
  if(fileName && fileName.endsWith(".pdf")) {
    // Extract text from a PDF file
    return new Promise((resolve, reject) => {
      pdfparse(buffer).then(function(data) {
        resolve(data.text);
      });
    });
  } else if(fileName && fileName.endsWith(".doc")){
    // Extract text from a Microsoft Word document
    return new Promise((resolve, reject) => {
      wordExtractor.fromBuffer(buffer).then(doc => {
        resolve(doc.getBody());
      });
    });
  } else {
    // Extract text from other file formats
    return new Promise((resolve, reject) => {
      textract.fromBufferWithName(fileName, buffer, function( error, text ) {
        fs.unlinkSync(file.filepath);
        if(error) {
          reject(error);
        } else {
          resolve(text);
        }
      });
    });
  }
};

/**
 * Express request handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export default (req, res) => {
  // Route the request based on its method
  req.method === "POST"
  ? post(req, res)
  : req.method === "PUT"
  ? console.log("PUT")
  : req.method === "DELETE"
  ? console.log("DELETE")
  : req.method === "GET"
  ? console.log("GET")
  : res.status(404).send("");
};