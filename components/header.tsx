"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Book, Settings, Flame, HistoryIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
	const [streak, setStreak] = useState(0);

	useEffect(() => {
		// Get streak from localStorage
		const savedStreak = localStorage.getItem("learning-streak");
		if (savedStreak) {
			setStreak(parseInt(savedStreak));
		}

		// Listen for streak updates
		const handleStreakUpdate = () => {
			const updatedStreak = localStorage.getItem("learning-streak");
			if (updatedStreak) {
				setStreak(parseInt(updatedStreak));
			}
		};

		window.addEventListener("streakUpdated", handleStreakUpdate);
		return () =>
			window.removeEventListener("streakUpdated", handleStreakUpdate);
	}, []);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
			<div className="px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex h-16 items-center max-w-7xl mx-auto">
				<div className="mr-6 flex">
					<Link href="/" className="flex items-center space-x-3 group">
						<div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white transition-transform group-hover:scale-105">
							<Book className="h-5 w-5" />
						</div>
						<span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Learn Tracker
						</span>
					</Link>
				</div>

				<div className="flex flex-1 items-center justify-between space-x-4">
					<div className="flex items-center space-x-2">
						{streak > 0 && (
							<div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
								<Flame className="h-4 w-4 text-orange-500" />
								<span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
									{streak}-day streak
								</span>
							</div>
						)}
					</div>

					<nav className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							asChild
							className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950"
						>
							<Link href="/">Dashboard</Link>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							asChild
							className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950"
						>
							<Link href="/history">
								<HistoryIcon className="h-4 w-4" />
							</Link>
						</Button>
						<Button
							variant="ghost"
							size="sm"
							asChild
							className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950"
						>
							<Link href="/settings">
								<Settings className="h-4 w-4" />
							</Link>
						</Button>
						<ThemeToggle />
					</nav>
				</div>
			</div>
		</header>
	);
}
