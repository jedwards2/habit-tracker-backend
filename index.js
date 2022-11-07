const express = require("express");
const app = express();
const uniqid = require("uniqid");
const cors = require("cors");

let tasks = [
  {
    streak_start: new Date("2022-10-3"),
    updated_last: new Date("1970"),
    content: "Take out yimmy",
    id: "fbvykxcxala6st8v5",
  },
  {
    streak_start: new Date("2022-11-3"),
    updated_last: new Date("2022-11-3"),
    content: "CloFucknk",
    id: "fbvykxcxfia6st8v4",
  },
];

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

app.get("/api/tasks/:id", (request, response) => {
  const id = request.params.id;
  const task = tasks.find((task) => task.id === id);
  if (task) {
    response.json(task);
  } else {
    response.status(404).end();
  }
});

app.get("/api/tasks", (request, response) => {
  response.json(tasks);
});

app.get("/", (request, response) => {
  response.send("<h1>Go to /api/tasks</h1>");
});

app.delete("/api/tasks/:id", (request, response) => {
  const id = request.params.id;
  tasks = tasks.filter((task) => task.id !== id);

  response.status(204).end();
});

app.post("/api/tasks", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const task = {
    content: body.content,
    streak_start: new Date(),
    updated_last: "1970",
    id: uniqid(),
  };
  tasks = tasks.concat(task);

  response.json(task);
});

app.put("/api/tasks/:id", (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const task = {
    content: body.content,
    streak_start: body.streak_start,
    updated_last: body.updated_last,
    id: body.id,
  };

  tasks = tasks.filter((task) => task.id !== id);
  tasks = tasks.concat(task);
  response.json(task);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
