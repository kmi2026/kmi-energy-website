export default async (req, context) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23li1tnqqcEKiyBD6g';
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_SECRET) {
    return new Response("Security Error: Missing GITHUB_CLIENT_SECRET in Netlify Environment Variables.", { status: 500 });
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });

  const data = await response.json();
  const token = data.access_token;

  const scriptMessage = token
    ? `authorization:github:success:{"token":"${token}","provider":"github"}`
    : `authorization:github:error:{"message":"${data.error_description || 'Unknown err'}"}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Authenticating...</title>
    </head>
    <body>
      <p>Authorization complete, returning to CMS...</p>
      <script>
        window.opener.postMessage(
          '${scriptMessage}',
          '*'
        );
        window.close();
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};
