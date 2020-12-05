require("express-async-errors");
const winston = require("winston");
const { MESSAGE } = require("triple-beam");

module.exports = function () {
  winston.configure({
    transports: [
      new winston.transports.File({ filename: "logfile.log" }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: {
              error: "redBG yellow",
              warn: "yellow",
              info: "magenta",
            },
          }),
          winston.format((info, opts) => {
            const padding = (info.padding && info.padding[info.level]) || "";
            info[MESSAGE] = `${info.level}:${padding} ${info.message}`;
            return info;
          })()
        ),
        handleExceptions: true,
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({
        filename: "uncaughtExceptions.log",
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: "unhandledRejections.log",
      }),
    ],
  });
};
