import axios from 'axios';

interface article {
  title: string;
  content: string;
}

const ArticlePrompt = async (keyword: string) => {
  const queryParams = { type: 'articlePrompt', keyword: keyword };
  let articles: article[] = [];
  let chatMessage = {};

  await axios.post('/api/HandleKeyword', { params: queryParams }).then((result) => {
    articles = result.data;
  });

  if (articles.length > 0) {
    const articlesText = JSON.stringify(articles).replaceAll('\\n', '').replaceAll('\\t', '').replaceAll('\t', '').replaceAll('\n', '');

    const promptMsg = `You are tasked with analyzing a collection of news articles that share a same keyword. The goal is to identify the central themes that are prevalent across these articles and create a concise and informative blog post summarizing these common key themes.
      I'll give you news article data written with the keyword '${keyword}'. This data is an array of JSON objects with title and content as properties.
      Here's a simple example. [{title: ‘title’, content:’content’}]
      Summarize the news articles data provided and write a blog post with one main topic and subheadings. For example, if you are given data for three news articles, merge them into one rather than summarizing each one. Write a blog post in HTML according to the rules set below. Do not write additional words before or after writing your blog post. This is very important. Blog posts should be written in Korean and should not contain words that look like news articles, such as 'news', 'article', 'summary', 'theme', or 'overview' in the title or content. Additionally, blog posts should not appear to have been written by an artificial intelligence or chatgpt.
      1. First, create a headline with the title of the provided news article data. Please remove unnecessary words or content from the title and write it so that it does not look like a news article title. Headlines are written with <H1> tags.
      2. Next, an lead paragraph is created by summarizing the key contents of the news article data.
      3. Next, summarize the details of the news articles provided, divide each section, and write subheadings and contents. Write subheadings before each section. Write a subtitle with <H2> tag and put a special character '•' in front. Here is a simple example. <h2>• subtitle</h2>
      4. Next, write your conclusions by referring to news articles. Please write only the contents without the need to specify the name of the conclusion.
      5. Include all the contents of the original text, but freely omit unnecessary parts in context, and do not use more than 5 syllables of the same word in the original text to make it appear that it was written by a different person from the original author. This rule should apply to all rules 1, 2, 3, and 4 described above. This is very important. You can omit any parts you think are redundant, but as a blogger, please write your blog post as long as possible, including your subjective opinions. Please write and provide only blog posts in accordance with the above rules, but do not provide unnecessary or additional answers. For example, 'Yes! of course.' , 'You can write a blog post like this'. Now, here is the news article data.`;

    chatMessage = { role: 'user', content: promptMsg + articlesText };
  }

  return chatMessage;
};

export default ArticlePrompt;
