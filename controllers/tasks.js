const tasksRouter = require("express").Router();
const Task = require("../models/task");
const uniqid = require("uniqid");

tasksRouter.get("/", (request, response) => {
  Task.find({}).then((tasks) => {
    response.json(tasks);
  });
});

tasksRouter.get("/:id", (request, response, next) => {
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

tasksRouter.delete("/:id", (request, response) => {
  Task.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

tasksRouter.post("/", (request, response) => {
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

tasksRouter.put("/:id", (request, response, next) => {
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

module.exports = tasksRouter;
