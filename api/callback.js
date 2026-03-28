export default async function handler(req, res) {
  const code = req.query.code;

  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return res.status(500).send("Security Error: Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in Vercel Environment Variables.");
  }

  try {
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

    // Do not close the window if token is missing so the user can literally see the github error!
    if (!token) {
      const errObj = JSON.stringify(data, null, 2);
      return res.status(200).send(`<h1>GitHub Auth Failed</h1><p>GitHub refused to give a token. Error:</p><pre>${errObj}</pre>`);
    }

    const scriptMessage = `authorization:github:success:{"token":"${token}","provider":"github"}`;

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
          // Wait 100ms before close
          setTimeout(() => window.close(), 100);
        </script>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
}
