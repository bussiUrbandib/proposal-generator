"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Proposal } from "@/lib/supabase";

export default function Home() {
  const [count, setCount] = useState(0);
  const [recent, setRecent] = useState<Proposal | null>(null);

  useEffect(() => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((data) => {
        const list = data.proposals || [];
        setCount(list.length);
        if (list.length > 0) setRecent(list[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">대시보드</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          AI 제안서 생성기에 오신 것을 환영합니다
        </p>
      </div>

      {/* Quick Action Card */}
      <Link href="/generate" className="block">
        <div className="glass-card rounded-2xl p-8 hover:shadow-lg transition-all group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <Sparkles className="text-accent" size={28} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  새 제안서 생성
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  URL을 입력하면 AI가 제안서를 자동으로 작성합니다
                </p>
              </div>
            </div>
            <ArrowRight
              className="text-[var(--text-muted)] group-hover:text-accent group-hover:translate-x-1 transition-all"
              size={20}
            />
          </div>
        </div>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <FileText className="text-accent" size={20} />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              생성된 제안서
            </span>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">{count}</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
              <Sparkles className="text-purple-500" size={20} />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              사용 가능한 템플릿
            </span>
          </div>
          <p className="text-3xl font-bold text-[var(--text-primary)]">3</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Clock className="text-emerald-500" size={20} />
            </div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              최근 생성
            </span>
          </div>
          {recent ? (
            <p className="text-sm text-[var(--text-primary)] truncate">{recent.url}</p>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">아직 생성된 제안서가 없습니다</p>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
          사용 방법
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "URL 입력", desc: "분석할 웹페이지 URL을 입력합니다" },
            { step: "02", title: "AI 분석", desc: "AI가 웹페이지를 분석하고 제안서를 작성합니다" },
            { step: "03", title: "결과 확인", desc: "생성된 제안서를 확인하고 복사합니다" },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <span className="text-3xl font-bold text-accent/20">{item.step}</span>
              <div>
                <h4 className="font-semibold text-[var(--text-primary)]">{item.title}</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
