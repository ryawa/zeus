import { PermissionsBitField } from "discord.js";

export default {
  name: "zap",
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
  },
};
