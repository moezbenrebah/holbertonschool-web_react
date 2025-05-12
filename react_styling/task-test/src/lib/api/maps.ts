export async function getmapLoacation(address: string): Promise<Response> {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
      );
    return  response;
}