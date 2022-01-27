import ILog from "./ILog";
import LogLevel from "./LogLevel";

export default class ConsoleLog implements ILog {
    level:LogLevel = LogLevel.Trace;

    trace(msg: string): void {
        this.write(LogLevel.Trace, msg);
    }

    debug(msg: string): void {
        this.write(LogLevel.Debug, msg);
    }

    info(msg: string): void {
        this.write(LogLevel.Info, msg);
    }

    warn(msg: string): void {
        this.write(LogLevel.Warn, msg);
    }

    error(msg: string): void {
        this.write(LogLevel.Error, msg);
    }

    private write(level: LogLevel, msg: string): void {
        
        if(level >= this.level) {
            const now = (new Date()).toISOString()
            console.log(`${now} [${LogLevel[level]}]: ${msg}`);
        }
    }
}