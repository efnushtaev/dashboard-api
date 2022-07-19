import express from "express";

const port = 8000;

const app = express();

app.get("/hello", (req, res) => {
  res.send("Hi!");
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
