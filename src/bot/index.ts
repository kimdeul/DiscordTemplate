import {
    Client,
    GatewayIntentBits,
    Partials
} from "discord.js";
import { commandHandler, setCommands } from "./structure/commandFunctions";

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
    const guild = client.guilds.cache.get("Guild ID")
    if (guild) console.log(setCommands(client, guild) ? "Commands updated" : "Commands not changed")
})

export { client };

