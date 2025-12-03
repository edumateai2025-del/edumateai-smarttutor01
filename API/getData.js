// api/getData.js
export default async function handler(req, res) {
  const query = req.query.q;

  if(!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    // OpenAI API call
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [{ role: "user", content: query }],
        max_tokens: 500
      })
    });
    const openaiData = await openaiResp.json();

    // YouTube API call
    const ytResp = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${process.env.YOUTUBE_API_KEY}`);
    const ytData = await ytResp.json();

    // Return both results to front-end
    res.status(200).json({
      openai: openaiData,
      youtube: ytData
    });
  } catch(err) {
    res.status(500).json({ error: "Failed to fetch API data", details: err.message });
  }
      }
