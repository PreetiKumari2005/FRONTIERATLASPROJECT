// Assuming mock schema interface array logic matching your current storage system
export interface ILeaderboardRecord {
  rank: number;
  modelName: string;
  creator: string;
  eloScore: number;
  confidenceInterval: string;
  votes: number;
  license: 'Open Source' | 'Proprietary';
  category: 'text' | 'coding' | 'vision' | 'agent';
}

// Internal sample state array inside your service layer
const realLeaderboardDbData: ILeaderboardRecord[] = [
  // === TEXT ARENA RANKINGS (Expanded to 13 items to exceed the 10-cutoff limit) ===
  { rank: 1, modelName: "Claude Fable 5", creator: "Anthropic", eloScore: 1508, confidenceInterval: "±9", votes: 4297, license: "Proprietary", category: "text" },
  { rank: 2, modelName: "Claude Opus 4.6 (Thinking)", creator: "Anthropic", eloScore: 1504, confidenceInterval: "±4", votes: 46410, license: "Proprietary", category: "text" },
  { rank: 3, modelName: "Claude Opus 4.7 (Thinking)", creator: "Anthropic", eloScore: 1502, confidenceInterval: "±5", votes: 32629, license: "Proprietary", category: "text" },
  { rank: 4, modelName: "Claude Opus 4.6", creator: "Anthropic", eloScore: 1499, confidenceInterval: "±4", votes: 49596, license: "Proprietary", category: "text" },
  { rank: 5, modelName: "Claude Opus 4.7", creator: "Anthropic", eloScore: 1493, confidenceInterval: "±5", votes: 33793, license: "Proprietary", category: "text" },
  { rank: 6, modelName: "Muse-Spark", creator: "Meta", eloScore: 1487, confidenceInterval: "±6", votes: 13607, license: "Proprietary", category: "text" },
  { rank: 7, modelName: "Gemini 3.1 Pro Preview", creator: "Google", eloScore: 1486, confidenceInterval: "±4", votes: 60640, license: "Proprietary", category: "text" },
  { rank: 8, modelName: "Gemini 3 Pro", creator: "Google", eloScore: 1486, confidenceInterval: "±4", votes: 41314, license: "Proprietary", category: "text" },
  { rank: 9, modelName: "GPT-5.5 High", creator: "OpenAI", eloScore: 1481, confidenceInterval: "±5", votes: 28268, license: "Proprietary", category: "text" },
  { rank: 10, modelName: "GLM 5.2 (Max)", creator: "Z.ai", eloScore: 1471, confidenceInterval: "±10", votes: 3357, license: "Open Source", category: "text" },
  { rank: 11, modelName: "Llama 4 70B", creator: "Meta", eloScore: 1420, confidenceInterval: "±6", votes: 22400, license: "Open Source", category: "text" },
  { rank: 12, modelName: "GPT-5.0 Mini", creator: "OpenAI", eloScore: 1395, confidenceInterval: "±4", votes: 19800, license: "Proprietary", category: "text" },
  { rank: 13, modelName: "Mistral Large 3", creator: "Mistral", eloScore: 1380, confidenceInterval: "±7", votes: 15400, license: "Proprietary", category: "text" },

  // === CODING RANKINGS ===
  { rank: 1, modelName: "GPT-5.6 Sol (xHigh)", creator: "OpenAI", eloScore: 1631, confidenceInterval: "±17", votes: 8430, license: "Proprietary", category: "coding" },
  { rank: 2, modelName: "Claude Fable 5", creator: "Anthropic", eloScore: 1630, confidenceInterval: "±14", votes: 12540, license: "Proprietary", category: "coding" },
  { rank: 3, modelName: "GLM 5.2 (Max)", creator: "Z.ai", eloScore: 1581, confidenceInterval: "±10", votes: 3357, license: "Open Source", category: "coding" }
];

export const LeaderboardService = {
  async queryStandings(category?: string, license?: string): Promise<ILeaderboardRecord[]> {
    // FIX: Swapped out sampleLeaderboardDbData for the correct name below
    let datasets = [...realLeaderboardDbData];

    if (category) {
      datasets = datasets.filter(row => row.category === category);
    }
    
    if (license && license !== 'All') {
      datasets = datasets.filter(row => row.license === license);
    }

    // Sort descending by ELO matrix order
    return datasets.sort((a, b) => b.eloScore - a.eloScore);
  }
};