import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('technology');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');

  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const fetchArticles = async () => {
    try {
      setLoading(true);
const response = await axios.get(`/api/news?category=${category}');
  
  setArticles(response.data.articles);
    } catch (err) {
      setError('Failed to load news.');
    } finally {
      setLoading(false);
    }
  };

  const summarizeArticle = async (content) => {
    setSummary('Loading summary...');
    try {
      const result = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Summarize the following article in 3 bullet points:

${content}` }] }]
        })
      });
      const data = await result.json();
      const summaryText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setSummary(summaryText || 'No summary found.');
    } catch (e) {
      setSummary('Failed to generate summary.');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>📰 News AI Summarizer</h1>
      <div>
        <button onClick={() => setCategory('technology')}>Tech</button>
        <button onClick={() => setCategory('sports')}>Sports</button>
        <button onClick={() => setCategory('business')}>Business</button>
      </div>
      {loading && <p>Loading articles...</p>}
      {error && <p>{error}</p>}
      {articles.map((article, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
          <h2>{article.title}</h2>
          <img src={article.urlToImage} alt="" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
          <p>{article.description}</p>
          <button onClick={() => summarizeArticle(article.content)}>Summarize</button>
        </div>
      ))}
      {summary && <div style={{ background: '#eef', padding: '1rem', marginTop: '1rem' }}><strong>Summary:</strong><br />{summary}</div>}
    </div>
  );
};

export default App;
