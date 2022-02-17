import { MessageEmbed, CommandInteraction } from "discord.js";
import { DiscordCommand } from "discord-module-loader";
import { mainLog } from "..";

function resolveColor(color: string) {
	return parseInt(color.replace("#", ""), 16);
}

export default new DiscordCommand({
	name: "ping",
	description: "Gives you the bot's ping",
	execute: async (int: CommandInteraction) => {
		const ping = Date.now() - int.createdTimestamp,
			onlineSince = Math.round(int.client.readyTimestamp! / 1000);

		let colors = {
				green: "",
				orange: "",
				red: ""
			},
			color;

		if (ping < 0) {
			color = colors.green;
			mainLog("Something went terribly wrong and the ping is negative. Come pick me up I'm scared.");
		} else if (ping <= 200) color = colors.green;
		else if (ping <= 400) color = colors.orange;
		else color = colors.red;

		const pingString = `Ping: ${ping}ms
    
    **Online Since**:

    <t:${onlineSince}>
    <t:${onlineSince}:R>
    `;
		const embed = new MessageEmbed({
			author: { name: int.client.user!.username, icon_url: int.client.user!.displayAvatarURL() },
			title: "Pong!",
			color: resolveColor(color),
			description: pingString,
			thumbnail: { url: int.client.user!.displayAvatarURL() }
		});
		await int.reply({ embeds: [embed] });
	}
});
