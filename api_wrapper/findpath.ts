import { UnauthorizedError } from "./error";

const server_url = process.env.NEXT_PUBLIC_WIKIGRAPH_SERVER_URL;

// Define types based on the Go API
export interface FindPathParams {
  from_offset: number;
  from_title: string;
  to_offset: number;
  to_title: string;
}

export interface FindPathResponse {
  path: string[];
  entry_id: string | null;
}

export async function FindPath(
  params: FindPathParams,
  password: string,
): Promise<FindPathResponse> {
  const find_path_url = server_url + "/search";
  try {
    const response = await fetch(find_path_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: password,
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      // Check specifically for 401 Unauthorized
      if (response.status === 401) {
        throw new UnauthorizedError();
      }
      throw new Error(`Failed to find path: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error finding path:", error);
    throw error;
  }
}
