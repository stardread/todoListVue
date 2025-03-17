import express, { Request, RequestHandler, Response, Router } from "express";
import { ObjectId, UpdateResult, Document } from "mongodb";
import { createDataSource } from "../db";
import { Task } from "../entities/task.entity";

const router: Router = express.Router();

/* GET all tasks listing */
router.get("/", async (_req: Request, res: Response) => {
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);

  try {
    const tasks = await taskRepository.find({ order: { status: "DESC" } });
    res.json(tasks);
  } catch (error) {
    res.status(500);
  } finally {
    await dataSource.destroy();
  }
});

/* POST a new task */
router.post("/", async (req: Request, res: Response) => {
  const taskToInsert = req.body;
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);

  try {
    const insertTask = await taskRepository.insertOne(taskToInsert);
    res.status(200).json(insertTask);
  } catch (error) {
    res.status(500);
  } finally {
    await dataSource.destroy();
  }
});

/* PATCH an existing task */
router.patch("/", (async (req: Request, res: Response) => {
  const { id, ...taskToUpdate } = req.body;
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);
  let updatedTask: Document | UpdateResult | null = null;
  try {
    updatedTask = await taskRepository.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...taskToUpdate } }
    );
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    await dataSource.destroy();
  }

  res.status(updatedTask?.matchedCount === 0 ? 404 : 200).json(updatedTask);
}) as RequestHandler);

/* DELETE an existing task */
router.delete("/:id", (async (req: Request, res: Response) => {
  const { id } = req.params;
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);
  let deletedTask: Document | null = null;
  try {
    deletedTask = await taskRepository.deleteOne({
      _id: new ObjectId(id),
    });
  } catch (error) {
    res.status(500);
  } finally {
    await dataSource.destroy();
  }
  res.status(deletedTask?.deletedCount === 0 ? 404 : 200).json(deletedTask);
}) as RequestHandler);

export default router;
