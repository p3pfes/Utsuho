/*
    Meloetta - A Discord bot to play Pokémon
    Copyright (C) 2021-2023  Hera

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('Timed out');
    }, 20000);
}).catch(error => console.error(error));

const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

var pokeutil = require('../functions/pokeutil.js')
module.exports = {
    name: ['trade'/*,'duel'*/],
    description: 'h',
    datarequired: true,
    nodm: true,
    async execute(message, args, client) {
        if (!args[0]) {
            message.channel.send('You must specify a user!')
            return
        }

        var user = args[0].slice(2).slice(0, -1)


        if (client.events[message.channel.id]) {
            message.channel.send('There is already an outgoing trade or battle request in this channel!')
            return
        }
        let member;
        try {
            member = await Promise.race([message.guild.members.fetch({ user: user }), timeoutPromise]);
        } catch {
            message.channel.send("User does not exist.")
            return
        }
        if (member) {
            if (!message.channel.permissionsFor(member).has("1024")) {
                message.channel.send('User must be able to see this channel!')
                return
            }
            const accept = new ButtonBuilder()
                .setCustomId('accepttb')
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success)
            const deny = new ButtonBuilder()
                .setCustomId('denytb')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
            const row = new ActionRowBuilder().addComponents(accept, deny);
            switch (message.content.split(/ +/)[0]) {
                case `th!trade`:
                    var msg = message.channel.send({ content: `<@${member.user.id}>! <@${message.author.id}> has invited you to a trade!`, components: [row] })
                    client.events[message.channel.id] = ['traderequest', Date.now() / 1000, message.author, member.user]
                    break
                case `th!duel`:
                    var msg = message.channel.send({ content: `<@${member.user.id}>! <@${message.author.id}> has challenged you to a duel!`, components: [row] })
                    client.events[message.channel.id] = ['battlerequest', Date.now() / 1000, message.author, member.user]
                    break
            }

            /*}catch(error){
                message.channel.send(`Invalid user, or user is not in this server!\n\nError: ${error}`)        
                delete client.events[message.channel.id]
            }*/

        } else {
            message.channel.send("User does not exist.")
        }
    }
}
