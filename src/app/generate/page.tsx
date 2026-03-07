"use client";

import { useState, useEffect } from "react";
import { Globe, Sparkles, Loader2, Copy, Check, PenLine, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Mode = "ai" | "manual";

const TEMPLATES = [
  { id: "default", name: "기본 제안서", structure: `# 제안서 제목\n\n## 1. 요약 (Executive Summary)\n\n\n## 2. 현황 분석\n\n\n## 3. 제안 내용\n\n\n## 4. 기대 효과\n\n\n## 5. 실행 계획\n\n` },
  { id: "marketing", name: "마케팅 제안서", structure: `# 마케팅 제안서\n\n## 1. 프로젝트 개요\n\n\n## 2. 시장 분석\n\n\n## 3. 타겟 고객\n\n\n## 4. 마케팅 전략\n\n\n## 5. 예산 및 일정\n\n\n## 6. KPI 및 성과 측정\n\n` },
  { id: "business", name: "사업 제안서", structure: `# 사업 제안서\n\n## 1. 사업 개요\n\n\n## 2. 문제 정의\n\n\n## 3. 솔루션\n\n\n## 4. 비즈니스 모델\n\n\n## 5. 경쟁 우위\n\n\n## 6. 재무 계획\n\n\n## 7. 로드맵\n\n` },
];

export default function GeneratePage() {
  const [mode, setMode] = useState<Mode>("ai");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [manualText, setManualText] = useState("");
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("proposal-prompt");
    if (stored) setCustomPrompt(stored);
  }, []);

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customPrompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "생성에 실패했습니다");
      }

      const data = await res.json();
      setResult(data.proposal);
    } catch (err) {
      setResult(`오류: ${err instanceof Error ? err.message : "알 수 없는 오류"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (tpl) setManualText(tpl.structure);
  };

  const displayText = mode === "ai" ? result : manualText;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">제안서 생성</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          AI 자동 생성 또는 직접 작성할 수 있습니다
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("ai")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            mode === "ai"
              ? "glass-button"
              : "text-[var(--text-secondary)] hover:bg-white/50"
          }`}
        >
          <Bot size={16} />
          AI 생성
        </button>
        <button
          onClick={() => {
            setMode("manual");
            if (!manualText) handleTemplateSelect("default");
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            mode === "manual"
              ? "glass-button"
              : "text-[var(--text-secondary)] hover:bg-white/50"
          }`}
        >
          <PenLine size={16} />
          직접 작성
        </button>
      </div>

      {/* AI Mode */}
      {mode === "ai" && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            웹페이지 URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                size={18}
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="glass-input w-full rounded-xl py-3 pl-11 pr-4 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || !url.trim()}
              className="glass-button rounded-xl px-6 py-3 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {loading ? "생성 중..." : "생성하기"}
            </button>
          </div>
          {customPrompt && (
            <p className="text-xs text-accent">커스텀 프롬프트가 적용됩니다</p>
          )}
        </div>
      )}

      {/* Manual Mode */}
      {mode === "manual" && (
        <div className="space-y-4">
          {/* Template Select */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              템플릿 선택
            </label>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleTemplateSelect(tpl.id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    selectedTemplate === tpl.id
                      ? "bg-accent text-white shadow-sm"
                      : "bg-white/50 text-[var(--text-secondary)] hover:bg-white/70"
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Editor + Preview */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                {showPreview ? "미리보기" : "내용 작성"} (마크다운)
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-accent hover:underline"
              >
                {showPreview ? "편집으로 돌아가기" : "미리보기"}
              </button>
            </div>

            {showPreview ? (
              <article className="prose prose-sm max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-primary)] prose-li:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] min-h-[300px]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {manualText}
                </ReactMarkdown>
              </article>
            ) : (
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                rows={16}
                className="glass-input w-full rounded-xl p-4 text-sm resize-none leading-relaxed font-mono"
                placeholder="마크다운으로 제안서를 작성하세요..."
              />
            )}
          </div>
        </div>
      )}

      {/* AI Result */}
      {mode === "ai" && (result || loading) && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              생성된 제안서
            </h2>
            {result && !loading && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-white/50 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? "복사됨" : "복사"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-3">
                <Loader2 size={32} className="animate-spin text-accent mx-auto" />
                <p className="text-sm text-[var(--text-secondary)]">
                  AI가 제안서를 작성하고 있습니다...
                </p>
              </div>
            </div>
          ) : (
            <article className="prose prose-sm max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-primary)] prose-li:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </article>
          )}
        </div>
      )}

      {/* Copy button for manual mode */}
      {mode === "manual" && manualText && (
        <div className="flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-white/50 transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? "복사됨" : "복사하기"}
          </button>
        </div>
      )}
    </div>
  );
}
