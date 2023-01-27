import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const result = await readFile(files.file);
    const response = {
      openapi: result
    }
    return res.json(response);
  });
};

const readFile = async (file) => {
  const data = fs.readFileSync(file.filepath);
  let pdfExtract;
  try {
    pdfExtract = await pdfParse(data)
  } catch (error) {
    console.log("Unable to parse file:" + error);
  }
  await fs.unlinkSync(file.filepath);
  return pdfExtract;
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