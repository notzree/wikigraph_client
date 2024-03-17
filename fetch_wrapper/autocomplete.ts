
const server_url = process.env.NEXT_WIKIGRAPH_SERVER_URL;
export default async function Complete(prefix: string): Promise<string[]> {
    let result = await fetch(server_url + "/complete?prefix=" + prefix);

    return []
}