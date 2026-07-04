import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { baseUrl, apiKey } = await req.json();
    if (!baseUrl || !apiKey) {
      return NextResponse.json({ error: "baseUrl and apiKey are required" }, { status: 400 });
    }

    const url = `${baseUrl.replace(/\/$/, "")}/models`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // 10s timeout
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `Failed to fetch models (${res.status}): ${err.slice(0, 300)}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    // OpenAI-compatible: { data: [{ id, ... }] }
    const models: string[] = Array.isArray(data?.data)
      ? data.data.map((m: any) => m?.id).filter(Boolean)
      : Array.isArray(data?.models)
        ? data.models.map((m: any) => (typeof m === "string" ? m : m?.id)).filter(Boolean)
        : [];

    if (models.length === 0) {
      return NextResponse.json({ error: "No models found at this endpoint", raw: data }, { status: 404 });
    }

    return NextResponse.json({ models });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
