export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  readyInMinutes?: number;
  servings?: number;
  summary?: string;
  extendedIngredients?: {
    id: number;
    original: string;
  }[];
  instructions?: string;
}