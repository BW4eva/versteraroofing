const { checkConnection } = require('../_lib/nexoflow');

module.exports = async (req, res) => {
  const { configured, connected } = await checkConnection();
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: connected, provider: 'nexoflow', connected, configured }));
};
