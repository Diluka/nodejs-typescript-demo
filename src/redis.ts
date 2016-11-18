import * as _redis from "redis";
import * as bluebird from "bluebird";
import { getMyLogger } from "./log4js";

bluebird.promisifyAll(_redis.RedisClient.prototype);
bluebird.promisifyAll(_redis.Multi.prototype);

const logger = getMyLogger("redis.ts");

let sharedClient: redis.RedisClient = null;

export enum RedisDatabase {
    DEFAULT = 0,
    USER_TOKEN = 1
};

const redisOptions: any = {
    retry_strategy: (op): any => {
        if (op.error.code === "ECONNREFUSED") {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error("The server refused the connection");
        }

        if (op.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error("Retry time exhausted");
        }
        if (op.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(op.attempt * 100, 3000);
    },
    db: RedisDatabase.DEFAULT
};

export function createLocalRedisClient(): redis.RedisClient {
    let client: any = _redis.createClient(redisOptions);
    client.on("error", (e) => {
        logger.warn("Redis发生错误: " + e);
    });

    return <redis.RedisClient>client;
}

export function getLocalRedisClient(): redis.RedisClient {
    if (!sharedClient || !sharedClient.connected) {
        sharedClient = createLocalRedisClient();
        sharedClient.on("end", () => {
            sharedClient = null;
        });
    }

    return sharedClient;
}