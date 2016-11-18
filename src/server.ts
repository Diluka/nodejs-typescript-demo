import { app, initDatabase } from "./";

const env = process.env["NODE_ENV"] || "development";

(async () => {
    if (env === "development") {
        await initDatabase();
    } else if (env === "test") {

    }
    app.listen(2333, () => {
        console.log("started");
    });
})();

export var server = app;