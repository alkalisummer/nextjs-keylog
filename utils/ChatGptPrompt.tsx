import axios from 'axios';

interface article {
  title: string;
  content: string;
}

const splitArticleText = (text: string, chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

const ArticlePrompt = async (keyword: string) => {
  const queryParams = { type: 'articlePrompt', keyword: keyword };
  let articles: article[] = [];

  await axios.post('/api/HandleKeyword', { params: queryParams }).then((result) => {
    articles = result.data;
  });
  console.log(articles);
  const articlesText = JSON.stringify(articles).replaceAll('\\n', '').replaceAll('\\t', '');

  const promptMsg = `You are tasked with analyzing a collection of news articles that share a same keyword. The goal is to identify the central themes that are prevalent across these articles and create a concise and informative blog post summarizing these common key themes.'.
  I'll give you news article data written with the keyword '${keyword}'. This data is an array of JSON objects with title and content as properties.
  Here's a simple example. [{title: ‘title’, content:’content’}]
  Summarize the news articles data provided and write a blog post with one main topic and subheadings. For example, if you are given data for three news articles, merge them into one rather than summarizing each one. Write a blog post in HTML according to the rules set below. Blog posts must be written in Korean.
  1. First, create a headline with the title of the provided news article data. Please remove unnecessary words or content from the title and write it so that it does not look like a news article title. Headlines are written with <H1> tags.
  2. Next, an lead paragraph is created by summarizing the key contents of the news article data.
  3. Next, summarize the details of the news articles provided, divide each section, and write subheadings and contents. Write subheadings before each section. Write a subtitle with <H2> tag and put a special character '•' in front. Here is a simple example. <h2>• subtitle</h2>
  4. Next, write your conclusions by referring to news articles. Please write only the contents without the need to specify the name of the conclusion.
  5. Feel free to omit parts that are unnecessary in context, and do not use more than 5 syllables of the same word in the original text so that it appears to have been written by a different person from the original author. This rule must be applied to all rules 1, 2, 3 and 4 written above. This is very important. It's okay to omit parts that you think are redundant. Here is the news article data.`;

  const chatMessage = { role: 'user', content: promptMsg + articlesText };

  return chatMessage;
};

export default ArticlePrompt;
