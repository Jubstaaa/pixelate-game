export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) return new Response('Missing url', { status: 400 })

    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    return new Response(buffer, {
        headers: {
            'Content-Type': response.headers.get('Content-Type') || 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
        },
    })
}
