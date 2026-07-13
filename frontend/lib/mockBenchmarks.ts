/**
 * Mock benchmark data used as a fallback when the API is unavailable
 * (e.g. Neon free-tier data transfer quota exceeded).
 * 
 * Remove / replace with real data once the backend is back online.
 */

import type { BenchmarkItem, BenchmarkDetail } from './benchmarks';

export const MOCK_BENCHMARKS: BenchmarkItem[] = [
  { id: 'b1', name: 'ImageNet', slug: 'imagenet', _count: { rankings: 120, claims: 45 } },
  { id: 'b2', name: 'COCO Detection', slug: 'coco-detection', _count: { rankings: 98, claims: 32 } },
  { id: 'b3', name: 'SWE-Bench Verified', slug: 'swe-bench-verified', _count: { rankings: 54, claims: 18 } },
  { id: 'b4', name: 'HumanEval', slug: 'humaneval', _count: { rankings: 87, claims: 29 } },
  { id: 'b5', name: 'MATH', slug: 'math', _count: { rankings: 62, claims: 21 } },
  { id: 'b6', name: 'OCRBench v2', slug: 'ocrbench-v2', _count: { rankings: 41, claims: 13 } },
  { id: 'b7', name: 'OmniDoc', slug: 'omnidoc', _count: { rankings: 33, claims: 11 } },
  { id: 'b8', name: 'VQA v2', slug: 'vqa-v2', _count: { rankings: 76, claims: 25 } },
  { id: 'b9', name: 'MMLU', slug: 'mmlu', _count: { rankings: 110, claims: 38 } },
  { id: 'b10', name: 'HellaSwag', slug: 'hellaswag', _count: { rankings: 89, claims: 31 } },
  { id: 'b11', name: 'GSM8K', slug: 'gsm8k', _count: { rankings: 74, claims: 24 } },
  { id: 'b12', name: 'ARC Challenge', slug: 'arc-challenge', _count: { rankings: 65, claims: 20 } },
];

function makePaper(id: string, title: string, slug: string, year: number, month: number) {
  return {
    id,
    title,
    slug,
    githubStars: Math.floor(Math.random() * 8000) + 500,
    citationCount: Math.floor(Math.random() * 2000) + 50,
    publicationDate: `${year}-${String(month).padStart(2, '0')}-15T00:00:00.000Z`,
  };
}

