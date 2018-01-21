import General from "../utility/General";
import _ from 'lodash';

var currentLogLevel;

class Logger {
    static LogLevel = {
        Error: 4,
        Warn: 3,
        Info: 2,
        Debug: 1,
        Trace: 0,
    };

    static setCurrentLogLevel(level) {
        currentLogLevel = level;
    }

    static getCurrentLogLevel() {
        return currentLogLevel;
    }

    static logDebug(source, message) {
        Logger.log(source, message, Logger.LogLevel.Debug);
    }

    static logInfo(source, message) {
        Logger.log(source, message, Logger.LogLevel.Info);
    }

    static logWarn(source, message) {
        Logger.log(source, message, Logger.LogLevel.Warn);
    }

    static logError(source, message) {
        Logger.log(source, message, Logger.LogLevel.Error);
    }

    static log(source, message, level) {
        if (level >= Logger.getCurrentLogLevel()) {
            console.log(`[${source}][${_.findKey(Logger.LogLevel, (value) => value === level)}] ${General.getMessage(message)}`);
        }
    }
}

export default Logger;