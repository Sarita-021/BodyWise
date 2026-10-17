/** @format */

import { Leaf } from "lucide-react";

interface HeaderProps {
	onHome: () => void;
}

export default function Header({ onHome }: HeaderProps) {
	return (
		<header className="site-header">
			<button className="brand" onClick={onHome} aria-label="Go home">
				<span className="brand-mark">
					<Leaf size={22} />
				</span>
				<span>
					<strong>Be BodyWise</strong>
					<small>PRODUCT COMPANION</small>
				</span>
			</button>

			<nav className="header-nav" aria-label="Main navigation">
				<button onClick={onHome}>Explore</button>
				<span className="coming-soon">Ingredient guide</span>
				<span className="coming-soon">My routine</span>
			</nav>

			<span className="header-status">
				<span /> Your wellness space
			</span>
		</header>
	);
}
