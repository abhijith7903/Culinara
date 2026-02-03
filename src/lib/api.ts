const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export async function searchRecipes(query: string) {
  const response = await fetch(
    `${BASE_URL}/complexSearch?query=${query}&number=9&apiKey=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch recipes');
  const data = await response.json();
  return data.results;
}
export async function getRecipeDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/${id}/information?apiKey=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch recipe details');
  return response.json();
}