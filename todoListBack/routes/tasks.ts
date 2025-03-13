import express, { Request, RequestHandler, Response, Router } from "express";
import { ObjectId } from "mongodb";
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

  try {
    const updatedTask = await taskRepository.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...taskToUpdate } }
    );

    if (updatedTask.matchedCount === 0) {
      return res.status(404);
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500);
  } finally {
    await dataSource.destroy();
  }
}) as RequestHandler);

/* DELETE an existing task */
router.delete("/:id", (async (req: Request, res: Response) => {
  const { id } = req.params;
  const dataSource = createDataSource();
  await dataSource.initialize();
  const taskRepository = dataSource.getMongoRepository(Task);

  try {
    const deletedTask = await taskRepository.deleteOne({
      _id: new ObjectId(id),
    });
    if (deletedTask.deletedCount === 0) {
      return res.status(404);
    }
    res.status(200).json(deletedTask);
  } catch (error) {
    res.status(500);
  } finally {
    await dataSource.destroy();
  }
}) as RequestHandler);

export default router;
