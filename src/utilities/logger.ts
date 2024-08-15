import chalk from "chalk";
import { format } from "date-fns";

export function info(message: string, ...args: string[]): void {
  const startTime = Date.now();

  const startTimeText = `${chalk.gray(
    format(startTime, "dd/MM/yyyy hh:mm a")
  )}`;

  const loggerMessage = `${startTimeText} ${chalk.greenBright(
    "INFO"
  )} ${message}`;

  console.log(loggerMessage);
}

export function warning(message: string, ...args: string[]): void {
  const startTime = Date.now();

  const startTimeText = `${chalk.gray(
    format(startTime, "dd/MM/yyyy hh:mm a")
  )}`;

  const loggerMessage = `${startTimeText} ${chalk.yellowBright(
    "WARNING"
  )} ${message}`;

  console.log(loggerMessage);
}

export function error(message: string, ...args: string[]): void {
  const startTime = Date.now();

  const startTimeText = `${chalk.gray(
    format(startTime, "dd/MM/yyyy hh:mm a")
  )}`;

  const loggerMessage = `${startTimeText} ${chalk.red("ERROR")} ${message}`;

  console.log(loggerMessage);
}

export default {
  info,
  warning,
  error,
};
