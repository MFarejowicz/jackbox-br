module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-webpack",
  ],
  alias: {
    "@components": "./src/components",
    "@pages": "./src/pages",
    "@app": "./src",
  },
  proxy: {
    "/api": "http://localhost:3000/api",
    "/socket.io": {
      target: "http://localhost:3000",
      ws: true,
    },
  },
};
