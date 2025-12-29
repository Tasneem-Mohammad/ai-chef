import Groq from "groq-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { ingredients } = body || {};

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Invalid ingredients" });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful chef. Generate a clear recipe using the given ingredients.",
        },
        {
          role: "user",
          content: `Ingredients: ${ingredients.join(", ")}`,
        },
      ],
    });

    const recipe =
      completion.choices?.[0]?.message?.content || "No recipe generated.";

    return res.status(200).json({ recipe });
  } catch (err) {
    console.error("GROQ ERROR:", err);
    return res.status(500).json({
      error: err.message || "Groq request failed",
    });
  }
}
