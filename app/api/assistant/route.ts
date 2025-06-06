import { NextResponse } from "next/server";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

function containsPersian(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const isPersian = containsPersian(message);
    const msgLower = message.toLowerCase();

    const wantsExplanation =
      /توضیح|بیشتر|دقیق|چرا|چطوری/.test(message) ||
      /explain|more|detail|why|how/.test(msgLower);

    const systemPrompt = isPersian
      ? wantsExplanation
        ? `شما یک دستیار حرفه‌ای تناسب اندام هستید. پاسخ کامل و مفصل بدهید.`
        : `شما یک دستیار حرفه‌ای تناسب اندام هستید. پاسخ‌های خود را فقط به صورت خلاصه و کوتاه بدهید.`
      : wantsExplanation
      ? `You are a professional fitness assistant. Give a detailed and thorough answer.`
      : `You are a professional fitness assistant. Only give short and concise answers.`;

    const payload = {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://fitogram-dashboard.vercel.app",
        "X-Title": "Fitogram AI Chat",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    let json;
    try {
      json = JSON.parse(responseText);
    } catch {
      return NextResponse.json({
        answer: "The model response could not be parsed.",
      });
    }

    if (!json.choices || !json.choices[0]) {
      return NextResponse.json({
        answer: "No response was returned by the model.",
      });
    }

    const answer =
      json.choices?.[0]?.message?.content ||
      "Failed to get response from the model.";

    if (isPersian && !containsPersian(answer)) {
      return NextResponse.json({
        answer:
          "The model did not generate a valid Persian response. Please try again.",
      });
    }

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({
      answer: "An error occurred while processing your request.",
    });
  }
}
