export const sidebarData = {
  discover: [
    { id: "trending", label: "Trending Papers", icon: "flame", active: true },
    { id: "latest", label: "Latest Papers", icon: "clock" },
    { id: "github-stars", label: "Most GitHub Stars", icon: "star" },
  ],
  tasks: [
    { id: "agents", label: "Agents", icon: "bot" },
    { id: "reasoning", label: "Reasoning", icon: "brain" },
    { id: "language-modeling", label: "Language Modeling", icon: "message-square" },
    { id: "coding-agents", label: "Coding Agents", icon: "code" },
    { id: "computer-use", label: "Computer Use", icon: "monitor" },
    { id: "world-models", label: "World Models", icon: "globe" },
    { id: "robotics", label: "Robotics", icon: "cpu" },
  ],
  methods: [
    { id: "transformer", label: "Transformer", icon: "zap" },
    { id: "chain-of-thought", label: "Chain of Thought", icon: "git-branch" },
    { id: "react", label: "ReAct", icon: "refresh-cw" },
    { id: "lora", label: "LoRA", icon: "layers" },
    { id: "rlhf", label: "RLHF", icon: "award" },
    { id: "dpo", label: "DPO", icon: "sliders" },
    { id: "mcp", label: "MCP", icon: "share-2" },
  ],
  generation: [
    { id: "text-gen", label: "Text Generation", icon: "type" },
    { id: "image-gen", label: "Image Generation", icon: "image" },
    { id: "video-gen", label: "Video Generation", icon: "video" },
    { id: "audio-gen", label: "Audio Generation", icon: "music" },
  ],
};

export const dashboardCards = {
  breakthrough: {
    label: "BREAKTHROUGH TODAY",
    badge: "Official Release",
    title: "OpenAI releases GPT-4.5 Turbo",
    description: "First-party model in the GPT-4.5 series, now available in OpenAI Studio.",
    bullets: [
      "Beats Gemini 1.5 Pro on 7 benchmarks",
      "256K context length",
      "Lower latency, higher accuracy",
    ],
    buttonLabel: "View Paper",
  },
  rising: {
    label: "RISING FAST",
    metric: "+540",
    metricLabel: "GitHub stars\nin the last 8 hours",
    repos: [
      { rank: 1, name: "VoxCPM-1.5", stars: "+540" },
      { rank: 2, name: "DeepSeek-R1.1", stars: "+412" },
      { rank: 3, name: "LongRPE 2.0", stars: "+398" },
    ],
    viewAllLabel: "View all rising",
  },
  sota: {
    label: "NEW SOTA TODAY",
    viewAllLabel: "View all",
    entries: [
      {
        badge: "SOTA",
        title: "s1: Simple Test-Time Scaling",
        subtitle: "#1 on 8 benchmarks",
      },
      {
        badge: "SOTA",
        title: "LongRPE 2.0",
        subtitle: "#1 on 6 benchmarks",
      },
      {
        badge: "SOTA",
        title: "V-JEPA 2",
        subtitle: "#1 on 4 benchmarks",
      },
      {
        badge: "SOTA",
        title: "MuJoCo World Model Suite",
        subtitle: "#1 on 3 benchmarks",
      },
    ],
  },
  github: {
    label: "TRENDING ON GITHUB",
    repos: [
      { name: "microsoft/BitNet", stars: "+2.1k" },
      { name: "huggingface/transformers", stars: "+1.8k" },
      { name: "databricks/dolly", stars: "+1.6k" },
      { name: "vlm-project/vlm", stars: "+1.4k" },
      { name: "unslothai/unsloth", stars: "+1.2k" },
    ],
    viewAllLabel: "View all trending repos",
  },
};

export const filterTabs = ["Today", "This Week", "This Month", "All time"];

