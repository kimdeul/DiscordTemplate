import { 
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandSubCommandData,
    ApplicationCommandSubGroupData,
    ChatInputCommandInteraction,
} from "discord.js";

export enum CommandAvailable {
    ONLY_DM,
    ONLY_GUILD,
}

export type ActionFunction = (interaction: ChatInputCommandInteraction) => Promise<void>;

interface CommandOptions {
    readonly name: string;
    readonly description: string;
    readonly args?: Exclude<ApplicationCommandOptionData, ApplicationCommandSubCommandData | ApplicationCommandSubGroupData>[];
    readonly required: boolean;
    readonly action: ActionFunction;
}

export class SlashSubCommand {

    protected readonly options: CommandOptions;
    readonly action: ActionFunction;
    
    constructor(options: CommandOptions) {
        this.options = options;  
        this.action = options.action ?? (async () => {});
    }

    isMyCommand(interaction: ChatInputCommandInteraction) {
        return interaction.options.getSubcommand() === this.options.name;
    }

    getOption() {
        const cmdOption: ApplicationCommandOptionData = {
            name: this.options.name,
            description: this.options.description,
            type: ApplicationCommandOptionType.Subcommand,
            options: this.options.args ?? [],
        }
        return cmdOption;
    }
}