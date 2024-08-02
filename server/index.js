const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001; 

const corsOptions = {
  origin: 'https://enterprises-bot.vercel.app/', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const getRandomWikipediaArticle = async () => {
  try {
    const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching Wikipedia article:', error);
    throw error;
  }
};

const sendMessageToTelegram = async (message) => {
  try {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error;
  }
};

app.get('/random-article', async (req, res) => {
  try {
    const article = await getRandomWikipediaArticle();
    res.json(article);
  } catch (error) {
    res.status(500).send('Error fetching article');
  }
});

app.post('/send-article', async (req, res) => {
  const { title, extract, url } = req.body;
  const message = `<b>${title}</b>\n\n${extract}\n\n<a href="${url}">Read more</a>`;
  try {
    await sendMessageToTelegram(message);
    res.send('Message sent to Telegram successfully.');
  } catch (error) {
    res.status(500).send('Error sending message to Telegram');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
