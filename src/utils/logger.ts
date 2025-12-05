import EventEmitter from "events";

export class Logger extends EventEmitter {
  log(msg: string) {
    this.emit("message", `[LOG]: ${msg} | ${new Date().toDateString()}`);
  }
}
