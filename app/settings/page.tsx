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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Trash2, Download, Upload } from "lucide-react";

export default function Settings() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [totalEntries, setTotalEntries] = useState(0);
	const [currentStreak, setCurrentStreak] = useState(0);
	const [notifications, setNotifications] = useState(false);

	useEffect(() => {
		setMounted(true);

		// Count total entries
		let count = 0;
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith("learning-entry-")) {
				count++;
			}
		}
		setTotalEntries(count);

		// Get current streak
		const streak = localStorage.getItem("learning-streak");
		if (streak) {
			setCurrentStreak(parseInt(streak));
		}

		// Get notification preference
		const notificationPref = localStorage.getItem("notifications-enabled");
		setNotifications(notificationPref === "true");
	}, []);

	const exportData = () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data: any = {};

		// Export all learning entries
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (
				key &&
				(key.startsWith("learning-entry-") || key === "learning-streak")
			) {
				data[key] = localStorage.getItem(key);
			}
		}

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `learn-tracker-backup-${
			new Date().toISOString().split("T")[0]
		}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string);

				// Import the data
				Object.entries(data).forEach(([key, value]) => {
					if (typeof value === "string") {
						localStorage.setItem(key, value);
					}
				});

				// Refresh the page to update all components
				window.location.reload();
			} catch {
				alert("Error importing data. Please check the file format.");
			}
		};
		reader.readAsText(file);
	};

	const clearAllData = () => {
		if (
			confirm(
				"Are you sure you want to delete all your learning entries? This action cannot be undone."
			)
		) {
			// Remove all learning-related data
			const keysToRemove = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (
					key &&
					(key.startsWith("learning-entry-") || key === "learning-streak")
				) {
					keysToRemove.push(key);
				}
			}

			keysToRemove.forEach((key) => localStorage.removeItem(key));

			// Reset local state
			setTotalEntries(0);
			setCurrentStreak(0);

			alert("All data has been cleared.");
		}
	};

	const toggleNotifications = (enabled: boolean) => {
		setNotifications(enabled);
		localStorage.setItem("notifications-enabled", enabled.toString());
	};

	if (!mounted) return null;

	return (
		<div className="space-y-8">
			<div className="text-center space-y-4 py-8">
				<div className="relative">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
						Settings
					</h1>
					<div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-lg -z-10 rounded-lg"></div>
				</div>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Manage your preferences and data
				</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* Theme Settings */}
				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/20 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
					<CardHeader className="relative">
						<CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
							Appearance
						</CardTitle>
						<CardDescription className="text-base">
							Customize how the app looks and feels
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 relative">
						<div className="space-y-2">
							<label className="text-sm font-medium">Theme</label>
							<div className="grid grid-cols-3 gap-2">
								<Button
									variant={theme === "light" ? "default" : "outline"}
									size="sm"
									onClick={() => setTheme("light")}
									className="flex items-center gap-2"
								>
									<Sun className="h-4 w-4" />
									Light
								</Button>
								<Button
									variant={theme === "dark" ? "default" : "outline"}
									size="sm"
									onClick={() => setTheme("dark")}
									className="flex items-center gap-2"
								>
									<Moon className="h-4 w-4" />
									Dark
								</Button>
								<Button
									variant={theme === "system" ? "default" : "outline"}
									size="sm"
									onClick={() => setTheme("system")}
									className="flex items-center gap-2"
								>
									<Monitor className="h-4 w-4" />
									System
								</Button>
							</div>
						</div>

						<Separator />

						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<label className="text-sm font-medium">Daily Reminders</label>
								<p className="text-xs text-muted-foreground">
									Get notified to log your learning
								</p>
							</div>
							<Switch
								checked={notifications}
								onCheckedChange={toggleNotifications}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Statistics */}
				<Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-950/20 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
					<CardHeader className="relative">
						<CardTitle className="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
							Your Progress
						</CardTitle>
						<CardDescription className="text-base">
							Overview of your learning journey
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 relative">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-2xl font-bold">{totalEntries}</p>
								<p className="text-xs text-muted-foreground">Total Entries</p>
							</div>
							<div className="space-y-1">
								<p className="text-2xl font-bold">{currentStreak}</p>
								<p className="text-xs text-muted-foreground">Day Streak</p>
							</div>
						</div>

						<Separator />

						<div className="text-center space-y-2">
							<p className="text-sm font-medium">Keep it up! 🎉</p>
							<p className="text-xs text-muted-foreground">
								You&apos;ve been consistently learning. Great job!
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Data Management */}
				<Card className="lg:col-span-2 relative overflow-hidden border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-900 dark:to-orange-950/20 shadow-xl hover:shadow-2xl transition-all duration-300">
					<div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
					<CardHeader className="relative">
						<CardTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
							Data Management
						</CardTitle>
						<CardDescription className="text-base">
							Export, import, or clear your learning data
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4 relative">
						<div className="grid gap-4 md:grid-cols-3">
							<Button
								onClick={exportData}
								variant="outline"
								className="flex items-center gap-2"
							>
								<Download className="h-4 w-4" />
								Export Data
							</Button>

							<div>
								<input
									type="file"
									accept=".json"
									onChange={importData}
									className="hidden"
									id="import-file"
								/>
								<Button asChild variant="outline" className="w-full">
									<label
										htmlFor="import-file"
										className="flex items-center gap-2 cursor-pointer"
									>
										<Upload className="h-4 w-4" />
										Import Data
									</label>
								</Button>
							</div>

							<Button
								onClick={clearAllData}
								variant="destructive"
								className="flex items-center gap-2"
							>
								<Trash2 className="h-4 w-4" />
								Clear All Data
							</Button>
						</div>

						<div className="text-xs text-muted-foreground space-y-1">
							<p>• Export: Download all your data as a JSON file</p>
							<p>• Import: Upload a previously exported file to restore data</p>
							<p>
								• Clear: Permanently delete all learning entries and reset
								streak
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
