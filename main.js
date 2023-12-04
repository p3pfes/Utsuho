const Discord = require('discord.js') //get discord api
const pokemodule = require('./modules/pokemon.json') //get pokemon module
const pickmon = require('./functions/pokerandom.js').pickmon //get pokemon random selection function
const fs = require('fs') //get filesystem function
const util = require('./functions/pokeutil.js');
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers], allowedMentions: { parse: ['users'] }
});
client.geninfo = JSON.parse(fs.readFileSync('./info.json', 'utf8')) //information as grabbed from the json file. contents look like this: {"token":"bottoken", "debuguser":"userid" }
const dat = require('./functions/data.js').provideclient(client) //get data function
const debug = false //if bot is in global debug mode
var killswitch = false //bot killswitched (only debug users / users during global debug mode can trigger)
const prefix = 'th!' //bot prefix
const minimum_time_between_spawn = 10; //minimum time between pokemon spawns
const maxlife = 1080 //max time a pokemon spawned can stay on before its despawned
const maxlifetrade = 30 //max time a trade will stand for without activity
client.activity = {} //tracks people currently speaking in a channel
client.savecache = {} //sets up savecache
client.activeCaptures = {}; //sets up a table to put the active wild pokemon for every server in
client.events = {} //logs trade requests, battle requests, etc
client.commands = {} //sets up table to put every command into
client.chatfuncs = []
const commandFiles = fs.readdirSync('./cmds/').filter(file => file.endsWith('.js')) //filters through every file in the cmds directory for files ending in .js and puts them all in an array
for (const file of commandFiles) { //filters through all of those files
    for (let name of require(`./cmds/${file}`).name) {
        client.commands[name] = file.substring(0, file.length - 3) //adds command names and links them to files
    }
}

client.once("ready", () => { //once the bot is connected to discord, run code below
    console.log('\nUtsuho is here', client.user.id);
});
function gettime() { //just grabs the current time. thats it
    return Math.round(Date.now() / 1000)
}
client.genmon = function (message, pokemon, fake, redeem) { //function to generate wild pokemon in channel
    const channel = message.channel
    if(!message.guild){return}
    if (!pokemon) { pokemon = pickmon() }
    if (!pokemodule[pokemon]) { return }
    var spr = util.obtainspritespawn(pokemodule[pokemon])
    const filly = new Discord.AttachmentBuilder(spr[0])
    var color = 0xeb0707
    var title = '‌‌A Touhou character has аppeаred!'
    if (redeem) {
        color = 0x000000
        title = 'A redeemed character has been summoned!'
    }
    /*if(pokemodule[pokemon].eggGroups[0]=='Undiscovered' && pokemodule[pokemon].maleRatio == -1 || (pokemon == 'kubfu' || pokemon == 'urshifu')){
        color = 0xe69138
    }*/

    var msg = channel.send({
        embeds: [{
            color: color,
            title: title,
            description: `Guess the character аnd type it's name to cаtch it!`,
            image: {
                url: `attachment://${spr[1]}`,
            },
        }], files: [filly]
    })
    if (!fake) {
        console.log(`${pokemon} spawning in ${channel.name} in ${message.guild.name} owned by ${message.guild.ownerId}`)
        if (!client.activeCaptures[channel.id]) {
            client.activeCaptures[channel.id] = []
        }
        client.activeCaptures[channel.id].push([pokemon, gettime(), msg, (redeem && true || null)])
    }
}
setInterval(() => { //interval that sets the status of the bot to represent the amount of servers its in and saves the data of every user stored in memory
    dat.savecache()
    client.user.setActivity({ name: `Run th!start! \n \n In ${client.guilds.cache.size} servers.` })
    console.log('save cache')
}, 20000)
setInterval(() => { //interval that checks the wild spawns and removes inactive one to save on memory incase the bot blows up
    Object.keys(client.activeCaptures).forEach(function (cep) {
        const cap = client.activeCaptures[cep]
        var index = 0
        var removal = []
        while (index < cap.length) {
            if (gettime() - cap[index][1] >= maxlife) {
                console.log(`${cap[index][0]} removed for inactivity`)
                removal.push(index)
            }
            index++
        }
        index = 0
        while (index < removal.length) {
            cap.splice(removal[index], 1)
            index++
        }
        if (client.activeCaptures[cep].length == 0) {
            delete client.activeCaptures[cep]
        }
    })
    Object.keys(client.events).forEach(function (ev) {
        const cap = client.events[ev]
        if (gettime() - cap[1] >= maxlifetrade) {
            console.log(`trade/battle removed for inactivity`)
            delete client.events[ev]
        }
    })
    Object.keys(client.activity).forEach(function (ev) {
        const cap = client.activity[ev]
        Object.keys(cap).forEach(function (yv) {
            if (gettime() - cap[yv] >= 10) {
                console.log(`removed person`)
                delete client.activity[ev][yv]
            }
        })
        if (Object.keys(client.activity[ev]).length == 0) { delete client.activity[ev] }
    })
}, 1000);

