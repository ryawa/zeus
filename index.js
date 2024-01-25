import * as fs from "fs";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import "./keepalive.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Lock channels
// Timeout/kick users
// Invite users
// Command handling
// Display name
// Bot status

client.commands = new Collection();
const commandFolder = new URL("commands/", import.meta.url);
const commandFiles = fs
  .readdirSync(commandFolder)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = new URL(file, commandFolder);
  const { default: command } = await import(filePath);
  client.commands.set(command.name, command.execute);
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
  const command = message.content.split(" ")[0];
  const execute = client.commands.get(command);
  if (!message.author.bot && execute) {
    execute(message);
  }
});

client.login(process.env["TOKEN"]);
