import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
} from "discord.js";
import { BaseCommand, BaseCommandOptions, ParameterList } from "./BaseCommand";
import { SlashSubCommand } from "./SlashSubCommand";

interface SlashSubCommandGroupOptions extends BaseCommandOptions<[]> {
    readonly name: string;
    readonly description: string;
    readonly subCommands: SlashSubCommand<ParameterList>[]
    readonly args: never;
    readonly action: never;
}

export class SlashSubCommandGroup extends BaseCommand<[], SlashSubCommandGroupOptions> {
    
    constructor(options: SlashSubCommandGroupOptions) {
        super(options)       
    }

    get subCommands() { return this.options.subCommands }

    is(interaction: ChatInputCommandInteraction) {
        return interaction.options.getSubcommandGroup() === this.options.name;
    }

    getOption() {
        const cmdOption: ApplicationCommandOptionData = {
            name: this.options.name,
            description: this.options.description,
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: this.options.subCommands.map(c => c.getOption())
        }
        return cmdOption;
    }

}