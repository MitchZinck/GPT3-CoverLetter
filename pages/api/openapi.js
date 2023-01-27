const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const post = async (req, res) => {
    const prompt = req.body.prompt;
    if(prompt) {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 1500,
            frequency_penalty: 0,
            presence_penalty: 0,
        });    
        if(response) {
            const successResponse = {
                openai: response.data.choices[0].text
            };
            res.status(201).json(successResponse);
        } else {
            res.status(201).json(errorResponse);
        }
    } else {
        res.status(201).json(errorResponse);
    }
    res.end();
    return;
};

const errorResponse = {
    data: "Sorry, but we we're unable to generate a cover letter for you. Please try again."
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