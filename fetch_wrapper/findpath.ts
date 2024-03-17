
const server_url = process.env.NEXT_WIKIGRAPH_SERVER_URL;
export default async function FindPath(from: string, to: string): Promise<string[]> {
    let result = await fetch(server_url + "/find_path?from_path=" + from + "&to_path=" + to);
    return [];
}