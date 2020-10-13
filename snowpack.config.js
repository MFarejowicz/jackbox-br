module.exports = {
  mount: {
    public: "/",
    src: "/_dist_",
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-dotenv"],
  proxy: {
    "/api": "http://localhost:3000/api",
    "/socket.io": {
      target: "http://localhost:3000",
      ws: true,
    },
  },
};
