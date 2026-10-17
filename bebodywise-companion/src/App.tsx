/** @format */

import { useEffect, useMemo, useState } from "react";
import {
	ArrowRight,
	BookOpenText,
	CheckCircle2,
	Search,
	Sparkles,
} from "lucide-react";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import { products } from "./data/products";
import type { Product } from "./types/product";
import "./index.css";
import {
	getRoutineProductIds,
	saveRoutineProductIds,
} from "./utils/journalStorage";
import JournalHistory from "./components/JournalHistory";
import CheckInForm from "./components/CheckInForm";
import type { ProductCheckIn } from "./types/journal";
import { getJournalEntries, saveJournalEntries } from "./utils/journalStorage";

type Category = "All" | Product["category"];

export default function App() {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(
		null,
	);
	const [category, setCategory] = useState<Category>("All");
	const [search, setSearch] = useState("");

	const filteredProducts = useMemo(() => {
		const query = search.trim().toLowerCase();

		return products.filter((product) => {
			const matchesCategory =
				category === "All" || product.category === category;

			const matchesSearch =
				!query ||
				product.name.toLowerCase().includes(query) ||
				product.category.toLowerCase().includes(query) ||
				product.ingredients.some((ingredient) =>
					ingredient.name.toLowerCase().includes(query),
				);

			return matchesCategory && matchesSearch;
		});
	}, [category, search]);

	const [routineProductIds, setRoutineProductIds] = useState<string[]>(() =>
		getRoutineProductIds(),
	);

	useEffect(() => {
		saveRoutineProductIds(routineProductIds);
	}, [routineProductIds]);

	const routineProducts = useMemo(
		() =>
			products.filter((product) =>
				routineProductIds.includes(product.id),
			),
		[routineProductIds],
	);

	const toggleRoutine = (productId: string) => {
		setRoutineProductIds((current) =>
			current.includes(productId)
				? current.filter((id) => id !== productId)
				: [...current, productId],
		);
	};

	const [journalEntries, setJournalEntries] = useState<ProductCheckIn[]>(() =>
		getJournalEntries(),
	);

	useEffect(() => {
		saveJournalEntries(journalEntries);
	}, [journalEntries]);

	const handleSaveCheckIn = (entry: ProductCheckIn) => {
		setJournalEntries((current) => {
			const existingIndex = current.findIndex(
				(item) =>
					item.productId === entry.productId &&
					item.date === entry.date,
			);

			if (existingIndex === -1) {
				return [...current, entry];
			}

			return current.map((item, index) =>
				index === existingIndex ? { ...entry, id: item.id } : item,
			);
		});
	};

	function goHome() {
		setSelectedProduct(null);
		setSearch("");
		setCategory("All");
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<div className="app-shell">
			<Header onHome={goHome} />

			<main>
				{selectedProduct ? (
					<ProductDetails
						product={selectedProduct}
						onBack={() => setSelectedProduct(null)}
					/>
				) : (
					<>
						<section className="hero">
							<div className="hero-copy">
								<p className="eyebrow">
									YOUR PERSONAL PRODUCT COMPANION
								</p>

								<h1>
									Wellness choices,
									<br />
									<span>with more clarity.</span>
								</h1>

								<p className="hero-description">
									Understand product information, explore
									ingredients, and make more informed
									decisions about your routine.
								</p>

								<button
									className="primary-button"
									onClick={() =>
										document
											.getElementById("product-library")
											?.scrollIntoView({
												behavior: "smooth",
											})
									}
								>
									Explore products <ArrowRight size={17} />
								</button>

								<div className="trust-note">
									<CheckCircle2 size={16} />
									Clear information. No guaranteed outcomes.
								</div>
							</div>

							<div className="hero-visual">
								<div className="visual-orbit orbit-one" />
								<div className="visual-orbit orbit-two" />

								<div className="visual-card">
									<Sparkles size={26} />
									<p className="eyebrow">
										A MORE INFORMED ROUTINE
									</p>
									<h3>Know what goes into your products.</h3>
									<p className="muted">
										Ingredient information, explained
										simply.
									</p>
								</div>
							</div>
						</section>

						<section className="value-strip">
							<div>
								<BookOpenText size={21} />
								<span>Understand ingredients</span>
							</div>
							<div>
								<Search size={21} />
								<span>Explore product details</span>
							</div>
							<div>
								<CheckCircle2 size={21} />
								<span>Make informed choices</span>
							</div>
						</section>

						<section
							className="library-section"
							id="product-library"
						>
							<div className="section-heading">
								<div>
									<p className="eyebrow">
										THE PRODUCT LIBRARY
									</p>
									<h2>Get to know your products.</h2>
									<p className="muted">
										Start with the information. Make the
										choice yourself.
									</p>
								</div>

								<span className="result-count">
									{filteredProducts.length} products
								</span>
							</div>

							<div className="catalog-controls">
								<div className="search-box">
									<Search size={18} />

									<input
										aria-label="Search products and ingredients"
										placeholder="Search products or ingredients..."
										value={search}
										onChange={(event) =>
											setSearch(event.target.value)
										}
									/>
								</div>

								<div className="category-filters">
									{(
										[
											"All",
											"Hair Care",
											"Skin Care",
											"Supplements",
										] as Category[]
									).map((item) => (
										<button
											key={item}
											className={
												category === item
													? "filter-button active"
													: "filter-button"
											}
											onClick={() => setCategory(item)}
										>
											{item}
										</button>
									))}
								</div>
							</div>

							{filteredProducts.length > 0 ? (
								<div className="product-grid">
									{filteredProducts.map((product) => (
										<ProductCard
											key={product.id}
											product={product}
											onSelect={setSelectedProduct}
											isInRoutine={routineProductIds.includes(
												product.id,
											)}
											onToggleRoutine={toggleRoutine}
										/>
									))}
								</div>
							) : (
								<div className="empty-state">
									<Search size={26} />
									<h3>No matching products</h3>
									<p>
										Try a different product name or
										ingredient.
									</p>
								</div>
							)}
						</section>

						<section className="routine-section">
							<h2>My Routine</h2>

							{routineProducts.length === 0 ? (
								<div className="routine-empty">
									<h3>No products in your routine yet</h3>
									<p>
										Add a product to keep track of your
										daily experience and notes.
									</p>
									<button
										className="text-button"
										onClick={() =>
											document
												.getElementById(
													"product-library",
												)
												?.scrollIntoView({
													behavior: "smooth",
												})
										}
									>
										Browse products <ArrowRight size={16} />
									</button>
								</div>
							) : (
								<div className="product-grid">
									{routineProducts.map((product) => (
										<ProductCard
											key={product.id}
											product={product}
											onSelect={setSelectedProduct}
											isInRoutine={true}
											onToggleRoutine={toggleRoutine}
										/>
									))}
								</div>
							)}
						</section>
						<section className="check-in-section">
							<h2>Daily Check-In</h2>

							{routineProducts.length === 0 ? (
								<p>
									Add a product to your routine before
									recording a check-in.
								</p>
							) : (
								<div
									className={
										routineProducts.length === 1
											? "check-in-grid single"
											: "check-in-grid"
									}
								>
									{routineProducts.map((product) => (
										<CheckInForm
											key={product.id}
											product={product}
											onSave={handleSaveCheckIn}
										/>
									))}
								</div>
							)}
						</section>
						<JournalHistory
							entries={journalEntries}
							products={products}
						/>
					</>
				)}
			</main>

			<footer className="footer">
				<p>BE BODYWISE PRODUCT COMPANION</p>
				<span>
					An informational experience, not a substitute for
					professional medical advice.
				</span>
			</footer>
		</div>
	);
}
