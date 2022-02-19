import { config } from "dotenv";
config({ path: "../.env" });

import "source-map-support/register";

import debug from "debug";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import ModuleLoader from "discord-module-loader";
import mysql from "mysql";

if (!process.env.TOKEN) throw new Error("Please set the TOKEN environment variable");

export const mainLog = debug("BTEUK");
const conn = mysql.createConnection({
	host: process.env.DBHOST,
	user: process.env.DBUSER,
	password: process.env.DBPASS,
	port: 3306,
	database: "minecraft_publicbuilds"
});

debug.enable("BTEUK*");

export const client = new Client({
		intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
		presence: {
			status: "online",
			activities: [{ name: "coming soon.", type: "PLAYING" }]
		}
	}),
	moduleLoader = new ModuleLoader(client);

client.on("ready", async () => {
	mainLog("Loading everything...");
	await moduleLoader.loadAll();
	mainLog("Loaded!");
	mainLog("Updating Slash Commands....");
	await moduleLoader.updateSlashCommands();
	mainLog("Done!");
});

async function run() {
	await client.login(process.env.TOKEN);
	mainLog("Connected to Discord");
}

async function dbInit() {
	console.log(conn);

	conn.connect(err => {
		if (err) throw err;
		console.log("Connected!");
	});
}

async function plotStatus() {
	let plots: Number;
	mainLog("Querying Database...");
	conn.query("SELECT COUNT(id) FROM plot_data WHERE status='submitted';", async (err, results) => {
		plots = results[0]["COUNT(id)"];
		mainLog(`${plots} waiting to be reviewed`);
		plots = results[0]["COUNT(id)"];
		const plotEmbed = new MessageEmbed({
			description: `There are ${plots} plots waiting to be reviewed`,
			color: "ORANGE"
		});

		const g = await client.guilds.fetch("693879304605401110");
		const c = (await g.channels.fetch("800771847964065793")) as TextChannel;
		c.send({ embeds: [plotEmbed] });
		c.setTopic(`There are ${plots} plots waiting to be reviewed`);
	});

	setInterval(() => {
		conn.query("SELECT COUNT(id) FROM plot_data WHERE status='submitted';", async (err, results) => {
			if (err) throw err;
			mainLog("Querying Database...");
			if (results[0]["COUNT(id)"] == plots) return mainLog("Plots amount the same, not updating.");
			else {
				plots = results[0]["COUNT(id)"];
				const plotEmbed = new MessageEmbed({
					description: `There are ${plots} plots waiting to be reviewed`,
					color: "ORANGE"
				});

				const g = await client.guilds.fetch("693879304605401110");
				const c = (await g.channels.fetch("944328044158537849")) as TextChannel;
				c.send({ embeds: [plotEmbed] });
				c.setTopic(`There are ${plots} plots waiting to be reviewed`);
			}
		});
	}, 36000000);
}

run();
dbInit();
plotStatus();
