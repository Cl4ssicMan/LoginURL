// Vercel Node serverless function: handles growtopia endpoints
module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, `https://${req.headers.host || 'example.com'}`)
    const pathname = url.pathname

    // Config via env (set in Vercel dashboard)
    const LOGIN_HOST = process.env.LOGIN_HOST || (req.headers.host || 'login.example.com')
    const LOGIN_PORT = process.env.LOGIN_PORT || '443'
    const GAME_HOST = process.env.GAME_HOST || '127.0.0.1'
    const GAME_PORT = process.env.GAME_PORT || '17091'

    if (pathname === '/growtopia/server_data.php') {
      const lines = [
        `server|${GAME_HOST}`,
        `port|${GAME_PORT}`,
        `loginurl|${LOGIN_HOST}${LOGIN_PORT && LOGIN_PORT !== '443' ? `:${LOGIN_PORT}` : ''}`,
        `type|1`,
        `type2|1`,
        `#maint|test`,
        `meta|ignoremeta`,
        `RTENDMARKERBS1001`,
      ]
      const body = lines.join('\n')
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end(body)
      return
    }

    if (pathname === '/player/login/validate' && req.method === 'POST') {
      const chunks = []
      for await (const chunk of req) chunks.push(chunk)
      const raw = Buffer.concat(chunks).toString('utf8')
      // Parse application/x-www-form-urlencoded
      const data = new URLSearchParams(raw)
      const growID = data.get('growID')
      const password = data.get('password')

      const payload = {
        status: 'success',
        message: 'Account Validated.',
        token: 'demo-token',
        url: '',
        accountType: 'growtopia',
        growID,
      }

      res.statusCode = 200
      // Client expects HTML string containing JSON
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(JSON.stringify(payload))
      return
    }

    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Not found')
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Internal server error')
  }
}
