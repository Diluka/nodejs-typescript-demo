import "./passport";
import "./template";
import * as express from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { configPassport } from "./passport";

export var app: express.Application = express();

app.set("views", [__dirname + "/../res/views"]);
app.set("view engine", "hbs");


app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("body-parser").json());
app.use(require("express-session")({ secret: "keyboard cat", resave: false, saveUninitialized: false }));
app.use(require("connect-flash")());

// 加载passport
configPassport(app);


useContainer(Container);
useExpressServer(app, {
    controllers: [__dirname + "/controllers/**/*.controller.js"]
});