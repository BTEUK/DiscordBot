import { config } from "dotenv";
config({ path: "../.env" });

import "source-map-support/register";

import debug from "debug";
import { Client } from "discord.js";
import ModuleLoader from "discord-module-loader";
import mysql from "mysql";

if (!process.env.TOKEN) throw new Error("Please set the TOKEN environment variable");

export const mainLog = debug("BTEUK");

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
	const conn = mysql.createConnection({
		host: process.env.DBHOST,
		user: process.env.DBUSER,
		password: process.env.DBPASS,
		port: 3306,
		database: "minecraft_publicbuilds"
	});

	console.log(conn);

	conn.connect(err => {
		if (err) throw err;
		console.log("Connected!");
		conn.query("SELECT COUNT(id) FROM plot_data WHERE status='submitted';", (err, results) => {
			if (err) throw err;
			console.log(results);
		});
	});
}

run();
dbInit();
