"use client";

import { useState, useEffect } from "react";
import { FileText, ExternalLink, Clock, Loader2 } from "lucide-react";
import type { Proposal } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function HistoryPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Proposal | null>(null);

  useEffect(() => {
    fetch("/api/proposals")
      .then((res) => res.json())
      .then((data) => setProposals(data.proposals || []))
      .finally(() => setLoading(false));
  }, []);

  if (selected) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-accent hover:underline"
          >
            &larr; 목록으로
          </button>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Clock size={12} />
            {new Date(selected.created_at).toLocaleString("ko-KR")}
          </div>
          <a
            href={selected.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            {selected.url}
            <ExternalLink size={12} />
          </a>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <article className="prose prose-sm max-w-none prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-primary)] prose-li:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selected.result}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">생성 이력</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          이전에 생성한 제안서 목록입니다
        </p>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Loader2 size={28} className="animate-spin text-accent mx-auto" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="glass-card rounded-2xl p-12">
          <div className="text-center space-y-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mx-auto">
              <FileText className="text-[var(--text-muted)]" size={28} />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              아직 생성된 제안서가 없습니다
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="glass-card rounded-2xl p-5 w-full text-left hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {p.url}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <Clock size={11} />
                    {new Date(p.created_at).toLocaleString("ko-KR")}
                  </p>
                </div>
                <ExternalLink
                  size={16}
                  className="text-[var(--text-muted)] group-hover:text-accent transition-colors shrink-0 ml-4"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
