import {
    ApplicationCommandOptionType,
    ApplicationCommandSubCommandData,
    ChatInputCommandInteraction
} from "discord.js";
import { BaseCommand, BaseCommandOptions, ParameterList } from "./BaseCommand";
import { convertParameterTypeToRaw } from "./commandFunctions";

interface SlashSubCommandOptions<P extends ParameterList> extends BaseCommandOptions<P> {

}

export class SlashSubCommand<P extends ParameterList> extends BaseCommand<P, SlashSubCommandOptions<P>> {

    constructor(options: SlashSubCommandOptions<P>) {
        super(options)
    }

    is(interaction: ChatInputCommandInteraction) {
        return interaction.options.getSubcommand() === this.name
    }

    getOption() {
        const cmdOption: ApplicationCommandSubCommandData = {
            name: this.options.name,
            description: this.options.description,
            type: ApplicationCommandOptionType.Subcommand,
            options: this.options.args?.map(arg => Object.assign(arg, { type: convertParameterTypeToRaw(arg.type) })) ?? [],
        }
        return cmdOption;
    }
}