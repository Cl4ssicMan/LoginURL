const { Hono } = require('hono');
const { logger } = require('hono/logger');
const { serveStatic } = require('@hono/node-server/serve-static');
const { serve } = require('@hono/node-server');
const { createServer } = require('https');
const { readFileSync } = require('fs');
const { join } = require('path');

const HTTPS_PORT = Number(process.env.HTTPS_PORT || 8443);
const LOGIN_PORT = Number(process.env.LOGIN_PORT || 8080);
const LOGIN_HOST = process.env.LOGIN_HOST || 'login.growserver.app';
const GAME_HOST = process.env.GAME_HOST || '127.0.0.1';
const GAME_PORT = Number(process.env.GAME_PORT || 17091);

async function main() {
  const app = new Hono();

  app.use(logger((str, ...rest) => console.log(str, ...rest)));

  // Serve cache files if any are placed in LoginURL/cache
  app.use('/growtopia/cache', serveStatic({ root: 'cache' }));

  // Health/root
  app.get('/', (c) => c.json({ ok: true }));

  // Game server data endpoint
  app.all('/growtopia/server_data.php', (c) => {
    let str = '';
    str += `server|${GAME_HOST}\n`;
    str += `port|${GAME_PORT}\n`;
    str += `loginurl|${LOGIN_HOST}:${LOGIN_PORT}\n`;
    str += `type|1\n`;
    str += `type2|1\n`;
    str += `#maint|test\n`;
    str += `meta|ignoremeta\n`;
    str += `RTENDMARKERBS1001`;
    return c.body(str);
  });

  // Login API used by website/login.html
  app.post('/player/login/validate', async (c) => {
    const formData = await c.req.formData();
    const growID = formData.get('growID');
    const password = formData.get('password');
    // TODO: plug in real validation if desired
    return c.html(JSON.stringify({
      status: 'success',
      message: 'Account Validated.',
      token: 'demo-token',
      url: '',
      accountType: 'growtopia',
      growID,
    }));
  });

  // Serve the login dashboard page
  app.use('/player/login/dashboard', (c) => {
    const html = readFileSync(join(__dirname, 'website', 'login.html'), 'utf-8');
    return c.html(html);
  });

  // HTTPS (dev) listener
  serve(
    {
      fetch: app.fetch,
      port: HTTPS_PORT,
      createServer,
      serverOptions: {
        key: readFileSync(join(__dirname, 'ssl', 'server.key')),
        cert: readFileSync(join(__dirname, 'ssl', 'server.crt')),
      },
    },
    () => console.log(`⛅ HTTPS server on https://localhost:${HTTPS_PORT}`)
  );

  // Login listener (domain-specific cert)
  serve(
    {
      fetch: app.fetch,
      port: LOGIN_PORT,
      createServer,
      serverOptions: {
        key: readFileSync(join(__dirname, 'ssl', '_wildcard.growserver.app-key.pem')),
        cert: readFileSync(join(__dirname, 'ssl', '_wildcard.growserver.app.pem')),
      },
    },
    () => console.log(`⛅ Login server on https://${LOGIN_HOST}:${LOGIN_PORT}`)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
