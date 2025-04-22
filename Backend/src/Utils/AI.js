import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion(data) {
   const result = await groq.chat.completions.create({
    messages: [
      {
        role : "system",
        content: `Youe are a helpful analyst.
        you are given a document which contains the information about a code snippet will all the details regarding the code snippet.
        You have to check does the code justifies the snippet title description and other details.
        you have to answer in  "yes" or "no".
        if no what is the problem you can give tips and infor because of which part code does not justify the title.
        if yes just return true in justifies feild and leave other empty
        JSON output format:
        {
            justifies : true | false,
            problem : "problem statement" | "",
            tips : "tips to solve the problem | "", 
        }`
      },{
        role: "user",
        content:`${data}`
      }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    response_format: { type : "json_object"}
  });
//   console.log(result);
  return result?.choices[0]?.message?.content || "";
}
