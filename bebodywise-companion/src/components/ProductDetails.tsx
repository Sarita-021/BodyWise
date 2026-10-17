import { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Product } from "../types/product";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

interface ExplanationResponse {
  explanation?: string;
  product?: string;
  ingredient?: string;
  sources?: {
    label: string;
    url: string;
  }[];
  error?: string;
}

export default function ProductDetails({
  product,
  onBack,
}: ProductDetailsProps) {
  const [ingredientName, setIngredientName] = useState(
    product.ingredients[0]?.name ?? "",
  );
  const [question, setQuestion] = useState(
    "What does this ingredient do, according to the available information?",
  );
  const [explanation, setExplanation] =
    useState<ExplanationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function explainIngredient() {
    setLoading(true);
    setError("");
    setExplanation(null);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          ingredientName,
          question,
        }),
      });

      const data =
        (await response.json()) as ExplanationResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Could not generate an explanation.",
        );
      }

      if (!data.explanation) {
        throw new Error("The response did not contain an explanation.");
      }

      setExplanation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="details-page">
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={16} /> Back to products
      </button>

      <div className="details-hero">
        <div className="product-art details-art">
          <ShieldCheck size={54} strokeWidth={1.2} />
          <span>{product.category}</span>
        </div>

        <div>
          <p className="eyebrow">BE BODYWISE / PRODUCT GUIDE</p>
          <h2>{product.name}</h2>
          <p className="muted">{product.description}</p>

          <a
            className="source-link"
            href={product.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            View official product information
            <ExternalLink size={15} />
          </a>
        </div>
      </div>

      <div className="details-section">
        <p className="eyebrow">PRODUCT COMPOSITION</p>
        <h3>Explore the ingredients</h3>

        <p className="muted">
          Select an ingredient to explore its documented information.
          This catalog may not contain the complete formulation.
        </p>

        <div className="ingredient-list">
          {product.ingredients.map((ingredient) => (
            <button
              type="button"
              className={
                ingredientName === ingredient.name
                  ? "ingredient-row ingredient-selected"
                  : "ingredient-row"
              }
              key={ingredient.name}
              onClick={() => {
                setIngredientName(ingredient.name);
                setExplanation(null);
                setError("");
              }}
            >
              <span className="ingredient-dot" />
              <span>{ingredient.name}</span>
            </button>
          ))}
        </div>

        <label className="field-label" htmlFor="ingredient-question">
          What would you like to understand?
        </label>

        <textarea
          id="ingredient-question"
          className="question-input"
          rows={3}
          maxLength={500}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask a question about this ingredient..."
        />

        <button
          className="primary-button"
          onClick={explainIngredient}
          disabled={
            loading ||
            !ingredientName ||
            question.trim().length < 3
          }
        >
          {loading ? (
            <>
              <LoaderCircle className="spin" size={17} />
              Explaining...
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Explain ingredient
            </>
          )}
        </button>

        {error && (
          <div className="error-panel" role="alert">
            <strong>Unable to explain this ingredient</strong>
            <p>{error}</p>
          </div>
        )}

        {explanation?.explanation && (
          <section className="explanation-panel" aria-live="polite">
            <p className="eyebrow">YOUR INGREDIENT EXPLAINER</p>
            <h3>{explanation.ingredient}</h3>
            <p className="explanation-text">
              {explanation.explanation}
            </p>

            <div className="source-list">
              <strong>Information sources</strong>

              {explanation.sources?.map((source) => (
                <a
                  key={`${source.label}-${source.url}`}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.label}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>

            <p className="disclaimer">
              This explanation summarizes supplied product information.
              It does not establish that an ingredient or finished
              product will produce a particular outcome.
            </p>
          </section>
        )}
      </div>

      <div className="details-section instructions">
        <p className="eyebrow">BEFORE YOU USE IT</p>
        <h3>Important information</h3>

        {product.usageInstructions.map((instruction) => (
          <p key={instruction} className="muted">
            • {instruction}
          </p>
        ))}

        <p className="disclaimer">
          This product guide is for informational purposes only.
          It does not diagnose conditions or replace professional advice.
        </p>
      </div>
    </section>
  );
}