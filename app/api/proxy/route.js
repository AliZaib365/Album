// This API route will fetch the file from the remote server and forward it to your client
export async function GET(request) {
    // Get 'url' from query parameters
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
  
    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing URL parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      // Fetch the remote file
      const response = await fetch(url);
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch remote file' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      const fileBuffer = await response.arrayBuffer();
  
      // Optionally, set a default file name or extract it from the URL
      const fileName = 'downloaded_file.mp4';
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
  
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }