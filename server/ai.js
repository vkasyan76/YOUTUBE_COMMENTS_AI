import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

// const response = await openai.createCompletion({
//   model: "text-davinci-003",
//   prompt: "Say this is a test",
//   max_tokens: 7,
//   temperature: 0,
// });

// console.log(response.data.choices[0].text);

async function generateText() {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    max_tokens: 7,
    temperature: 0,
  });

  return response.data.choices[0].text;
}

// Call the generateText function and log its output to the console
generateText().then((text) => console.log(text));

export { configuration, openai };
