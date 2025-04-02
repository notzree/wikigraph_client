import { UnauthorizedError } from "./error";

const server_url = process.env.NEXT_PUBLIC_WIKIGRAPH_SERVER_URL;

export default async function FindPath(
  fromOffset: number,
  toOffset: number,
  password: string,
): Promise<string[]> {
  const find_path_url = server_url + "/search";
  try {
    const response = await fetch(find_path_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: password,
      },
      body: JSON.stringify({
        from: fromOffset,
        to: toOffset,
      }),
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
