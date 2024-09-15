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
  const query = Object.keys(context.req.query())
    .map((key) => `${key}=${context.req.query()[key]}`)
    .join("&");

  await next();

  const endTime = Date.now();

  const typeText = `${chalk.blueBright(type)}`;

  const pathText = `${chalk.white(path)}`;
  const queryText = `${chalk.white(query)}`;

  const finishedInText = `${chalk.gray("Finished in:")}`;

  const timeDifferenceText = `${chalk.blueBright(`${endTime - startTime}ms`)}`;

  const statusText = `${chalk.gray("Status:")} ${chalk.blueBright(
    context.res.status
  )}`;

  const loggerMessage = `${typeText} ${pathText}${
    queryText.length > 0 ? `?${queryText}` : ""
  } ${finishedInText} ${timeDifferenceText} ${statusText}`;

  logger.info(loggerMessage);
}
