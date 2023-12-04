/*
    Meloetta - A Discord bot to play Character
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

const pokeutil = require('../functions/pokeutil.js')
const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timed out');
    }, 20000);
  }).catch(error => console.error(error));

module.exports = {
    name: ['accept'],
    description: 'h',
    datarequired:true,
    async execute(message,args,client){
        if(client.events[message.channel.id]){
        client.events[message.channel.id][1] = Date.now()/1000
        }
        if(!client.events[message.channel.id] || (client.events[message.channel.id][0] != 'traderequest' && client.events[message.channel.id][0] != 'battlerequest')){
            message.channel.send('There is nothing to accept in this channel!')
            return
        }
        if(client.events[message.channel.id][3] != message.author.id){
            message.channel.send('You were not the one sent a request!')
            return
        }
        if(pokeutil.finduserinevent(client,client.events[message.channel.id][2].id,client.events[message.channel.id][3].id)){
            return message.channel.send('Trade is already going on elsewhere, either with yourself or the trade inviter. Close that trade, and try again!')
        }
        try {
        const member = await Promise.race([message.guild.members.fetch({ user: client.events[message.channel.id][2]}), timeoutPromise]);
        client.events[message.channel.id][0] = 'trade'
        client.events[message.channel.id][1] = Date.now()/1000
        client.events[message.channel.id].push(member.user.username)
        client.events[message.channel.id].push(message.author.username)
        client.events[message.channel.id].push(false)
        client.events[message.channel.id].push(false)
        client.events[message.channel.id].push({'credits':0,'redeems':0,'poke':[]})
        client.events[message.channel.id].push({'credits':0,'redeems':0,'poke':[]})
        client.events[message.channel.id].push(0)
        client.events[message.channel.id].push(await message.channel.send({embeds: [{
            color: 0xeb0707,
            title: `Trade between ${member.user.username} and ${message.author.username}`,
            description: `<@${member.user.id}> is offering | ❌\n${'` `'}\n<@${message.author.id}> is offering | ❌\n${'` `'}`,
        }]}))
        
        }catch(error){
            message.channel.send(`Error! ${error}`)
            delete client.events[message.channel.id]
        }
       
        
    }
}
