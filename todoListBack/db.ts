import { DataSource } from "typeorm";
// in real project it's in .env
const MONGO_URI='mongodb://localhost:27017/todoList'
const PORT=5000
export const createDataSource = () => {
  return new DataSource({
    type: "mongodb",
    url: MONGO_URI,
    database: "todoList",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: ["entities/*.ts"],
    synchronize: true,
  });
};
