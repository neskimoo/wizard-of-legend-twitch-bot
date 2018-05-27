# wizard-of-legend-twitch-bot
This is a twitch bot for the game [Wizard of Legend](https://store.steampowered.com/app/445980/Wizard_of_Legend/). This bot will pull the relic list from the [Wizard of Legend wiki](https://wizardoflegend.gamepedia.com/Wizard_of_Legend_Wiki) and serve back a comment as to what a relic does in twitch chat.

### Dependencies
- This project depends on the user having a [memcached](https://memcached.org/) server up and running. This can be done manually or through AWS.
- This project will look for a .env file in your local directory with the below environment variables defined.

### Environment Variables

- **`MEMCACHED_INSTACE`**<br>
  The instance of memcached that you have started up

- **`AUTH`**<br>
  The authentication string that is recieved for the bot's twitch user from [twitchapps](https://twitchapps.com/tmi/)
  
### Running the application
- Specify the username that you want to use within the [twitch bot framework](https://github.com/kritzware/twitch-bot)
- Specify the channel(s) that you want the bot to run in
- Start up memcached instance
- Run node server.js and the application should be running on your channel

### Usage example
A user entering "!relic Double Trouble" should return "Double Trouble -	Deal double damage but receive double damage!"

### Credit
Making use of [Kritzware's twitch-bot framework](https://github.com/kritzware/twitch-bot) for this project.
