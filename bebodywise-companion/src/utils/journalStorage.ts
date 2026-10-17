import type { ProductCheckIn } from "../types/journal";

const ROUTINE_KEY = "bebodywise:routine:v1";
const JOURNAL_KEY = "bebodywise:journal:v1";

export function getRoutineProductIds(): string[] {
  try {
    const stored = localStorage.getItem(ROUTINE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (id): id is string => typeof id === "string"
    );
  } catch {
    return [];
  }
}

export function saveRoutineProductIds(productIds: string[]): void {
  localStorage.setItem(ROUTINE_KEY, JSON.stringify(productIds));
}

export function getJournalEntries(): ProductCheckIn[] {
  try {
    const stored = localStorage.getItem(JOURNAL_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (entry): entry is ProductCheckIn =>
        typeof entry === "object" &&
        entry !== null &&
        "id" in entry &&
        typeof entry.id === "string" &&
        "date" in entry &&
        typeof entry.date === "string" &&
        "productId" in entry &&
        typeof entry.productId === "string" &&
        "used" in entry &&
        typeof entry.used === "boolean" &&
        "rating" in entry &&
        typeof entry.rating === "number" &&
        entry.rating >= 1 &&
        entry.rating <= 5 &&
        "notes" in entry &&
        typeof entry.notes === "string" &&
        "updatedAt" in entry &&
        typeof entry.updatedAt === "string"
    );
  } catch {
    return [];
  }
}

export function saveJournalEntries(entries: ProductCheckIn[]): void {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}