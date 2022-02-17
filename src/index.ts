import { config } from "dotenv";
config({ path: "../.env" });

import "source-map-support/register";

import debug from "debug";
import { Client } from "discord.js";
import ModuleLoader from "discord-module-loader";

if (!process.env.TOKEN) throw new Error("Please set the TOKEN environment variable");

export const mainLog = debug("Bot");

debug.enable("Bot*");

//* Create new client & set login presence
export const client = new Client({
		intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_PRESENCES"],
		presence: {
			status: "online",
			activities: [{ name: "for slash commands!", type: "WATCHING" }]
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

run();
