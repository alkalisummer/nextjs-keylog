import OpenAI from 'openai';

export default async function ChatGptHandle(type: string, chatContent: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatMessage = [
    {
      role: 'system',
      content: 'you are an expert blog post writer specializing in writing long 8000+ word blog post about.',
    },
    chatContent,
  ];

  let seriealized = '';
  for (let msg of chatMessage) {
    seriealized += msg.role + msg.content;
  }

  //사용가능한 토큰 계산
  const availableTokens = undefined; // Avoid client-side tiktoken WASM; let API infer safe max

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-5',
    temperature: 1.0,
    messages: chatMessage,
    stream: true,
    max_tokens: availableTokens,
  });

  return chatCompletion;
}
