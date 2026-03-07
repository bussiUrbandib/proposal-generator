"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw } from "lucide-react";

const DEFAULT_PROMPT = `당신은 전문 제안서 작성 AI입니다.
주어진 웹페이지 내용을 분석하여 다음 구조의 제안서를 작성해주세요:

1. 요약 (Executive Summary)
2. 현황 분석
3. 제안 내용
4. 기대 효과
5. 실행 계획

전문적이고 설득력 있는 톤으로 작성하되, 구체적인 데이터와 근거를 포함해주세요.
한국어로 작성해주세요.`;

export default function SettingsPage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("proposal-prompt");
    if (stored) setPrompt(stored);
  }, []);

  const handleSave = () => {
    localStorage.setItem("proposal-prompt", prompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setPrompt(DEFAULT_PROMPT);
    localStorage.removeItem("proposal-prompt");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">설정</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          AI 프롬프트를 수정하여 제안서 스타일을 조정할 수 있습니다
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          기본 프롬프트
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={12}
          className="glass-input w-full rounded-xl p-4 text-sm resize-none leading-relaxed"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="glass-button rounded-xl px-5 py-2.5 text-sm font-medium flex items-center gap-2"
          >
            <Save size={16} />
            {saved ? "저장 완료!" : "저장"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-white/50 transition-all"
          >
            <RotateCcw size={16} />
            기본값으로 복원
          </button>
        </div>
      </div>
    </div>
  );
}
