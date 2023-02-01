import formidable from "formidable";
import fs from "fs";
import textract from "textract";
import pdfparse from "pdf-parse";
import wordExtractor from "@gmr-fms/word-extractor"

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    let result = "";
    try {
      result = await readFile(files.file, files.file.originalFilename).then(text => {
        return text;
      }).catch(error => { 
        throw error;
      });
    } catch(error) {
      console.log(error.message);
      return res.status(400).json(); 
    }
    const response = {
      resume: result
    }
    return res.json(response);
  });
};

async function readFile(file, fileName) {
  const buffer = fs.readFileSync(file.filepath);
  if(fileName && fileName.endsWith(".pdf")) {
    return new Promise((resolve, reject) => {
      pdfparse(buffer).then(function(data) {
        resolve(data.text);
      });
    })
  } else if(fileName && fileName.endsWith(".doc")){
    return new Promise((resolve, reject) => {
      wordExtractor.fromBuffer(buffer).then(doc => {
        resolve(doc.getBody());
      });
    })
  } else {
    return new Promise((resolve, reject) => {
      textract.fromBufferWithName(fileName, buffer, function( error, text ) {
        fs.unlinkSync(file.filepath);
        if(error) {
          reject(error);
        } else {
          resolve(text);
        }
      })
    })
  }
};

export default (req, res) => {
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