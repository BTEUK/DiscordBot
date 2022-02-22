import { DiscordEvent } from "discord-module-loader";
import { MessageEmbed, TextChannel } from "discord.js";

export default new DiscordEvent("messageCreate", async msg => {
	if (
		msg.content.includes(".gift") &&
		msg.content.match(/(https|http)+(:\/\/)([a-zA-Z])+(\.gift)/gm)![0].includes("https://discord.gift") == false
	) {
		msg.member?.timeout(86400000, "Scam Link");
		const g = await msg.client.guilds.fetch("693879304605401110");
		const c = (await g.channels.fetch("695319606570647654")) as TextChannel;

		c.send({
			content: "<@693939913011232800>",
			embeds: [
				new MessageEmbed({
					title: "Nitro Scam Detected!",
					description: `A nitro scam link has been detected and the associated user has been timed-out.\n${msg.author.tag} (${msg.author.id})`,
					color: "RED"
				})
			]
		});

		msg.delete();
	}
});