export const papers = [
  {
    id: 1,
    thumbnail: "/papers/glm5.2.jpg",
    title: "GLM-5.2: Built for Long-Horizon Tasks",
    authors: "Z.ai Team",
    date: "Jun 16, 2026",
    description:
      "GLM-5.2 is Z.ai's latest flagship open-weight model for long-horizon agentic engineering. The release extends GLM-5.1 with a solid 1M-token context, IndexShare sparse-attention efficiency, improved MTP speculative decoding, and flexible thinking-effort controls. Benchmarks report...",
    sota: "SOTA on AIME 2026, HMMT Feb 2026, PostTrainBench • #3 on FrontierSWE, NL2Repo",
    tags: ["Agents", "Coding Agents", "Language Modeling", "Math", "World Knowledge"],
    additionalTags: ["DeepSeek Sparse Attention", "MCP", "Mixture-of-Experts (MoE)", "Transformer"],
    upvotes: "11.2K",
    repo: "11.3K",
    citations: 30,
    conference: "",
  },
  {
    id: 2,
    thumbnail: "/papers/indexache.jpg",
    title: "IndexCache: Accelerating Sparse Attention via Cross-Layer Index Reuse",
    authors: "Yushi Bai, Qian Dong, Ting Jiang, +5 authors",
    date: "Mar 12, 2026",
    description:
      "Long-context agentic workflows have emerged as a defining use case for large language models, making attention efficiency critical for both inference speed and serving cost. Sparse attention addresses this challenge effectively, and DeepSeek Sparse Attention (DSA) is a representative...",
    sota: "SOTA on LongBench • #2 on RULER (128K)",
    tags: ["Language Modeling", "Long Context", "Efficiency"],
    additionalTags: ["Gated DeltaNet", "Key-value cache", "Kimi Delta Attention"],
    upvotes: "8.4K",
    repo: "8.5K",
    citations: 10,
    conference: "",
  },
  {
    id: 3,
    thumbnail: "/papers/darwin.jpg",
    title: "Darwin Family: MRI-Trust-Weighted Evolutionary Merging for Training-Free Scaling of Language-Model Reasoning",
    authors: "Taebong Kim, Youngik Hong, Minsk Kim, +4 authors",
    date: "May 14, 2026",
    description:
      "We present Darwin Family, a framework for training-free evolutionary merging of large language models via gradient-free weight-space recombination. We ask whether frontier-level reasoning performance can be improved without additional training, by reorganizing latent capabilities...",
    sota: "SOTA on Natural Questions • #3 on CommonsenseQA",
    tags: ["Language Modeling", "Reasoning", "Model Merging"],
    additionalTags: ["Mamba", "Post-training", "Transformer"],
    upvotes: "7.1K",
    repo: "7.2K",
    citations: 24,
    conference: "",
  },
  {
    id: 4,
    thumbnail: "/papers/unlimitedworks.jpg",
    title: "Unlimited OCR Works",
    authors: "Youyang Yin, Huanhuan Liu, YY, +14 authors",
    date: "Jun 22, 2026",
    description:
      "Recently, end-to-end OCR models, exemplified by DeepSeek OCR, have once again thrust OCR into the spotlight. A widely held view is that employing a large language model (LLM) as the decoder allows the model to leverage the prior distribution of language, leading to improved OCR performance. However, the downside is equally evident: as the output sequence...",
    sota: "#2 on OmniDocBench v1.6 • #3 on OmniDocBench v1.5",
    tags: ["Automatic Speech Recognition", "Language Modeling", "OCR"],
    additionalTags: ["Key-value cache", "Sliding window attention"],
    upvotes: "43.4K",
    repo: "44.3K",
    citations: 9,
    conference: "",
  },
  {
    id: 5,
    thumbnail: "/papers/paddlework.jpg",
    title: "PaddleOCR-VL-1.6: Expanding the Frontier of Document Parsing with Under-Optimized Region Refinement and Progressive Post-Training",
    authors: "Zelun Zhang, Hongen Liu, Suyin Liang, +12 authors",
    date: "Jun 2, 2026",
    description:
      "We introduce PaddleOCR-VL-1.6, an upgraded compact document parsing model built upon PaddleOCR-VL-1.5. Although PaddleOCR-VL-1.5 establishes a strong 0.9B baseline, its remaining errors concentrate in under-optimized regions where model behavior is unstable, data coverage is sparse, or supervision is unreliable. Rather than expanding the training corpus...",
    sota: "SOTA on OmniDocBench v1.6 • Real5-OmniDocBench",
    tags: ["Document Layout Analysis", "Image Understanding", "OCR", "Reinforcement Learning"],
    additionalTags: ["GRPO", "Post-training", "Qwen3", "RAG"],
    upvotes: "3.6K",
    repo: "3.6K",
    citations: 5,
    conference: "",
  },
];

export const rightSidebarData = {
  github: {
    title: "TRENDING ON GITHUB",
    items: [
      { name: "microsoft/BitNet", growth: "+2.1k" },
      { name: "huggingface/transformers", growth: "+1.8k" },
      { name: "databricks/dolly", growth: "+1.6k" },
      { name: "vlm-project/vlm", growth: "+1.4k" },
      { name: "unslothai/unsloth", growth: "+1.2k" },
    ],
    viewAllLabel: "View all trending repos",
  },
  twitter: {
    title: "TRENDING ON X",
    items: [
      { name: "x.com/levelsio", growth: "+2.1k" },
      { name: "x.com/EMostaque", growth: "+1.8k" },
      { name: "x.com/ai_for_success", growth: "+1.6k" },
      { name: "x.com/deewydas", growth: "+1.4k" },
      { name: "x.com/rowancheung", growth: "+1.2k" },
    ],
    viewAllLabel: "View all trending posts",
  },
  reddit: {
    title: "TRENDING ON REDDIT",
    items: [
      { name: "r/MachineLearning", growth: "+2.1k" },
      { name: "r/LocalLLaMA", growth: "+1.8k" },
      { name: "r/ArtificialIntelligence", growth: "+1.6k" },
      { name: "r/DeepLearning", growth: "+1.4k" },
      { name: "r/LLMDevs", growth: "+1.2k" },
    ],
    viewAllLabel: "View all trending discussions",
  },
};
