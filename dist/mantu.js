"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const cli_1 = __importDefault(require("./cli"));
const help_1 = __importDefault(require("./cmd/help"));
const version_1 = __importDefault(require("./cmd/version"));
const online_1 = __importDefault(require("./online"));
const database_1 = require("./database/database");
const discord_1 = require("./discord/discord");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = yield cli_1.default();
        logger_1.default.verbose(`Arguments: ${JSON.stringify(args)}`);
        if (args.help) {
            console.log(help_1.default);
            process.exit(0);
        }
        if (args.version) {
            yield version_1.default();
            process.exit(0);
        }
        logger_1.default.okay(`Application boot on ${moment_1.default().format('llll')}`);
        logger_1.default.verbose('Loading configuration file');
        const config = yield config_1.default();
        if (typeof config.get('token') != 'string' && config.get('token').length != 59) {
            logger_1.default.error(`The access token: ${config.get('token')} is invalid.`, 2);
        }
        if (typeof config.get('serverId') != 'string' && config.get('serverId').length != 18) {
            logger_1.default.error(`The server ID ${config.get('serverId')} is invalid.`, 3);
        }
        yield database_1.connectToDatabase();
        discord_1.authenticate(config.get('token'), yield online_1.default(config));
    });
}
main();