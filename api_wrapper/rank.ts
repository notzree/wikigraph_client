import { UnauthorizedError } from "./error";

const server_url = process.env.NEXT_PUBLIC_WIKIGRAPH_SERVER_URL;

// Define types based on the Go API
export interface ClaimEntryParams {
  entry_id: string;
  name: string;
}

export interface ClaimEntryResponse {
  claimed: boolean;
}

/**
 * Claims a ranked entry with the provided entry ID and name
 *
 * @param params The parameters for claiming an entry
 * @param password The authorization password for the API
 * @returns A response indicating whether the entry was successfully claimed
 */
export async function ClaimEntry(
  params: ClaimEntryParams,
  password: string,
): Promise<ClaimEntryResponse> {
  const claim_entry_url = server_url + "/claim";
  try {
    const response = await fetch(claim_entry_url, {
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
      throw new Error(`Failed to claim entry: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error claiming entry:", error);
    throw error;
  }
}
