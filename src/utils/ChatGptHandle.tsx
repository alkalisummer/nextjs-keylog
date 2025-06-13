import OpenAI from 'openai';
import { get_encoding } from 'tiktoken'; //토큰 계산

export default async function ChatGptHandle(type: string, chatContent: any) {
  let chatMessage;
  const encoding = get_encoding('cl100k_base');
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  if (type === 'common') {
    // 대화의 맥락을 이어가기 위해 이전 대화를 넣어줌
    chatMessage = [{ role: 'system', content: 'You are a helpful assistant.' }, ...chatContent];
  } else {
    chatMessage = [{ role: 'system', content: 'you are an expert blog post writer specializing in writing long 8000+ word blog post about.' }, chatContent];
  }
  let seriealized = '';
  for (let msg of chatMessage) {
    seriealized += msg.role + msg.content;
  }

  //사용가능한 토큰 계산
  const availableTokens = type === 'common' ? undefined : 16375 - encoding.encode(seriealized).length;

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    temperature: 1.0,
    messages: chatMessage,
    stream: true,
    max_tokens: availableTokens,
  });

  return chatCompletion;
}
