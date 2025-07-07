const { REST, Routes } = require('discord.js');


const TOKEN = 'YOUR_NEW_DISCORD_BOT_TOKEN';
const CLIENT_ID = 'YOUR_NEW_DISCORD_BOT_USERID';

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();
