import request from "supertest";
import express from "express";
import router from "../routes/tasks";
import { createDataSource, mockRepository } from "./__mocks__/typeORM.mock";


jest.mock("../db", () => ({
    createDataSource: require("./__mocks__/typeORM.mock").createDataSource,
  }));

const app = express();
app.use(express.json());
app.use("/tasks", router);

describe("Tasks API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get all tasks", async () => {
    const tasks = [
      { _id: "67d0783e4a2d109c6ce51f75", title: "Another Task", description: "another description", status: "inProgress" },
      { _id: "67d0783e4a2d109c6ce51j98", title: "Third Task", description: "third description", status: "done" },
      { _id: "67d0783e4a2d109c6ce51s21", title: "Fourth Task", description: "fourth description", status: "todo" }
    ];
    mockRepository.find.mockResolvedValue(tasks);
    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(tasks);
  });

  it("should create a new task", async () => {
    mockRepository.insertOne.mockResolvedValue({ insertedId: "67d0783e4a2d109c6ce51f75" });
    const newTask = { title: "New Task", status: "todo" };
    const res = await request(app).post("/tasks").send(newTask);
    expect(res.status).toBe(200);
    expect(res.body.insertedId).toEqual("67d0783e4a2d109c6ce51f75");
  });

  it("should update an existing task", async () => {
    mockRepository.updateOne.mockResolvedValue({
      modifiedCount: 1,
      matchedCount: 1,
    });
    const res = await request(app)
      .patch("/tasks")
      .send({ id: "67d0783e4a2d109c6ce51f75", status: "inProgress" });
    expect(res.status).toBe(200);
  });

  it("should delete a task", async () => {
    mockRepository.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = await request(app).delete("/tasks/67d0783e4a2d109c6ce51f75");
    expect(res.status).toBe(200);
  });

  it("should return 404 if task to update is not found", async () => {
    mockRepository.updateOne.mockResolvedValue({
      modifiedCount: 0,
      matchedCount: 0,
    });
    const res = await request(app)
      .patch("/tasks")
      .send({ id: "67d0783e4a2d109c6ce51f75", status: "done" });
    expect(res.status).toBe(404);
  });

  it("should return 404 if task to delete is not found", async () => {
    mockRepository.deleteOne.mockResolvedValue({ deletedCount: 0 });
    const res = await request(app).delete("/tasks/67d0783e4a2d109c6ce51f75");
    expect(res.status).toBe(404);
  });
});
