import { Container } from "typedi";
import { Sequelize } from "sequelize";

const env = process.env["NODE_ENV"] || "development";
const config = require(__dirname + "/../config/config.json")[env];

console.log(config);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

Container.set(Sequelize, sequelize);

export var db: Sequelize = sequelize;