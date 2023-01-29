import { ifError } from "assert";
import formidable from "formidable";
import fs from "fs";
import textract from "textract";

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    let result = await readFile(files.file, files.file.originalFilename).then(text => {
      return text;
    }).catch(err => {
      return err.message;
    })
    if(result) {
      const response = {
        resume: result
      }
      return res.json(response);
    } else {
      return res.status(400).json();
    }  
  });
};

const readFile = async (file, fileName) => {
  const data = fs.readFileSync(file.filepath);
  return new Promise((resolve, reject) => {
    textract.fromBufferWithName(fileName, data, function( error, text ) {
      fs.unlinkSync(file.filepath);
      if(error) {
        reject(new Error("Unable to parse resume" + error.message));
      } else {
        resolve(text);
      }
    })
  })
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