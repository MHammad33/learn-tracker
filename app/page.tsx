"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Save, Flame } from "lucide-react";

interface LearningEntry {
	id: string;
	content: string;
	tags: string[];
	date: string;
}

export default function Dashboard() {
	const [todayEntry, setTodayEntry] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [savedEntry, setSavedEntry] = useState<LearningEntry | null>(null);
	const [streak, setStreak] = useState(0);

	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		// Load today's entry
		const savedToday = localStorage.getItem(`learning-entry-${today}`);
		if (savedToday) {
			const entry = JSON.parse(savedToday);
			setSavedEntry(entry);
			setTodayEntry(entry.content);
			setTags(entry.tags);
		}

		// Load streak
		const savedStreak = localStorage.getItem("learning-streak");
		if (savedStreak) {
			setStreak(parseInt(savedStreak));
		}
	}, [today]);

	const addTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const saveEntry = () => {
		if (!todayEntry.trim()) return;

		const entry: LearningEntry = {
			id: today,
			content: todayEntry,
			tags: tags,
			date: today,
		};

		// Save entry
		localStorage.setItem(`learning-entry-${today}`, JSON.stringify(entry));
		setSavedEntry(entry);

		// Update streak
		const newStreak = calculateStreak();
		setStreak(newStreak);
		localStorage.setItem("learning-streak", newStreak.toString());

		// Dispatch event to update header
		window.dispatchEvent(new Event("streakUpdated"));
	};

	const calculateStreak = (): number => {
		let currentStreak = 0;
		const checkDate = new Date();

		while (true) {
			const dateString = checkDate.toISOString().split("T")[0];
			const entry = localStorage.getItem(`learning-entry-${dateString}`);

			if (entry) {
				currentStreak++;
				checkDate.setDate(checkDate.getDate() - 1);
			} else {
				break;
			}
		}

		return currentStreak;
	};

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="text-center space-y-4 py-8">
				<div className="relative">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
						Learning Dashboard
					</h1>
					<div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg -z-10 rounded-lg"></div>
				</div>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Track your daily learning journey and build consistent learning habits
				</p>
				{streak > 0 && (
					<div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 px-6 py-3 rounded-full border border-orange-200 dark:border-orange-700 shadow-lg">
						<Flame className="h-6 w-6 text-orange-500 animate-bounce" />
						<span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
							{streak}-day learning streak! 🎉
						</span>
					</div>
				)}
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Input Section */}
				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-950/20 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
					<CardHeader className="relative">
						<CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							What did you learn today?
						</CardTitle>
						<CardDescription className="text-base">
							Share your learning experience, insights, or new skills
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6 relative">
						<Textarea
							placeholder="Today I learned about..."
							value={todayEntry}
							onChange={(e) => setTodayEntry(e.target.value)}
							className="min-h-[140px] bg-white/50 dark:bg-gray-800/50 border-2 border-blue-100 dark:border-blue-900 focus:border-blue-300 dark:focus:border-blue-700 rounded-xl resize-none"
						/>

						{/* Tags Section */}
						<div className="space-y-3">
							<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
								Tags (optional)
							</label>
							<div className="flex gap-3">
								<Input
									placeholder="Add a tag..."
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && addTag()}
									className="bg-white/50 dark:bg-gray-800/50 border-2 border-purple-100 dark:border-purple-900 focus:border-purple-300 dark:focus:border-purple-700 rounded-xl"
								/>
								<Button
									onClick={addTag}
									size="sm"
									className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0 rounded-xl px-4"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{tags.map((tag, index) => (
										<Badge
											key={index}
											className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 rounded-full px-3 py-1 hover:from-blue-600 hover:to-purple-600 transition-all"
										>
											{tag}
											<X
												className="h-3 w-3 cursor-pointer hover:scale-110 transition-transform"
												onClick={() => removeTag(tag)}
											/>
										</Badge>
									))}
								</div>
							)}
						</div>

						<Button
							onClick={saveEntry}
							className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 rounded-xl py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
							disabled={!todayEntry.trim()}
						>
							<Save className="h-5 w-5 mr-3" />
							Save Today&apos;s Learning
						</Button>
					</CardContent>
				</Card>

				{/* Today's Entry Display */}
				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/20 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
					<CardHeader className="relative">
						<CardTitle className="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
							Today&apos;s Entry
						</CardTitle>
						<CardDescription className="text-base font-medium">
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</CardDescription>
					</CardHeader>
					<CardContent className="relative">
						{savedEntry ? (
							<div className="space-y-6">
								<div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
									<p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
										{savedEntry.content}
									</p>
								</div>

								{savedEntry.tags.length > 0 && (
									<>
										<Separator className="bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-800 dark:to-blue-800 h-px" />
										<div className="space-y-3">
											<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
												Tags:
											</label>
											<div className="flex flex-wrap gap-2">
												{savedEntry.tags.map((tag, index) => (
													<Badge
														key={index}
														className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 rounded-full px-3 py-1"
													>
														{tag}
													</Badge>
												))}
											</div>
										</div>
									</>
								)}

								<div className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg border">
									✨ Saved on {new Date(savedEntry.date).toLocaleDateString()}
								</div>
							</div>
						) : (
							<div className="text-center py-12">
								<div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
									<p className="text-lg font-medium text-muted-foreground mb-2">
										No entry for today yet.
									</p>
									<p className="text-base text-muted-foreground">
										Start by adding what you learned!
									</p>
									<div className="mt-4 text-4xl">📚</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
