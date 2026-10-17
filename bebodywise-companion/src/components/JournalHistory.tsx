import { useMemo, useState } from "react";
import type { Product } from "../types/product";
import type { ProductCheckIn } from "../types/journal";

interface JournalHistoryProps {
  entries: ProductCheckIn[];
  products: Product[];
}

export default function JournalHistory({
  entries,
  products,
}: JournalHistoryProps) {
  const [selectedProductId, setSelectedProductId] = useState("all");

  const filteredEntries = useMemo(() => {
    return entries
      .filter(
        (entry) =>
          selectedProductId === "all" ||
          entry.productId === selectedProductId
      )
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          b.updatedAt.localeCompare(a.updatedAt)
      );
  }, [entries, selectedProductId]);

  const averageRating =
    filteredEntries.length > 0
      ? (
          filteredEntries.reduce((total, entry) => total + entry.rating, 0) /
          filteredEntries.length
        ).toFixed(1)
      : "—";

  const usageRate =
    filteredEntries.length > 0
      ? Math.round(
          (filteredEntries.filter((entry) => entry.used).length /
            filteredEntries.length) *
            100
        )
      : null;

  const getProductName = (productId: string) =>
    products.find((product) => product.id === productId)?.name ??
    "Product no longer available";

  return (
    <section className="journal-history">
      <h2>Journal History</h2>

      <label className="field-label" htmlFor="journal-product-filter">
        Filter by product
      </label>
      <select
        id="journal-product-filter"
        value={selectedProductId}
        onChange={(event) => setSelectedProductId(event.target.value)}
      >
        <option value="all">All products</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      <div className="journal-summary">
        <article className="journal-stat">
          <span>Check-ins</span>
          <strong>{filteredEntries.length}</strong>
        </article>

        <article className="journal-stat">
          <span>Average experience rating</span>
          <strong>{averageRating}{averageRating !== "—" ? " / 5" : ""}</strong>
        </article>

        <article className="journal-stat">
          <span>Check-ins marked as used</span>
          <strong>{usageRate === null ? "—" : `${usageRate}%`}</strong>
        </article>
      </div>

      {filteredEntries.length === 0 ? (
        <p>No check-ins found. Save a daily check-in to start your history.</p>
      ) : (
        <div className="journal-entry-list">
          {filteredEntries.map((entry) => (
            <article className="journal-entry" key={entry.id}>
              <div className="journal-entry-header">
                <h3>{getProductName(entry.productId)}</h3>
                <time dateTime={entry.date}>{entry.date}</time>
              </div>

              <p>
                Product used: <strong>{entry.used ? "Yes" : "No"}</strong>
              </p>
              <p>
                Experience rating: <strong>{entry.rating} / 5</strong>
              </p>

              {entry.notes && <p className="journal-notes">{entry.notes}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}