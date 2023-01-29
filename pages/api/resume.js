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
      console.log(err)
    })
    if(result) {
      const response = {
        resume: result
      }
      return res.json(response);
    } else {
      return res.status(400).end();
    }  
  });
};

const readFile = async (file, fileName) => {
  const data = fs.readFileSync(file.filepath);
  return new Promise((resolve, reject) => {
    console.log("Initiating parse of resume: " + fileName);
    textract.fromBufferWithName(fileName, data, function( error, text ) {
      console.log("Resume callback hit with text: " + text);
      fs.unlinkSync(file.filepath);
      if(error) {
        console.log("Error parsing resume: " + error);
        reject(new Error("Unable to parse resume"));
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