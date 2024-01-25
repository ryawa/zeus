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
  console.log(`Loaded ${[...readyClient.commands.keys()].join(", ")}`);
});

client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) {
    return;
  }
  const command = message.content.toLowerCase().split(" ");
  for (let i = 0; i < command.length; i++) {
    const execute = message.client.commands.get(command.slice(0, i + 1).join(" "));
    if (execute) {
      execute(message);
      break;
    }
  }
});

client.login(process.env["TOKEN"]);