export const MOCK_BENCHMARK_DETAILS: Record<string, BenchmarkDetail> = {
  'imagenet': {
    id: 'b1',
    name: 'ImageNet',
    slug: 'imagenet',
    rankings: [
      { id: 'r1', rank: 1, previous_rank: 2, paper: makePaper('p1', 'EVA: Exploring the Limits of Masked Visual Representation Learning at Scale', 'eva-exploring-limits', 2023, 3) },
      { id: 'r2', rank: 2, previous_rank: 1, paper: makePaper('p2', 'CoCa: Contrastive Captioners are Image-Text Foundation Models', 'coca-contrastive-captioners', 2022, 5) },
      { id: 'r3', rank: 3, previous_rank: 3, paper: makePaper('p3', 'ViT-22B: Scaling Vision Transformers to 22 Billion Parameters', 'vit-22b-scaling', 2023, 2) },
      { id: 'r4', rank: 4, previous_rank: null, paper: makePaper('p4', 'SwinV2: Scaling Up Capacity and Resolution for Vision Representation', 'swinv2-scaling-up', 2022, 1) },
      { id: 'r5', rank: 5, previous_rank: 4, paper: makePaper('p5', 'CLIP: Learning Transferable Visual Models From Natural Language Supervision', 'clip-learning-transferable', 2021, 2) },
    ],
    claims: [
      { id: 'c1', paper: makePaper('p1', 'EVA: Exploring the Limits of Masked Visual Representation Learning at Scale', 'eva-exploring-limits', 2023, 3) },
      { id: 'c2', paper: makePaper('p6', 'DeiT III: Revenge of the ViT', 'deit-iii-revenge', 2022, 4) },
    ],
  },
  'humaneval': {
    id: 'b4',
    name: 'HumanEval',
    slug: 'humaneval',
    rankings: [
      { id: 'r1', rank: 1, previous_rank: 2, paper: makePaper('p10', 'GPT-4 Technical Report', 'gpt-4-technical-report', 2023, 3) },
      { id: 'r2', rank: 2, previous_rank: 1, paper: makePaper('p11', 'Claude 3.5 Sonnet: Model Card', 'claude-35-sonnet-model-card', 2024, 6) },
      { id: 'r3', rank: 3, previous_rank: null, paper: makePaper('p12', 'DeepSeek-Coder: When the Large Language Model Meets Programming', 'deepseek-coder', 2024, 1) },
      { id: 'r4', rank: 4, previous_rank: 3, paper: makePaper('p13', 'WizardCoder: Empowering Code Large Language Models with Evol-Instruct', 'wizardcoder-empowering', 2023, 6) },
      { id: 'r5', rank: 5, previous_rank: 5, paper: makePaper('p14', 'StarCoder: May the Source be with You!', 'starcoder-may-the-source', 2023, 5) },
      { id: 'r6', rank: 6, previous_rank: 6, paper: makePaper('p15', 'CodeLlama: Open Foundation Models for Code', 'codellama-open-foundation', 2023, 8) },
    ],
    claims: [
      { id: 'c1', paper: makePaper('p10', 'GPT-4 Technical Report', 'gpt-4-technical-report', 2023, 3) },
    ],
  },
  'swe-bench-verified': {
    id: 'b3',
    name: 'SWE-Bench Verified',
    slug: 'swe-bench-verified',
    rankings: [
      { id: 'r1', rank: 1, previous_rank: null, paper: makePaper('p20', 'SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering', 'swe-agent-agent-computer', 2024, 5) },
      { id: 'r2', rank: 2, previous_rank: 1, paper: makePaper('p21', 'Agentless: Demystifying LLM-based Software Engineering Agents', 'agentless-demystifying', 2024, 7) },
      { id: 'r3', rank: 3, previous_rank: 2, paper: makePaper('p22', 'AutoCodeRover: Autonomous Program Improvement', 'autocoderover-autonomous', 2024, 4) },
    ],
    claims: [],
  },
};

/**
 * Returns mock detail for any slug, generating a plausible structure
 * if the slug isn't in the predefined map.
 */
export function getMockBenchmarkDetail(slug: string): BenchmarkDetail {
  if (MOCK_BENCHMARK_DETAILS[slug]) {
    return MOCK_BENCHMARK_DETAILS[slug];
  }

  // Generic fallback for unknown slugs
  const name = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    id: `mock-${slug}`,
    name,
    slug,
    rankings: [
      { id: 'r1', rank: 1, previous_rank: null,  paper: makePaper('mp1', `${name}: State-of-the-Art Baseline Paper`, `${slug}-sota-baseline`, 2025, 3) },
      { id: 'r2', rank: 2, previous_rank: 1,      paper: makePaper('mp2', `Advancing ${name} with Novel Architecture`, `${slug}-advancing-novel`, 2025, 1) },
      { id: 'r3', rank: 3, previous_rank: 2,      paper: makePaper('mp3', `Efficient ${name} via Sparse Attention`, `${slug}-efficient-sparse`, 2024, 11) },
      { id: 'r4', rank: 4, previous_rank: 3,      paper: makePaper('mp4', `Scaling Laws for ${name} Evaluation`, `${slug}-scaling-laws`, 2024, 8) },
    ],
    claims: [
      { id: 'c1', paper: makePaper('mp1', `${name}: State-of-the-Art Baseline Paper`, `${slug}-sota-baseline`, 2025, 3) },
    ],
  };
}
