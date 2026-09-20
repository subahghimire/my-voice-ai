export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.openai_api_key}`
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        instructions:
          "You are my personal AI voice assistant. Understand Nepali and English. Reply naturally, clearly, and helpfully. If the user speaks Nepali, reply in Nepali. If the user speaks English, reply in English.",
        input: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Sorry, I could not generate a response."
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
