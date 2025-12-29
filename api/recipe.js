import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { ingredients } = req.body;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY, // 🔐 SECRET
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "You are a chef AI. Suggest a recipe."
        },
        {
          role: "user",
          content: `Ingredients: ${ingredients.join(", ")}`
        }
      ]
    });

    res.status(200).json({
      recipe: completion.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: "Groq failed" });
  }
}
