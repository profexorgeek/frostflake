enum Level {
    Debug,
    Info,
    Warn,
    Error
}

function write(level: Level, msg: string) {
    let levelName = Object.keys(Level).filter(x => Level[x] == level);
    let now = (new Date()).toISOString()
    console.log(`${now} [${levelName}]: ${msg}`);
}

export default {
    debug(msg: string) {
        write(Level.Debug, msg);
    },
    info(msg: string) {
        write(Level.Info, msg);
    },
    warn(msg: string) {
        write(Level.Warn, msg);
    },
    error(msg: string) {
        write(Level.Error, msg);
    }
}