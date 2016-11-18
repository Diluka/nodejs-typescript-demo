import "reflect-metadata";
import "./database";
import { User } from "./models/user";

export function initDatabase() {
  return Promise.all([
    User.sync({ force: true })
  ]).then(() =>
    Promise.all([
      User.bulkCreate([
        { username: "diluka", password: "pass", nickname: "DiX", email: "demo@example.com" }
      ])
    ]));
}

export { app } from "./app";