const router = require("express").Router();

router.get("/test", (req, res) => {
  res.send({ msg: "pong" });
});

// api catch
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
