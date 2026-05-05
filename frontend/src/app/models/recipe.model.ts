export interface Ingredient {
  amount: number;
  unit?: string;
  name: string;
  _id?: string;
}

export interface Recipe {
  _id?: string;
  name: string;
  ingredients: Ingredient[];
  description?: string;
  directions: string[];
  image?: string;
  tags?: string[];
  servings: number;
  duration?: number;
  public: boolean;
  sub?: string;
  created?: Date;
}
