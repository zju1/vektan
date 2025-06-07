import type { SingleProductionOrder } from "@/features/sales/production-orders/production-order.dto";
import type { SingleRecipe } from "../recipes/recipe.dto";

export interface IProductionQA {
  _id: string;
  prodOrder: string;
  recipe: string;
  viscosities: number[];
  averageViscosity: number;
  softeningTemps: number[];
  aveareageSofteningTemp: number;
  droppingPoints: number[];
  averageDroppingPoint: number;
  meltingPoints: number[];
  averageMeltingPoint: number;
  certificateOfAnalyzys: string[];
}

export interface SingleProductionQA {
  _id: string;
  prodOrder: SingleProductionOrder;
  recipe: SingleRecipe;
  viscosities: number[];
  averageViscosity: number;
  softeningTemps: number[];
  aveareageSofteningTemp: number;
  droppingPoints: number[];
  averageDroppingPoint: number;
  meltingPoints: number[];
  averageMeltingPoint: number;
  certificateOfAnalyzys: string[];
}
