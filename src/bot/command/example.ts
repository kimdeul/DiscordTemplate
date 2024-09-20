import { ParameterType } from "../structure/BaseCommand";
import { SlashCommand } from "../structure/SlashCommand";

export default new SlashCommand({
    name: "example",
    description: "An example command.",
    args: [
        { 
            name: 'num', 
            description: 'Please input a number.',
            type: ParameterType.NUMBER, 
            required: true
        },
        { 
            name: 'str', 
            description: 'Please input a string.',
            type: ParameterType.STRING, 
        }
    ] as const,
    async action(interaction, parameters) {
        await interaction.reply(`${parameters.num ** 2}`)
        await interaction.followUp(`**${parameters.str}**`)
    }
})