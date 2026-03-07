import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_PROMPT = `당신은 전문 제안서 작성 AI입니다.
주어진 웹페이지 내용을 분석하여 다음 구조의 제안서를 작성해주세요:

1. 요약 (Executive Summary)
2. 현황 분석
3. 제안 내용
4. 기대 효과
5. 실행 계획

전문적이고 설득력 있는 톤으로 작성하되, 구체적인 데이터와 근거를 포함해주세요.
한국어로 작성해주세요.`;

async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`URL을 가져올 수 없습니다: ${res.status}`);
  }

  const html = await res.text();

  // 기본 HTML 태그 제거하여 텍스트 추출
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000); // 토큰 제한을 위해 텍스트 잘라내기

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { url, customPrompt } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요." },
        { status: 500 }
      );
    }

    // 1. URL 스크래핑
    const pageContent = await scrapeUrl(url);

    // 2. OpenRouter API 호출
    const systemPrompt = customPrompt || DEFAULT_PROMPT;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "ProposalAI",
      },
      body: JSON.stringify({
        model: "anthropic/claude-opus-4",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `다음 웹페이지 내용을 분석하여 제안서를 작성해주세요.\n\nURL: ${url}\n\n웹페이지 내용:\n${pageContent}`,
          },
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "AI 응답 생성에 실패했습니다");
    }

    const data = await response.json();
    const proposal = data.choices?.[0]?.message?.content || "제안서 생성에 실패했습니다.";

    // 3. Supabase에 이력 저장 (실패해도 결과는 반환)
    if (supabase) {
      try {
        await supabase.from("proposals").insert({
          url,
          prompt_used: systemPrompt,
          result: proposal,
        });
      } catch {
        console.warn("Supabase 저장 실패");
      }
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
