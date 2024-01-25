import { PermissionsBitField } from "discord.js";

export default {
  name: "au revoir",
  execute: (message) => {
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
      !member.kickable ||
      member.user.bot
    ) {
      return message.channel.send("Can't zap that user");
    }

    if (!author.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.channel.send("Invalid permissions");
    }

    member
      .kick()
      .then((res) => {
        message.channel.send(`Au revoir ${res.user.username}! :wave:`);
        console.log(`${author.user.username} kicked ${res.user.username}`);
      })
      .catch((e) => {
        message.channel.send("An error occurred");
        console.error(e);
      });
  },
};
