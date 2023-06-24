import { 
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashSubCommand } from "./SlashSubCommand";

interface CommandOptions {
    readonly name: string;
    readonly description: string;
    readonly subCommands: SlashSubCommand[];
}

export class SlashSubCommandGroup {

    readonly options: CommandOptions;
    
    constructor(options: CommandOptions) {
        this.options = options;       
    }

    get subCommands() { return this.options.subCommands }

    isMyCommand(interaction: ChatInputCommandInteraction) {
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