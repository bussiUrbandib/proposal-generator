-- ProposalAI Supabase Schema
-- Supabase SQL Editor에서 실행하세요

-- 제안서 이력 테이블
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 프롬프트 템플릿 테이블
CREATE TABLE prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 프롬프트 삽입
INSERT INTO prompt_templates (name, content, is_default) VALUES (
  '기본 제안서',
  '당신은 전문 제안서 작성 AI입니다.
주어진 웹페이지 내용을 분석하여 다음 구조의 제안서를 작성해주세요:

1. 요약 (Executive Summary)
2. 현황 분석
3. 제안 내용
4. 기대 효과
5. 실행 계획

전문적이고 설득력 있는 톤으로 작성하되, 구체적인 데이터와 근거를 포함해주세요.
한국어로 작성해주세요.',
  TRUE
);

-- RLS (Row Level Security) - 회원가입 없으므로 public access
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read proposals" ON proposals FOR SELECT USING (true);
CREATE POLICY "Allow public insert proposals" ON proposals FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read templates" ON prompt_templates FOR SELECT USING (true);
CREATE POLICY "Allow public insert templates" ON prompt_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update templates" ON prompt_templates FOR UPDATE USING (true);
