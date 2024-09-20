import {
    Client,
    GatewayIntentBits,
    Partials
} from "discord.js";
import { commandHandler } from "./structure/commandFunctions";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ], 
    partials: [
        Partials.Channel,
        Partials.GuildMember
    ]
})

client.on('interactionCreate', commandHandler)
client.on('ready', async () => { 
    /* 이곳에 getCommandOptions를 이용한 커맨드 등록을 할 수 있습니다. */
})

export { client };
