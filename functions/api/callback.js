export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  const clientId = context.env.GITHUB_CLIENT_ID;
  const clientSecret = context.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      "Security Error: Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in Cloudflare Pages environment variables.",
      { status: 500 }
    );
  }

  if (!code) {
    return new Response("GitHub Auth Failed: missing OAuth code.", { status: 400 });
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const data = await response.json();
    const token = data.access_token;

    if (!token) {
      return new Response(
        `<h1>GitHub Auth Failed</h1><p>GitHub refused to give a token. Error:</p><pre>${escapeHtml(
          JSON.stringify(data, null, 2)
        )}</pre>`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8"
          }
        }
      );
    }

    const scriptMessage = `authorization:github:success:${JSON.stringify({
      token,
      provider: "github"
    })}`;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Authenticating...</title>
  </head>
  <body>
    <p>Authorization complete, returning to CMS...</p>
    <script>
      window.opener.postMessage(${JSON.stringify(scriptMessage)}, "*");
      setTimeout(() => window.close(), 100);
    </script>
  </body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  } catch (error) {
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
