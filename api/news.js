export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  const category = req.query.category || 'technology';

  const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=5&apiKey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json(data);
}