class Log {
    #level;

    #levels = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

    #reverseLevels = {
        0: "debug",
        1: "info",
        2: "warn",
        3: "error"
    };

    constructor(level = "debug") {
        this.setLevel(level);
    }

    setLevel(level) {
        if(level in this.#levels) {
            this.#level = level;
        }
        else {
            throw `${level} is not a valid debug level`;
        }
    }

    debug(msg) {
        this.write(this.#levels.debug, msg);
    }

    info(msg) {
        this.write(this.#levels.info, msg);
    }

    warn(msg) {
        this.write(this.#levels.warn, msg);
    }

    error(msg) {
        this.write(this.#levels.error, msg);
    }

    write(level, msg) {
        if(this.#levels[this.#level] < level) {
            let levelName = this.#reverseLevels[level];
            console.log(`${levelName}: ${msg}`);
        }
    }
}