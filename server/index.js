const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3001;

const corsOptions = {
  origin: ["http://localhost:3000", "https://telegram-wiki-bot.vercel.app/"],
  methods: ["GET", "POST"],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const TOKEN = '6819938812:AAELgtp3sNGZNuIf0t7LYZ9_KGxBQZNTGP0';
const GROUP_CHAT_ID =  '-1002194086845';  

if (!TOKEN || !GROUP_CHAT_ID) {
  console.error('Error: Telegram Bot Token or Group Chat ID is not defined in the environment variables.');
  process.exit(1);
}

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
      chat_id: GROUP_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message to Telegram:', error.response ? error.response.data : error.message);
    throw error;
  }
};

app.get('/random-article', async (req, res) => {
  try {
    const article = await getRandomWikipediaArticle();
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).send('Error fetching article');
  }
});

app.post('/send-article', async (req, res) => {
  const { title, extract, url } = req.body;

  if (!title || !extract || !url) {
    return res.status(400).send('Bad Request: Missing required fields.');
  }
  const message = `<b>${title}</b>\n\n${extract}\n\n<a href="${url}">Read more</a>`;
  try {
    const result = await sendMessageToTelegram(message);
    res.send('Message sent to Telegram successfully.');
  } catch (error) {
    res.status(500).send('Error sending message to Telegram');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
