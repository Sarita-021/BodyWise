export interface Ingredient {
  name: string;
  description?: string;
  sourceUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: "Hair Care" | "Skin Care" | "Supplements";
  description: string;
  ingredients: Ingredient[];
  usageInstructions: string[];
  sourceUrl: string;
  verifiedAt: string;
  verificationStatus: "verified" | "needs-review";
}