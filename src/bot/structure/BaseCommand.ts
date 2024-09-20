import {
    ApplicationCommandOptionData,
    ApplicationCommandSubCommandData,
    ApplicationCommandSubGroupData,
    Attachment,
    Channel,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    GuildMember,
    Role,
    User
} from "discord.js";

export enum ParameterType {
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT,
}

type RecievedParameterMapper<U extends ParameterType> =
    U extends ParameterType.STRING
    ? string
    : U extends ParameterType.INTEGER
    ? number
    : U extends ParameterType.BOOLEAN
    ? boolean
    : U extends ParameterType.USER
    ? User
    : U extends ParameterType.CHANNEL
    ? Channel
    : U extends ParameterType.ROLE
    ? Role
    : U extends ParameterType.MENTIONABLE
    ? GuildMember | User | Role
    : U extends ParameterType.NUMBER
    ? number
    : U extends ParameterType.ATTACHMENT
    ? Attachment
    : never

type RecievedParameter<T extends ParameterList> = {
    [K in T[number] as K['name']]: K['required'] extends true
        ? RecievedParameterMapper<K['type']>
        : RecievedParameterMapper<K['type']> | undefined;
}

export type ActionFunction<P extends ParameterList> = (interaction: ChatInputCommandInteraction, parameters: RecievedParameter<P>) => Promise<void>;

type AssignKey<T, S extends keyof T, N> = { [K in keyof T]: K extends S ? N : T[K] };
type RawBaseParameter = AssignKey<Exclude<ApplicationCommandOptionData, ApplicationCommandSubCommandData | ApplicationCommandSubGroupData>, "type", ParameterType>;
type BaseParameter = RawBaseParameter | Readonly<RawBaseParameter>;
export type ParameterList = BaseParameter[] | Readonly<BaseParameter[]>;

export interface BaseCommandOptions<P extends ParameterList> {
    readonly name: string;
    readonly description: string;
    readonly args?: P;
    readonly action?: ActionFunction<P>;
}

export abstract class BaseCommand<P extends ParameterList, O extends BaseCommandOptions<P>> {

    protected readonly options: O;
    readonly action: ActionFunction<P>;
    
    constructor(options: O) {
        this.options = options;  
        this.action = options.action ?? (async () => {});
    }

    get name() {
        return this.options.name
    }

    abstract is(interaction: ChatInputCommandInteraction): boolean;
    abstract getOption(): ChatInputApplicationCommandData | ApplicationCommandOptionData

    parameterHandler(interaction: ChatInputCommandInteraction) {
        return Object.fromEntries(
            this.options.args?.map(arg => [ arg.name, (() => {
                switch (arg.type) {
                    case ParameterType.STRING: return interaction.options.getString(arg.name, arg.required)
                    case ParameterType.INTEGER: return interaction.options.getInteger(arg.name, arg.required)
                    case ParameterType.BOOLEAN: return interaction.options.getBoolean(arg.name, arg.required)
                    case ParameterType.USER: return interaction.options.getUser(arg.name, arg.required)
                    case ParameterType.CHANNEL: return interaction.options.getChannel(arg.name, arg.required)
                    case ParameterType.ROLE: return interaction.options.getRole(arg.name, arg.required)
                    case ParameterType.MENTIONABLE: return interaction.options.getMentionable(arg.name, arg.required)
                    case ParameterType.NUMBER: return interaction.options.getNumber(arg.name, arg.required)
                    case ParameterType.ATTACHMENT: return interaction.options.getAttachment(arg.name, arg.required)
                }
            })()]) ?? []
        ) as RecievedParameter<P>
    }

}