import LogLevel from "./LogLevel";

export default interface ILog {
    level: LogLevel;

    trace(msg: string): void
    debug(msg: string): void;
    info(msg: string): void;
    warn(msg: string): void;
    error(msg:string): void;
}