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
const discord_js_1 = __importDefault(require("discord.js"));
const moment_1 = __importDefault(require("moment"));
const members_1 = __importDefault(require("../../database/members"));
const loops_1 = require("../../utilities/loops");
const country_1 = require("../conversion/country");
const config_1 = require("../../config");
const roles_1 = __importDefault(require("../../discord/roles"));
const generic_1 = __importDefault(require("../../discord/generic"));
const moderators_1 = __importDefault(require("../../discord/moderators"));
const discord_1 = require("../../discord/discord");
function respond(command, message, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let members = [];
        if (command == 'info') {
            members.push(message.member);
        }
        else {
            const access = yield moderators_1.default.onlyModerators(message, config);
            if (access == false)
                return false;
        }
        const parsed = message.content.split(' ');
        yield loops_1.forEach(parsed, (word) => __awaiter(this, void 0, void 0, function* () {
            if (isNaN(parseInt(word)) == false && word.length == 18) {
                const member = yield generic_1.default.getAnyoneById(word);
                if (member)
                    members.push(member);
            }
        }));
        members = members.concat(Array.from(message.mentions.members.values()));
        yield loops_1.forEach(members, (member) => __awaiter(this, void 0, void 0, function* () {
            if (!member.roles.cache.find(r => r.id === config.get('roles').base)) {
                discord_1.sendMessage(`${discord_1.getRandomEmoji(false)} ${member.displayName} doesn't have a ${(yield roles_1.default.getBaseRole(config)).name} role, so ${member.displayName} isn't tracked my me.`, message.channel);
            }
            else {
                const databaseInfo = yield members_1.default.getMember(member.user.id);
                const roles = [];
                const baseRole = yield roles_1.default.getBaseRole(config);
                yield loops_1.forCollection(member.roles.cache, (role) => __awaiter(this, void 0, void 0, function* () {
                    if (role.name !== '@everyone' && role.name !== baseRole.name) {
                        roles.push(`<@&${role.id}>`);
                    }
                }));
                if (roles.length == 0) {
                    roles.push(`<@&${baseRole.id}>`);
                }
                const response = new discord_js_1.default.MessageEmbed()
                    .setColor(member.displayColor)
                    .setTitle(`Activity information for ${member.displayName}`)
                    .setAuthor(message.member.displayName, message.author.displayAvatarURL({
                    dynamic: true,
                    format: 'webp',
                    size: 256
                }))
                    .setThumbnail(member.user.displayAvatarURL({
                    dynamic: true,
                    format: 'webp',
                    size: 512
                }))
                    .addField('Last Activity', moment_1.default(databaseInfo.lastActive, 'x').fromNow(), true)
                    .addField('Timezone', (databaseInfo.timezone) ? databaseInfo.timezone : 'Unknown', true)
                    .addField('Country', (databaseInfo.country) ? country_1.setTitleCase(databaseInfo.country) : 'Unknown', true)
                    .addField('ID', member.user.id, false)
                    .addField('Roles', roles.join(' '), false)
                    .setTimestamp()
                    .setFooter(`mantu v${config_1.appInfo.version}`);
                discord_1.sendMessage(response, message.channel);
            }
        }));
        return true;
    });
}
exports.default = respond;
