const assetsBaseUrl = process.env.NODE_ENV === 'development' ? 'https://digitalnorthsea.blob.core.windows.net' : 'https://assets.digitalnorthsea.com';
export async function fetchFact(token) {
    let url = assetsBaseUrl+`/data/homescreenfacts.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
