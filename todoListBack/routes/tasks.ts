import express, { Request, RequestHandler, Response, Router } from "express";
import { ObjectId, UpdateResult, Document } from "mongodb";
import { createDataSource } from "../db";
import { Task } from "../entities/task.entity";
import { isError } from "util";

const router: Router = express.Router();

/* GET all tasks listing */
router.get("/", async (_req: Request, res: Response) => {
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);
  let tasks: Document[] = [];
  let isError = false;
  try {
    tasks = await taskRepository.find({ order: { status: "DESC" } });
  } catch (error) {
    isError = true;
  } finally {
    await dataSource.destroy();
  }
  const status = isError ? 500 : 200;
  res.status(status).json(tasks);
});

/* POST a new task */
router.post("/", async (req: Request, res: Response) => {
  const taskToInsert = req.body;
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);
  let insertTask: Document | null = null;
  let isError = false;
  try {
    insertTask = await taskRepository.insertOne(taskToInsert);
  } catch (error) {
    isError = true;
  } finally {
    await dataSource.destroy();
  }
  const status = isError ? 500 : 200;
  res.status(status).json(insertTask);
});

/* PATCH an existing task */
router.patch("/", (async (req: Request, res: Response) => {
  const { id, ...taskToUpdate } = req.body;
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);
  let updatedTask: Document | UpdateResult | null = null;
  let isError = false;
  try {
    updatedTask = await taskRepository.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...taskToUpdate } }
    );
  } catch (error) {
    isError = true;
  } finally {
    await dataSource.destroy();
  }
  const status = isError ? 500 : updatedTask?.matchedCount === 0 ? 404 : 200;

  res.status(status).json(updatedTask);
}) as RequestHandler);

/* DELETE an existing task */
router.delete("/:id", (async (req: Request, res: Response) => {
  const { id } = req.params;
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);
  let deletedTask: Document | null = null;
  let isError = false;
  try {
    deletedTask = await taskRepository.deleteOne({
      _id: new ObjectId(id),
    });
  } catch (error) {
    isError = true;
  } finally {
    await dataSource.destroy();
  }
  const status = isError ? 500 : deletedTask?.deletedCount === 0 ? 404 : 200;

  res.status(status).json(deletedTask);
}) as RequestHandler);

export default router;
