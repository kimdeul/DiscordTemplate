import { 
    ApplicationCommandData,
    ApplicationCommandOptionData,
    ApplicationCommandType,
    BaseInteraction,
    ChatInputCommandInteraction,
} from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { ActionFunction, CommandAvailable, SlashSubCommand } from "./SlashSubCommand";
import { SlashSubCommandGroup } from "./SlashSubCommandGroup";

interface CommandOptions {
    readonly name: string;
    readonly description: string;
    readonly args?: ApplicationCommandOptionData[];
    readonly subCommands?: Array<SlashSubCommandGroup | SlashSubCommand>;
    readonly permission: bigint;
    readonly commandAvailable: CommandAvailable;
    readonly action?: ActionFunction;
}

export class SlashCommand {

    protected readonly options: CommandOptions;
    protected readonly action: ActionFunction;
    
    constructor(options: CommandOptions) {
        this.options = options;  
        this.action = options.action ?? (async () => {});
    }

    async run(interaction: ChatInputCommandInteraction) {
        if (!this.options.subCommands) return await this.action(interaction)
        for (const subCommand of this.options.subCommands) {
            if (!subCommand.isMyCommand(interaction)) continue;
            if (subCommand instanceof SlashSubCommand) return await subCommand.action(interaction)
            if (subCommand instanceof SlashSubCommandGroup) {
                for (const subCommandGroupCommand of subCommand.subCommands) {
                    if (!subCommandGroupCommand.isMyCommand(interaction)) continue;
                    return await subCommandGroupCommand.action(interaction)
                }
            }
        }
    }

    isMyCommand(interaction: ChatInputCommandInteraction) {
        return interaction.commandName === this.options.name;
    }

    getOption() {
        const cmdOption: ApplicationCommandData = {
            name: this.options.name,
            description: this.options.description,
            type: ApplicationCommandType.ChatInput,
            options: (this.options.subCommands?.map(c => c.getOption()) ?? this.options.args) ?? [],
            dmPermission: this.options.commandAvailable === CommandAvailable.ONLY_DM,
            defaultMemberPermissions: this.options.permission
        }
        return cmdOption;
    }
}

export function getCommands() {
    const cmdList: SlashCommand[] = []
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
    readDirectioryRecursive(path.join(__dirname, '../command'))
    return cmdList;
}

export async function commandHandler(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const cmd = commands.find(c => c.isMyCommand(interaction))
    if (cmd) await cmd.run(interaction)
}

export function getCommandOptions() {
    const cmdOptionList: ApplicationCommandData[] = commands.map(cmd => cmd.getOption())
    return cmdOptionList;
}

const commands = getCommands()

export { commands }