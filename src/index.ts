import "reflect-metadata";
import "./database";
import { User } from "./models/user";

const env = process.env["NODE_ENV"] || "development";

function init() {
  Promise.all([
    User.sync({ force: true })
  ]).then(() =>
    Promise.all([
      User.bulkCreate([
        { username: "diluka", password: "pass", nickname: "DiX", email: "demo@example.com" }
      ])
    ]));
}

if (env === "development") {
  init();
}


export { app } from "./app";