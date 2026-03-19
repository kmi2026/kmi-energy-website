export default async (req, context) => {
  // If user didn't set ID, fallback to the one provided earlier via chat
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23li1tnqqcEKiyBD6g';
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo`;
  
  return new Response(null, {
    status: 302,
    headers: { 'Location': url }
  });
};
