import { 
    ApplicationCommandOptionType as OptionType,
    ChatInputCommandInteraction,
    PermissionFlagsBits as Permission,
} from "discord.js";
import { SlashCommand } from "../structure/SlashCommand";
import { CommandAvailable } from "../structure/SlashSubCommand";

export default new SlashCommand(
    {
        name: 'example',
        description: 'This is an example command.',
        args: [
            { 
                name: 'number', 
                description: 'Please input a number.',
                type: OptionType.Number, 
                required: true
            }
        ],
        commandAvailable: CommandAvailable.ONLY_GUILD,
        permission: Permission.Administrator,

        async action(interaction: ChatInputCommandInteraction) {
            const number = interaction.options.getNumber('number')!!
            interaction.reply(`${number * 2}`)
        }
    }
)