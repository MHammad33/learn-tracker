import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { text } = await req.json();

	if (!text || typeof text !== "string" || !text.trim()) {
		return NextResponse.json({ error: "Invalid text input" }, { status: 400 });
	}
	try {
		const response = await fetch(
			"https://api.deepinfra.com/v1/openai/chat/completions",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "deepinfra/mistralai/Mistral-7B-Instruct-v0.1",
					messages: [
						{
							role: "system",
							content:
								"You improve learning journal entries to be clearer, motivational, and concise.",
						},
						{
							role: "user",
							content: `Improve this journal entry:\n${text}`,
						},
					],
				}),
			}
		);

		const result = await response.json();

		console.log("Improve API Response:", result);

		const improvedText =
			result.choices?.[0]?.message?.content?.trim() ||
			"No improved text received.";
		return NextResponse.json({ improvedText });
	} catch (error) {
		console.error("Improve API Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
