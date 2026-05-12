import { Recipe } from "./recipe.model";
export interface PaginatedRecipes {
  recipes: Recipe[];
   totalCount: number;
   currentPage: number;
   totalPages: number;
}
