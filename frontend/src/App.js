import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/random-article`);
      setArticle(response.data);
    } catch (error) {
      setError('Error fetching article');
    } finally {
      setLoading(false);
    }
  };

  const sendArticleToTelegram = async () => {
    if (!article) return;
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/send-article`, {
        title: article.title,
        extract: article.extract,
        url: article.content_urls.desktop.page,
      });
      toast.success("Article sent to Telegram successfully");
    } catch (error) {
      toast.error("Error sending article to Telegram");
    }
  };

  return (
    <div className="App">
      <ToastContainer position="top-center"/>
      <div className="bg-purple-400 min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Random Wikipedia Article</h1>
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
        <a href='https://t.me/WikiPediaGroup'>Click to Join Wikipedia Group</a>
          
        </button>
        <button
          onClick={fetchRandomArticle}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {loading ? 'Loading...' : 'Fetch Random Article'}
        </button>
        
        {error && <p className="text-red-500 text-2xl font-bold bg-white rounded-md px-4 py-4">{error}</p>}
        {article && (
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
            <p className="mb-4">{article.extract}</p>
            <a
              href={article.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mb-4 inline-block"
            >
              Read more
            </a>
            <button
              onClick={sendArticleToTelegram}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-5"
            >
              Send This Wikipedia to Telegram
            </button>
          </div>
        )}

        <div className='text-2xl text-black py-14'>
        Created by <a className='underline' href='https://prashant-sharma.vercel.app/'>Prashant Sharma</a>
        </div>
        
      </div>
      
    </div>
  );
};

export default App;
