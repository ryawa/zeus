import {
  Client,
  Events,
  GatewayIntentBits,
  PermissionsBitField,
} from "discord.js";
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

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
  if (
    message.content.startsWith("zap ") ||
    message.content.startsWith("zap! ")
  ) {
    const author = message.member;
    const member = message.mentions.members.first();

    if (!member) {
      return message.channel.send("Invalid member");
    }

    if (member.id == author.id || member.id == message.client.user.id) {
      message.channel.send(":skull: don't try me");
      return message.channel.send("https://tenor.com/bZNxS.gif");
    }

    if (
      author.roles.highest.position < member.roles.highest.position ||
      !member.bannable ||
      member.user.bot
    ) {
      return message.channel.send("Can't zap that user");
    }

    if (!author.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send("Invalid permissions");
    }

    member
      .ban()
      .then((res) => {
        message.channel.send(`Zapped ${res.user.username}! :zap:`);
        console.log(`${author.user.username} banned ${res.user.username}`);
      })
      .catch((e) => {
        message.channel.send("An error occurred");
        console.error(e);
      });
  }
});

client.login(process.env["TOKEN"]);
