import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";
import { Status } from "../types/task.type";

@Entity()
export class Task {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ default: "todo" })
  status: Status = "todo";
}
