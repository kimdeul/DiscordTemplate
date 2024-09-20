import {
    ApplicationCommandType,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    PermissionFlagsBits
} from "discord.js";
import { BaseCommand, BaseCommandOptions, ParameterList } from "./BaseCommand";
import { convertParameterTypeToRaw } from "./commandFunctions";
import { SlashSubCommand } from "./SlashSubCommand";
import { SlashSubCommandGroup } from "./SlashSubCommandGroup";

interface SlashCommandOptions<P extends ParameterList> extends BaseCommandOptions<P> {
    readonly subCommands?: (SlashSubCommand<ParameterList> | SlashSubCommandGroup)[]
    readonly dmAvailable?: boolean
    readonly defaultMemberPermission?: typeof PermissionFlagsBits[keyof typeof PermissionFlagsBits];
}

export class SlashCommand<P extends ParameterList> extends BaseCommand<P, SlashCommandOptions<P>> {

    constructor(options: SlashCommandOptions<P>) {
        super(options)
    }

    is(interaction: ChatInputCommandInteraction): boolean {
        return interaction.commandName === this.options.name;
    }

    getOption() {
        const cmdOption: ChatInputApplicationCommandData = {
            name: this.options.name,
            description: this.options.description,
            type: ApplicationCommandType.ChatInput,
            options: this.options.args?.map(arg => Object.assign(arg, { type: convertParameterTypeToRaw(arg.type) })) ?? [],
            dmPermission: !!this.options.dmAvailable,
            defaultMemberPermissions: this.options.defaultMemberPermission ?? PermissionFlagsBits.SendMessages,
        }
        return cmdOption;
    }

    async run(interaction: ChatInputCommandInteraction) {
        if (!this.options.subCommands) return await this.action(interaction, this.parameterHandler(interaction))
        for (const subCommand of this.options.subCommands) {
            if (!subCommand.is(interaction)) continue;
            if (subCommand instanceof SlashSubCommand) return await subCommand.action(interaction, subCommand.parameterHandler(interaction))
            if (subCommand instanceof SlashSubCommandGroup) {
                for (const subCommandGroupCommand of subCommand.subCommands) {
                    if (!subCommandGroupCommand.is(interaction)) continue;
                    return await subCommandGroupCommand.action(interaction, subCommandGroupCommand.parameterHandler(interaction))
                }
            }
        }
    }
}

