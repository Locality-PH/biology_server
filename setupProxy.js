const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/.netlify/functions/api/",
    createProxyMiddleware({
      target: "https://xenodochial-gates-876873.netlify.app",
      changeOrigin: true,
    })
  );
};
