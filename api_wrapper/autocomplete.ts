const server_url = process.env.NEXT_PUBLIC_WIKIGRAPH_SERVER_URL;
import { UnauthorizedError } from "./error";
export interface CompletionResult {
  Title: string;
  Offset: number;
}

export default async function Complete(
  searchTerm: string,
  password: string,
): Promise<CompletionResult[]> {
  try {
    const complete_url = server_url + "/complete";
    let result = await fetch(complete_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: password,
      },
      body: JSON.stringify({
        search_term: searchTerm,
      }),
    });

    if (!result.ok) {
      // Check specifically for 401 Unauthorized
      if (result.status === 401) {
        throw new UnauthorizedError();
      }
      throw new Error(`Failed to fetch completions: ${result.status}`);
    }

    return result.json();
  } catch (error) {
    console.error("Error completing path: ", error);
    throw error;
  }
}
