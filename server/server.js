const path = require("path");
const http = require("http");
const express = require("express");

const app = express();

const reactPath = path.resolve(__dirname, "..", "build");

app.use(express.static(reactPath));
app.use(express.json());

const api = require("./api");
app.use("/api", api);

// general catch
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

// any server errors cause this function to run
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }

  res.status(status);
  res.send({
    status: status,
    message: err.message,
  });
});

const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log(`socket has connected ${socket.id}`);

  socket.on("create", () => {
    console.log("test");
  });

  socket.on("disconnect", () => {
    console.log(`socket has disconnected ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
