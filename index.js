import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
import "./keepalive.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("zap ")) {
    const author = message.member;
    const member = message.mentions.members.first();

    if (!author.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send("Invalid permissions");
    }

    if (!member) {
      return message.channel.send("Invalid member");
    }

    if (member.id == author.id || member.id == message.client.user.id) {
      return message.channel.send(":skull:");
    }

    if (
      author.roles.highest.position < member.roles.highest.position ||
      !member.bannable ||
      member.user.bot
    ) {
      return message.channel.send("Can't ban that user");
    }

    member
      .ban()
      .then((res) => {
        message.channel.send(`Zapped ${res.user.username}! :zap:`);
      })
      .catch((e) => {
        message.channel.send("An error occurred");
        console.log(e);
      });
  }
});

client.login(process.env["TOKEN"]);
