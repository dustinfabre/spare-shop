export async function onRequest(context: { request: Request }): Promise<Response> {
  const url = new URL(context.request.url)
  const target = new URL('https://shop.euras.com/eed.php')
  target.search = url.search

  const response = await fetch(target.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SpareParts Shop)',
      'Accept': 'application/json',
    },
  })

  const body = await response.text()

  return new Response(body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
