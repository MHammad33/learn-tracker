"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CHANGELOG } from "@/constants/changelog";
import { DialogDescription } from "@radix-ui/react-dialog";

export function ChangelogNotifier() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const today = new Date().toDateString();
		const lastSeen = localStorage.getItem("whats_new_seen");

		if (lastSeen !== today) {
			setOpen(true);
			localStorage.setItem("whats_new_seen", today);
		}
	}, []);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>🚀 What’s New (v{CHANGELOG.version})</DialogTitle>
					<DialogDescription>
						Here's what's been recently added or improved.
					</DialogDescription>
				</DialogHeader>
				<ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
					{CHANGELOG.features.map((feature, idx) => (
						<li key={idx}>{feature}</li>
					))}
				</ul>
			</DialogContent>
		</Dialog>
	);
}
