const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Build a request prompt based on the resume and job description.
 *
 * @param {Object} resume - An object containing the resume text.
 * @param {String} jobDesc - A string representing the job description.
 *
 * @returns {String} - The generated prompt for the request.
 */
function buildReqPrompt(resume, jobDesc) {
    let prompt = null;
    try {
        if(resume && jobDesc) {
            prompt = "Using this resume: '" +
            resume.resumeText + "'\n Please generate a cover letter of less than 350 words for the following job opportunity: '" +
            jobDesc + "'";
            if(prompt.length > 2600) {
                prompt = prompt.substring(0, 2600);
            }
        } else if(jobDesc) {
            prompt = "Using less than 350 words, create a professional cover letter for me based on this job: '" + 
            jobDesc + "'"; 
        }
    } catch(error) {
        console.log("Unable to build prompt...\n" + error);
    }
    return prompt;
};

/**
 * Handle a POST request.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Void}
 */
const post = async (req, res) => {
    const prompt = buildReqPrompt(req.body.resume, req.body.jobDesc);
    if(prompt) {
        let response;
        try {
            response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.7,
                max_tokens: 600,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        } catch(error) {
            console.log(error.message);
        }    
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

/**
 * Handle incoming requests.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 *
 * @returns {Void}
 */
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