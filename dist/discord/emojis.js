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
const discord_1 = __importDefault(require("./discord"));
function getAllEmojis() {
    return __awaiter(this, void 0, void 0, function* () {
        const guild = discord_1.default.guilds.cache.first();
        return Array.from(guild.emojis.cache.values());
    });
}
function getEmojiByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const emojis = yield getAllEmojis();
        return emojis.find(emo => emo.name == name);
    });
}
function renderString(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const emojis = yield getAllEmojis();
        return input.replace(/:\w+:/g, (emojiName) => {
            const emoji = emojis.find(emo => emo.name == emojiName.replace(/:/g, ''));
            if (emoji) {
                return `<${emojiName}${emoji.id}>`;
            }
            else {
                return emojiName;
            }
        });
    });
}
exports.default = {
    getAllEmojis,
    getEmojiByName,
    renderString
};
