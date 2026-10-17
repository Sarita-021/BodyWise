import { ArrowUpRight, FlaskConical } from "lucide-react";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isInRoutine: boolean;
  onToggleRoutine: (productId: string) => void;
}

export default function ProductCard({
  product,
  onSelect,
  isInRoutine,
  onToggleRoutine,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-art">
        <FlaskConical size={34} strokeWidth={1.3} />
        <span>{product.category}</span>
      </div>

      <div className="product-card-body">
        <p className="eyebrow">BE BODYWISE</p>
        <h3>{product.name}</h3>
        <p className="muted">{product.description}</p>

        <div className="ingredient-preview">
          {product.ingredients.slice(0, 3).map((ingredient) => (
            <span className="ingredient-tag" key={ingredient.name}>
              {ingredient.name}
            </span>
          ))}
        </div>

        <div className="product-card-actions">
          <button
            className="text-button"
            onClick={() => onSelect(product)}
          >
            Explore product <ArrowUpRight size={16} />
          </button>
          <button
            type="button"
            className={isInRoutine ? "routine-toggle active" : "routine-toggle"}
            aria-pressed={isInRoutine}
            onClick={() => onToggleRoutine(product.id)}
          >
            {isInRoutine ? "Remove from Routine" : "Add to Routine"}
          </button>
        </div>
      </div>
    </article>
  );
}