const server_url = process.env.NEXT_PUBLIC_WIKIGRAPH_SERVER_URL;

export interface LeaderboardEntry {
  id: string;
  fromTitle: string;
  toTitle: string;
  fromOffset: number;
  toOffset: number;
  date: string;
  length: number;
  name: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
}

export default async function GetLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const leaderboard_url = server_url + "/leaderboard";
    let result = await fetch(leaderboard_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!result.ok) {
      throw new Error(`Failed to fetch leaderboard: ${result.status}`);
    }

    return result.json();
  } catch (error) {
    console.error("Error fetching leaderboard: ", error);
    throw error;
  }
}
