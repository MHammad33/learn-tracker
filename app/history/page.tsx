"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, BookOpen, Filter, Clock } from "lucide-react";

interface LearningEntry {
	id: string;
	content: string;
	tags: string[];
	date: string;
}

export default function History() {
	const [entries, setEntries] = useState<LearningEntry[]>([]);
	const [filteredEntries, setFilteredEntries] = useState<LearningEntry[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [allTags, setAllTags] = useState<string[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		loadEntries();
	}, []);

	const loadEntries = () => {
		const loadedEntries: LearningEntry[] = [];
		const tags = new Set<string>();

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith("learning-entry-")) {
				try {
					const entry = JSON.parse(localStorage.getItem(key) || "");
					if (entry.content && entry.date) {
						loadedEntries.push(entry);
						entry.tags?.forEach((tag: string) => tags.add(tag));
					}
				} catch (error) {
					console.error("Error parsing entry:", error);
				}
			}
		}

		// Sort entries by date (newest first)
		loadedEntries.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		setEntries(loadedEntries);
		setAllTags(Array.from(tags));
	};

	const filterEntries = useCallback(() => {
		let filtered = entries;

		// Filter by search term
		if (searchTerm) {
			filtered = filtered.filter(
				(entry) =>
					entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
					entry.tags.some((tag) =>
						tag.toLowerCase().includes(searchTerm.toLowerCase())
					)
			);
		}

		// Filter by selected tag
		if (selectedTag) {
			filtered = filtered.filter((entry) => entry.tags.includes(selectedTag));
		}

		setFilteredEntries(filtered);
	}, [entries, searchTerm, selectedTag]);

	useEffect(() => {
		filterEntries();
	}, [filterEntries]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return "Today";
		} else if (date.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString("en-US", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		}
	};

	const getRelativeTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 1) return "1 day ago";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return `${Math.floor(diffDays / 365)} years ago`;
	};

	if (!mounted) return null;

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="text-center space-y-4 py-8">
				<div className="relative">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
						Learning History
					</h1>
					<div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 blur-lg -z-10 rounded-lg"></div>
				</div>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Explore your learning journey and track your progress over time
				</p>
				<div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
					<BookOpen className="h-4 w-4" />
					<span>{entries.length} total entries</span>
				</div>
			</div>

			{/* Search and Filter Section */}
			<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-900 dark:to-indigo-950/20 shadow-xl">
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5"></div>
				<CardHeader className="relative">
					<CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
						Search & Filter
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 relative">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="relative">
							<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search entries or tags..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 bg-white/50 dark:bg-gray-800/50 border-2 border-indigo-100 dark:border-indigo-900 focus:border-indigo-300 dark:focus:border-indigo-700 rounded-xl"
							/>
						</div>
						<div className="relative">
							<Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
							<select
								value={selectedTag}
								onChange={(e) => setSelectedTag(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-gray-800/50 border-2 border-indigo-100 dark:border-indigo-900 focus:border-indigo-300 dark:focus:border-indigo-700 rounded-xl text-sm"
							>
								<option value="">All tags</option>
								{allTags.map((tag) => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
							</select>
						</div>
					</div>
					{(searchTerm || selectedTag) && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">
								Showing {filteredEntries.length} of {entries.length} entries
							</span>
							{(searchTerm || selectedTag) && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setSearchTerm("");
										setSelectedTag("");
									}}
									className="h-8 px-3"
								>
									Clear filters
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Entries Section */}
			<div className="space-y-6">
				{filteredEntries.length === 0 ? (
					<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/20 shadow-lg">
						<CardContent className="py-12 text-center">
							<div className="text-6xl mb-4">📚</div>
							<h3 className="text-xl font-semibold mb-2">
								{entries.length === 0
									? "No entries yet"
									: "No matching entries"}
							</h3>
							<p className="text-muted-foreground">
								{entries.length === 0
									? "Start your learning journey by adding your first entry!"
									: "Try adjusting your search or filter criteria"}
							</p>
						</CardContent>
					</Card>
				) : (
					filteredEntries.map((entry, index) => (
						<Card
							key={entry.id}
							className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/10 shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-indigo-500/3"></div>
							<CardHeader className="relative pb-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
											<Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<CardTitle className="text-lg font-semibold">
												{formatDate(entry.date)}
											</CardTitle>
											<div className="flex items-center space-x-1 text-sm text-muted-foreground">
												<Clock className="h-3 w-3" />
												<span>{getRelativeTime(entry.date)}</span>
											</div>
										</div>
									</div>
									<div className="text-right">
										<Badge
											variant="outline"
											className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
										>
											Entry #{entries.length - index}
										</Badge>
									</div>
								</div>
							</CardHeader>
							<CardContent className="relative space-y-4">
								<div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
									<p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
										{entry.content}
									</p>
								</div>

								{entry.tags && entry.tags.length > 0 && (
									<>
										<Separator className="bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 h-px" />
										<div className="space-y-2">
											<label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
												Tags:
											</label>
											<div className="flex flex-wrap gap-2">
												{entry.tags.map((tag, tagIndex) => (
													<Badge
														key={tagIndex}
														className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 rounded-full px-3 py-1 hover:from-blue-600 hover:to-indigo-600 transition-all cursor-pointer"
														onClick={() => setSelectedTag(tag)}
													>
														{tag}
													</Badge>
												))}
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
