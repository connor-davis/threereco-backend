import type { Context, Next } from "hono";

import chalk from "chalk";
import { format } from "date-fns";
import logger from "./logger";

export default async function requestMiddlewareLogger(
  context: Context,
  next: Next
) {
  const startTime = Date.now();
  const type = context.req.method;
  const path = context.req.path;

  await next();

  const endTime = Date.now();

  const typeText = `${chalk.magenta(type)}`;

  const pathText = `${chalk.white(path)}`;

  const finishedInText = `${chalk.gray("Finished in:")}`;

  const timeDifferenceText = `${chalk.magenta(`${endTime - startTime}ms`)}`;

  const statusText = `${chalk.gray("Status:")} ${chalk.magenta(
    context.res.status
  )}`;

  const loggerMessage = `${typeText} ${pathText} ${finishedInText} ${timeDifferenceText} ${statusText}`;

  logger.info(loggerMessage);
}
