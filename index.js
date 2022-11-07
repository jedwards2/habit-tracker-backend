require("dotenv").config();
const express = require("express");
const uniqid = require("uniqid");
const cors = require("cors");
const app = express();
const Task = require("./models/task");

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

app.get("/api/tasks/:id", (request, response, next) => {
  Task.findById(request.params.id)
    .then((task) => {
      if (task) {
        response.json(task);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/api/tasks", (request, response) => {
  Task.find({}).then((tasks) => {
    response.json(tasks);
  });
});

app.get("/", (request, response) => {
  response.send("<h1>Go to /api/tasks</h1>");
});

app.delete("/api/tasks/:id", (request, response) => {
  Task.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/tasks", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const task = new Task({
    content: body.content,
    streak_start: new Date(),
    updated_last: "1970",
    id: uniqid(),
  });

  task.save().then((savedTask) => {
    response.json(savedTask);
  });
});

app.put("/api/tasks/:id", (request, response, next) => {
  const body = request.body;

  const task = {
    content: body.content,
    streak_start: body.streak_start,
    updated_last: body.updated_last,
    id: body.id,
  };

  Task.findByIdAndUpdate(request.params.id, task, { new: true })
    .then((updatedTask) => {
      response.json(updatedTask);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
