import { useState, type FormEvent } from "react";
import type { Product } from "../types/product";
import type { ProductCheckIn } from "../types/journal";

interface CheckInFormProps {
  product: Product;
  onSave: (entry: ProductCheckIn) => void;
}

function getLocalDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - offset)
    .toISOString()
    .slice(0, 10);
}

export default function CheckInForm({
  product,
  onSave,
}: CheckInFormProps) {
  const [date, setDate] = useState(getLocalDate);
  const [used, setUsed] = useState(true);
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const entry: ProductCheckIn = {
      id: crypto.randomUUID(),
      date,
      productId: product.id,
      used,
      rating,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    onSave(entry);
    setSaved(true);
  };

  return (
    <form className="check-in-form" onSubmit={handleSubmit}>
      <h3>Daily Check-In</h3>
      <p>{product.name}</p>

      <label className="field-label" htmlFor={`date-${product.id}`}>
        Date
      </label>
      <input
        id={`date-${product.id}`}
        type="date"
        value={date}
        max={getLocalDate()}
        onChange={(event) => {
          setDate(event.target.value);
          setSaved(false);
        }}
        required
      />

      <label className="check-in-checkbox">
        <input
          type="checkbox"
          checked={used}
          onChange={(event) => {
            setUsed(event.target.checked);
            setSaved(false);
          }}
        />
        I used this product today
      </label>

      <label className="field-label" htmlFor={`rating-${product.id}`}>
        How was your experience? (1–5)
      </label>
      <select
        id={`rating-${product.id}`}
        value={rating}
        onChange={(event) => {
          setRating(Number(event.target.value));
          setSaved(false);
        }}
        required
      >
        <option value={1}>1 — Very poor</option>
        <option value={2}>2 — Poor</option>
        <option value={3}>3 — Neutral</option>
        <option value={4}>4 — Good</option>
        <option value={5}>5 — Very good</option>
      </select>

      <label className="field-label" htmlFor={`notes-${product.id}`}>
        Notes (optional)
      </label>
      <textarea
        id={`notes-${product.id}`}
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          setSaved(false);
        }}
        placeholder="How did the product feel? Any observations?"
        rows={3}
        maxLength={1000}
      />

      <button type="submit">
        Save Check-In
      </button>

      {saved && <p role="status">Check-in saved successfully.</p>}
    </form>
  );
}