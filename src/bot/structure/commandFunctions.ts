import { ApplicationCommandData, ApplicationCommandOptionType, BaseInteraction } from "discord.js"
import { readdirSync } from "fs"
import { join } from "path"
import { ParameterList, ParameterType } from "./BaseCommand"
import { SlashCommand } from "./SlashCommand"

export function convertParameterTypeToRaw(type: ParameterType) {
    switch (type) {
        case ParameterType.STRING: return ApplicationCommandOptionType.String
        case ParameterType.INTEGER: return ApplicationCommandOptionType.Integer
        case ParameterType.BOOLEAN: return ApplicationCommandOptionType.Boolean
        case ParameterType.USER: return ApplicationCommandOptionType.User
        case ParameterType.CHANNEL: return ApplicationCommandOptionType.Channel
        case ParameterType.ROLE: return ApplicationCommandOptionType.Role
        case ParameterType.MENTIONABLE: return ApplicationCommandOptionType.Mentionable
        case ParameterType.NUMBER: return ApplicationCommandOptionType.Number
        case ParameterType.ATTACHMENT: return ApplicationCommandOptionType.Attachment
    }
}

export function getCommands() {
    const cmdList: SlashCommand<ParameterList>[] = []
    function readDirectioryRecursive(p: string) {
        readdirSync(p).forEach(filePath => {
            const newPath = p + '/' + filePath
            if (filePath.endsWith('.ts')) {
                const cmd = require(newPath).default
                if (cmd instanceof SlashCommand) cmdList.push(cmd)
                return;
            } readDirectioryRecursive(newPath)
        })
    }
    readDirectioryRecursive(join(__dirname, '../command'))
    return cmdList;
}

export async function commandHandler(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const cmd = Commands.find(c => c.is(interaction))
    if (cmd) await cmd.run(interaction)
}

export function getCommandOptions() {
    const cmdOptionList: ApplicationCommandData[] = Commands.map(cmd => cmd.getOption())
    return cmdOptionList;
}

const Commands = getCommands()

export { Commands }

