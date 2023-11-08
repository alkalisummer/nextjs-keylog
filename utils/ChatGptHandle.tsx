import OpenAI from 'openai';

export default async function ChatGptHandle(type: string, chatContent: any) {
  let chatMessage;
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  if (type === 'common') {
    // 대화의 맥락을 이어가기 위해 이전 대화를 넣어줌
    chatMessage = [{ role: 'system', content: 'You are a helpful assistant.' }, ...chatContent];
  } else {
    chatMessage = [{ role: 'system', content: 'You are a professional blogger' }, chatContent];
  }
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    temperature: 1.0,
    messages: chatMessage,
    stream: true,
  });

  return chatCompletion;
}
