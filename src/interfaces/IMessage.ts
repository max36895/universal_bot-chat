export default interface IMessage {
  text: string;
  date: string;
  isBot: boolean;
  buttons?: string[] | null | undefined;
}
