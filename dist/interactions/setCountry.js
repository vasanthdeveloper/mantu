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
const database_1 = __importDefault(require("../database"));
function setTitleCase(str) {
    let split = str.toLowerCase().split(' ');
    for (var i = 0; i < split.length; i++) {
        split[i] = split[i][0].toUpperCase() + split[i].slice(1);
    }
    return split.join(' ');
}
exports.setTitleCase = setTitleCase;
function respond(command, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const countryParsed = command.substring(8);
        let countryInDB;
        if (countryParsed.length == 2) {
            countryInDB = yield database_1.default.queries.countries.getCountryByAlpha2(countryParsed);
        }
        else if (countryParsed.length == 3) {
            countryInDB = yield database_1.default.queries.countries.getCountryByAlpha3(countryParsed);
        }
        else {
            countryInDB = yield database_1.default.queries.countries.getCountryByName(countryParsed.toLowerCase());
        }
        if (!countryInDB) {
            message.channel.send(`:beetle: **The country ${countryParsed} is either invalid or given in wrong format.**`);
            return false;
        }
        else {
            yield database_1.default.queries.members.setCountry(message.author.id, countryInDB.name);
            message.channel.send(':gem: **Your country has been saved successfully.**');
            return true;
        }
    });
}
exports.default = respond;
