import { NextRequest, NextResponse } from "next/server";
import type { GenerateRequest } from "@/types";

const SYSTEM_PROMPT_VI = `Bạn là một chuyên gia tạo câu hỏi trắc nghiệm. Nhiệm vụ của bạn là tạo các câu hỏi trắc nghiệm từ nội dung được cung cấp.

Quy tắc:
- Các câu hỏi phải dựa trên nội dung được cung cấp.
- Đảm bảo đáp án đúng là chính xác và có thể xác minh được từ nội dung.
- Giải thích phải ngắn gọn và rõ ràng.
- Loại "single" có đúng 1 đáp án đúng. Loại "multi" có 2 đến 4 đáp án đúng.
- Không tạo câu hỏi mơ hồ hoặc câu hỏi có thể tranh cãi.
- Phân bổ độ khó hợp lý.

Trả về JSON theo định dạng:
{
  "title": "Tiêu đề bài quiz",
  "description": "Mô tả ngắn",
  "questions": [
    {
      "id": "q1",
      "question": "Nội dung câu hỏi?",
      "options": [
        {"id": "a", "text": "Đáp án A"},
        {"id": "b", "text": "Đáp án B"},
        {"id": "c", "text": "Đáp án C"},
        {"id": "d", "text": "Đáp án D"}
      ],
      "correctAnswerIds": ["a"],
      "explanation": "Giải thích tại sao đáp án đúng",
      "type": "single",
      "difficulty": "easy"
    }
  ]
}`;

const SYSTEM_PROMPT_EN = `You are an expert MCQ generator. Your task is to create multiple-choice questions from the provided content.

Rules:
- Questions must be based solely on the provided content.
- Ensure correct answers are accurate and verifiable from the content.
- Explanations should be concise and clear.
- Type "single" has exactly 1 correct answer. Type "multi" has 2 to 4 correct answers.
- Do not create ambiguous or debatable questions.
- Difficulty should be distributed appropriately.

Return JSON in the format:
{
  "title": "Quiz Title",
  "description": "Short description",
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": [
        {"id": "a", "text": "Option A"},
        {"id": "b", "text": "Option B"},
        {"id": "c", "text": "Option C"},
        {"id": "d", "text": "Option D"}
      ],
      "correctAnswerIds": ["a"],
      "explanation": "Explanation of why the answer is correct",
      "type": "single",
      "difficulty": "easy"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { text, settings, questionCount, questionTypes, difficulty, language } = body;

    if (!text.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const systemPrompt = language === "vi" ? SYSTEM_PROMPT_VI : SYSTEM_PROMPT_EN;
    const userPrompt = language === "vi"
      ? `Tạo ${questionCount} câu hỏi trắc nghiệm từ nội dung sau. Loại câu hỏi: ${questionTypes.includes("single") && questionTypes.includes("multi") ? "single-choice và multi-choice" : questionTypes.join(", ")}. Độ khó: ${difficulty}. Nội dung:\n\n${text}`
      : `Generate ${questionCount} multiple-choice questions from the following content. Question types: ${questionTypes.includes("single") && questionTypes.includes("multi") ? "single-choice and multi-choice" : questionTypes.join(", ")}. Difficulty: ${difficulty}. Content:\n\n${text}`;

    const response = await fetch(`${settings.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      }),
      // 5min timeout for long generations
      signal: AbortSignal.timeout(300_000),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `LLM API error: ${err.slice(0, 500)}` }, { status: 502 });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content ?? "";

    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    let quiz;
    try {
      quiz = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Failed to parse LLM response as JSON", raw: content.slice(0, 2000) }, { status: 502 });
    }

    return NextResponse.json({ quiz, raw: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
