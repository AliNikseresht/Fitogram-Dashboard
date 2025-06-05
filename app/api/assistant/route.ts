import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

function containsPersian(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export async function POST(req: Request) {
  try {
    const { userId, message } = await req.json();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: lastLog } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("profile_id", userId)
      .order("log_date", { ascending: false })
      .limit(1)
      .single();

    const { data: lastSleep } = await supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", userId)
      .order("sleep_date", { ascending: false })
      .limit(1)
      .single();

    const context = `
User profile:
- Goal: ${profile?.goal}
- Height: ${profile?.height} cm
- Weight: ${profile?.weight} kg
- Body Fat: ${profile?.body_fat_percent}%
- Muscle Mass: ${profile?.muscle_mass}kg

Last daily log:
- Date: ${lastLog?.log_date}
- Weight: ${lastLog?.weight}
- Mood: ${lastLog?.mood}
- Water: ${lastLog?.water_intake} glasses

Last sleep:
- Duration: ${lastSleep?.duration} hours
- Quality: ${lastSleep?.quality}/5
`;

    const isPersian = containsPersian(message);

    const systemPrompt = isPersian
      ? "You are a professional fitness assistant. Please respond in clear and simple Persian. Use short sentences and common words."
      : "You are a helpful fitness assistant who gives clear and concise advice in English.";

    const languageInstruction = isPersian
      ? "Respond only in Persian, clearly and understandably."
      : "Respond only in English, clearly and concisely.";

    const payload = {
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: languageInstruction },
        { role: "user", content: `Context:\n${context}` },
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
