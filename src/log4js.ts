import { Logger, getLogger, levels, Level } from "log4js";
import { isMaster, worker } from "cluster";
import * as _ from "lodash";

const DEFAULT_LEVEL = levels.toLevel(process.env["DEBUG_LEVEL"] || "debug");
const PREFIX = isMaster ? `[master] ` : `[worker ${worker.id} (${worker.process.pid})] `;

export function getMyLogger(categoryName?: string, level: Level | string = DEFAULT_LEVEL): Logger {
    if (_.isString(level)) level = levels.toLevel(level);

    let logger = getLogger(categoryName);
    logger.setLevel(level);

    _.each(["trace", "debug", "info", "warn", "error", "fatal"], lv => {
        let temp = _.bind(logger[lv], logger);
        logger[lv] = (msg, ...args) => temp(PREFIX + msg, args);
    });

    return logger;
}