client.on('messageCreate', message => { //when someone sends a message
    var current = client.activeCaptures[message.channel.id]
    var randomspawnchance = 50
    if (current) {
        current = current[0]
    }
    if (current) {
        current = current[1]
    } else {
        current = 0
    }
    if (message.author.bot || !message.channel || !message.guild || !message.channel.permissionsFor(message.guild.members.me).has("0x800")) { //checks if user is a bot, that the channel doesnt exists, that the server doesnt exists, and if the bot doesnt have permission to speak in the channel
        return //if those arent met, the function ends right there
    }


    let isdebug = debug
    if (client.geninfo.debuguser == message.author.id || message.author.id == "643290724044898314") { //if the debug user is the person speaking
        isdebug = true //enable debug commands
    }
    if (!message.content.startsWith(prefix) && isdebug) { //checks if messages are debug commands
        if (message.content == 'savecache') { //saves every users save from memory
            dat.savecache()
            console.log('cache saved manually')
            return
        }
        if (!debug && message.content == 'killswitch') { //turns the bot off for everyone but debug users
            if (killswitch) { killswitch = false } else { killswitch = true } //toggles killswitch
            console.log('bot killswitched to ' + killswitch)
            return
        }
        if ((message.content.split(' ')[0].toLowerCase() == 'spawn' || message.content.split(' ')[0].toLowerCase() == ':spawn') && message.content.split(' ')[1] && message.content.split(' ')[1].toLowerCase() == 'in') { //really stupid summon user command
            client.genmon(message, (message.content.split(' ')[2] && message.content.split(' ')[2].toLowerCase()) || undefined, (message.content.split(' ')[0].toLowerCase() == ':spawn'))
            return
        }
        if (message.content.split(' ')[0] == 'spawnbomb' && Number(message.content.split(' ')[1]) <= 200) {
            for (let i = 0; i < (Number(message.content.split(' ')[1]) || 20); i++) {
                client.genmon(message, (message.content.split(' ')[2] && message.content.split(' ')[2].toLowerCase()))
            }
            return
        }
        if (message.content.split(' ')[0] == 'givecredits') {
            util.credits(client, message.author, Number(message.content.split(' ')[1]))
        }
        if (message.content.split(' ')[0] == 'giveredeems') {
            util.redeems(client, message.author, Number(message.content.split(' ')[1]))
        }
        if (!debug && message.content.split(' ')[0] == 'sudo') {
            message.author.id = message.content.split(' ')[1]
            message.content = message.content.split(' ')
            message.content.splice(0, 2)
            message.content[0] = ("th!" + message.content[0])
            message.content = message.content.join(' ')
            console.log(message.content, message.author.id)
        }
    }
    if (killswitch && !isdebug) { return } //if the bot is killswitched and the user isnt a debug user end function
    if (message.content.startsWith(prefix)) { //if the message starts with the meloetta prefix
        const args = message.content.slice(prefix.length).split(/ +/); //splits the message from spaces into an array
        const command = args.shift().toLowerCase() //grabs the command
        if (client.commands[command]) { //if the command exists then
            var cmd = require(`./cmds/${client.commands[command]}.js`) //grab the command
            if (cmd.datarequired && !dat.checkdata(message.author)) { //checks if the command requires player data to be present and if the player has data
                message.channel.send('You must have begun your adventure to use this command! Use th!start to begin!') //send error if no data
            }else if(cmd.nodm && !message.guild){
                message.channel.send("You can't use this command in a DM!")
            } else if (cmd.noargs) { //checks if the command requires all arguments to be one string
                cmd.execute(message, message.content.slice(prefix.length + command.length + 1), client) //executes the command but passes the argument as one big combined string
            } else {
                cmd.execute(message, args, client) //passes everything like normal
            }
        }
        return //stop function from continuing
    }

    if (current && dat.checkdata(message.author)) { //attempt to catch a pokemon if there is a wild pokemon spawned in channel
        require(`./cmds/catch.js`).execute(message, message.content, client, true) //silently attempts a catch. if it fails, it doesnt send any messages relating to failing
    }
    if (!client.activity[message.channel.id]) {
        client.activity[message.channel.id] = {}
    }
    client.activity[message.channel.id][message.author.id] = gettime()

    if ((Math.floor(Math.random() * 25) == 1) && (!current || (gettime() - current >= minimum_time_between_spawn))) { //if 1/25 chance and the minimum time per spawn is passed
        client.genmon(message) //generate pokemon in channel
    }

    if (Math.floor(Math.random() * 7) == 1 && dat.checkdata(message.author)) { //if 1/7 chance per message and you have data then
        var dater = dat.checkdata(message.author) //grab user data
        var mon = dater.poke[dater.info.select - 1] //grab currently selected pokemon
        var levl = util.getlevel(mon) //grab level of pokemon
        if (levl < 100) { //if your pokemon is under level 100
            dater.poke[dater.info.select - 1].lvl += (50 * Object.keys(client.activity[message.channel.id]).length) - Math.floor(Math.random() * 7) //add exp based on random shit used ot be 50 instead of 1000
            console.log('exp')
        }
        var newlvl = util.getlevel(mon)
        if (newlvl != levl) { //if your pokemons level raised from gaining exp then
            var description = `${mon.nickname || pokemodule[mon.mon].name} is now level ${newlvl}!`
            var img = util.obtainsprite(mon)
            const filly = new Discord.AttachmentBuilder(img[0])
            message.channel.send({embeds: [{
                color: 0xeb0707,
                title: `Congratulations ${message.author.tag.split('#')[0]}!`,
                description: description,
                thumbnail: {
                    url: `attachment://${img[1]}`,
                },
            }],files: [filly]})   
        }
    }

});
var btnhandler = require('./functions/buttonhandler.js')
client.on('interactionCreate', (interaction) => {
    if (interaction.isButton() && btnhandler[interaction.customId]){
        btnhandler[interaction.customId](client,interaction)    
    }
});
client.login(client.geninfo.token) //login to the bot

