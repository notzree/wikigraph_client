
const server_url = process.env.NEXT_PUBLIC_WIKIGRAPH_SERVER_URL;
export default async function Complete(prefix: string): Promise<string[]> {
    const complete_url = server_url + "/complete?prefix=" + prefix;
    let result = await fetch(complete_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(result);
    return result.json();
}