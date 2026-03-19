export default function handler(req, res) {
  // Fallback to existing Client ID if env var isn't loaded
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Ov23li1tnqqcEKiyBD6g';
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,user`;
  
  res.redirect(302, url);
}
