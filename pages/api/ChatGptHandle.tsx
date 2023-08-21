import { NextApiRequest, NextApiResponse } from 'next';

export default async function ChatGptHandle(request: NextApiRequest, response: NextApiResponse) {
  const chatContent = request.body.chatContent;
  const type = request.body.type;
  const { Configuration, OpenAIApi } = require('openai');

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  let chatMessage;

  if (type === 'common') {
    // 대화의 맥락을 이어가기 위해 이전 대화를 넣어줌
    chatMessage = [{ role: 'system', content: 'You are a helpful assistant.' }, ...chatContent];
  } else {
    chatMessage = [{ role: 'system', content: 'You are a summarizer & professional blogger' }, chatContent];
  }
  console.log(chatMessage);
  const chatCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    temperature: 1.0,
    messages: chatMessage,
  });

  const chatGptRes = chatCompletion.data.choices[0].message;

  return response.status(200).json({ chatGptRes });
}
