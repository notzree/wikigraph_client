
const server_url = process.env.NEXT_PUBLIC_WIKIGRAPH_SERVER_URL;
export default async function FindPath(from: string, to: string): Promise<string[]> {
    const find_path_url = server_url + "/find_path?from_path=" + from + "&to_path=" + to;
    let result = await fetch(find_path_url,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return [];
}