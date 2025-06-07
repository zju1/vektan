import type { SingleProductionOrder } from "@/features/sales/production-orders/production-order.dto";
import type { SingleRecipe } from "../recipes/recipe.dto";

export interface IProductionJournal {
  _id?: string;
  productionOrder: string;
  recipeId: string;
  produced: number;
  ready: number;
  actualProductionDate: string;
  diff: number;
}

export interface SingleProductionJournal {
  _id?: string;
  productionOrder: SingleProductionOrder;
  recipeId: SingleRecipe;
  produced: number;
  ready: number;
  actualProductionDate: string;
  diff: number;
}
