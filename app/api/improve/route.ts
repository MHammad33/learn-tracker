import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { text } = await req.json();

		if (!text || typeof text !== "string" || !text.trim()) {
			return NextResponse.json(
				{ error: "Invalid text input" },
				{ status: 400 }
			);
		}

		const improvedText = `Improved: ${text.trim()}`;
		return NextResponse.json({ improvedText });
	} catch (error) {
		console.error("Improve API Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
