
// src/ai.js
export async function getRecipeFromAI(ingredients) {
  const res = await fetch("/api/recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });

  const data = await res.json();
  return data.recipe;
}
