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

const pokeutil = require('../functions/pokeutil.js');
const pokemon = require('../modules/pokemon.json')
function grabpokemonnames(data,list){
    var str = ''
    var index = 0
    while(index < list.length){
        var mon = data[list[index]]
        console.log(mon)
        if(mon){str += (index+1)+'. Level '+pokeutil.getlevel(mon)+' '+pokemon[mon.mon].name+(mon.shiny && ' ⭐' || ' ') + ' ID: '+(list[index]+1)+'\n'}
        index++
    }
    return str
}
const { ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandSubcommandBuilder } = require('discord.js');
const ready = new ButtonBuilder()
            .setCustomId('readytrade')
            .setLabel('Ready')
            .setStyle(ButtonStyle.Success)
const cancel = new ButtonBuilder()
            .setCustomId('canceltrade')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
const row = new ActionRowBuilder().addComponents(ready,cancel);

const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timed out');
    }, 5000);
  }).catch(error => console.error(error));


module.exports = {
    name: ['offer','remove'],
    description: 'h',
    datarequired: true,
    nodm: true,
    grabmessage(info,onedata,twodata){
        return {embeds: [{
            color: 0xeb0707,
            title: `Trade between ${info[4]} and ${info[5]}`,
            description: 
            `<@${info[2].id}> is offering | ${info[6] && '✅' || '❌'}
            ${'`'}${(`${(info[8]['redeems']>0 && info[8]['redeems']+' Redeems\n' || '') +(info[8]['credits']>0 && info[8]['credits']+' Credits\n' || '')+ grabpokemonnames(onedata,info[8].poke) + ' '}`).slice(0, -2)}${' `'}
            <@${info[3].id}> is offering | ${info[7] && '✅' || '❌'}
            ${'`'}${(`${(info[9]['redeems']>0 && info[9]['redeems']+' Redeems\n' || '') +(info[9]['credits']>0 && info[9]['credits']+' Credits\n' || '')+ grabpokemonnames(twodata,info[9].poke) + ' '}`).slice(0, -2)}${' `'}`,
        }],components:[row]}
    },
    async updatemessage(client,channel){
        const data = require('../functions/data.js').provideclient(client)
        var onedata = data.grabdata(client.events[channel.id][2])
        var twodata = data.grabdata(client.events[channel.id][3])
        var newmsg = this.grabmessage(client.events[channel.id],onedata.poke,twodata.poke)
        try {
            console.log(client.events[channel.id][11].id)
            var oldmsg = await Promise.race([channel.messages.fetch(client.events[channel.id][11].id), timeoutPromise]);
            oldmsg.edit(newmsg)
        }catch(error){
            client.events[channel.id][11] = await channel.send(newmsg)
        }

    },
    dochecks(client,channel,user){
        if(client.events[channel.id]){
            client.events[channel.id][1] = Date.now()/1000
            }else{return 'There is no ongoing trade here!'}
            if(client.events[channel.id][0] != 'trade'){
                return 'There is no ongoing trade in this channel!'
            }
            if(client.events[channel.id][2] != user.id && client.events[channel.id][3] != user.id){
                return 'You arent apart of this trade!'
        }
        if(client.events[channel.id][3] == user.id){
            return 1
        }
        return 0
    },
    ready: async function(client,id,channel){
        const data = require('../functions/data.js').provideclient(client)
        var onedata = data.grabdata(client.events[channel.id][2])
        var twodata = data.grabdata(client.events[channel.id][3])
        if(client.events[channel.id][6+id]){client.events[channel.id][6+id] = false}else{client.events[channel.id][6+id] = true}
        await this.updatemessage(client,channel)
        if(client.events[channel.id][6] && client.events[channel.id][7]){
            //credits = function(client,user,creds){
            pokeutil.credits(client,client.events[channel.id][2],client.events[channel.id][8]['credits'] * -1)
            pokeutil.credits(client,client.events[channel.id][3],client.events[channel.id][9]['credits'] * -1)
            pokeutil.credits(client,client.events[channel.id][2],client.events[channel.id][9]['credits'])
            pokeutil.credits(client,client.events[channel.id][3],client.events[channel.id][8]['credits'])
            pokeutil.redeems(client,client.events[channel.id][2],client.events[channel.id][8]['redeems'] * -1)
            pokeutil.redeems(client,client.events[channel.id][3],client.events[channel.id][9]['redeems'] * -1)
            pokeutil.redeems(client,client.events[channel.id][2],client.events[channel.id][9]['redeems'])
            pokeutil.redeems(client,client.events[channel.id][3],client.events[channel.id][8]['redeems'])
            client.events[channel.id][9]['poke'].sort((a, b) => b - a)
            client.events[channel.id][8]['poke'].sort((a, b) => b - a)
            var index = 0
            
            while(index < client.events[channel.id][9]['poke'].length){
                console.log(client.events[channel.id][9].poke.length)
                data.addpokemon(client.events[channel.id][2],pokeutil.removepokemon(twodata,client.events[channel.id][9]['poke'][index]))
                index++
            }
            index = 0
            while(index < client.events[channel.id][8]['poke'].length){
                
                data.addpokemon(client.events[channel.id][3],pokeutil.removepokemon(onedata,client.events[channel.id][8]['poke'][index]))
                index++
            }
            pokeutil.statistic(client,client.events[channel.id][2],'trade')
            pokeutil.statistic(client,client.events[channel.id][3],'trade')
            channel.send("Trade completed!")
            delete client.events[channel.id]
        }
    },
    async execute(message,args,client){
        const data = require('../functions/data.js').provideclient(client)
        var checkings = this.dochecks(client,message.channel,message.author)
        if(typeof checkings === 'string'){
            message.channel.send(checkings)
            return
        }
        var id = 0
        if(client.events[message.channel.id][3] == message.author.id){
            id++
        }
        const casesplus = {
            'c': function(){
                var total = data.grabdata(message.author).info.credit
                args.splice(0,1)
                if(args[0] == 'all'){
                    return client.events[message.channel.id][8+id]['credits'] = 0
                }
                if(Number(args[0])+client.events[message.channel.id][8+id]['credits'] > total){
                    message.channel.send("You can't put in more credits than you have!")
                    return
                }
                if(Number(args[0]) < 0 || !Number.isFinite(Number(args[0]))){
                    message.channel.send('Invalid selection.')
                    return
                }
                client.events[message.channel.id][6] = false
                client.events[message.channel.id][7] = false
                console.log('added credits')
                client.events[message.channel.id][8+id]['credits'] += Number(args[0])
            },
            'r': function(){
                var total = data.grabdata(message.author).info.redeem
                args.splice(0,1)
                if(args[0] == 'all'){
                    return client.events[message.channel.id][8+id]['redeems'] = 0
                }
                if(Number(args[0])+client.events[message.channel.id][8+id]['redeems'] > total){
                    message.channel.send("You can't put in more redeems than you have!")
                    return
                }
                if(Number(args[0]) < 0 || !Number.isFinite(Number(args[0]))){
                    message.channel.send('Invalid selection.')
                    return
                }
                client.events[message.channel.id][6] = false
                client.events[message.channel.id][7] = false
                console.log('added redeems')
                client.events[message.channel.id][8+id]['redeems'] += Number(args[0])
            },
            't': function(){
                args.splice(0,1)
                var total = data.grabdata(message.author).poke
        
                var index = 0
                while(index < args.length){
                    args[index] = Number(args[index])
                    if(Number.isFinite(args[index]) && args[index] > 0){
                    var poke = pokeutil.findmonoffid(message.author,args[index],client)
                    args[index]--
                    if(poke && !client.events[message.channel.id][8+id]['poke'].includes(args[index])){
                        client.events[message.channel.id][8+id]['poke'].push(args[index])
                    }
                    }
                    index++
                }
                client.events[message.channel.id][6] = false
                client.events[message.channel.id][7] = false
                console.log('added mon')
            }
        }
        const casesminus = {
            'c': function(){
                var total = data.grabdata(message.author).info.credit
                args.splice(0,1)
                args[0] = Number(args[0])
                if(args[0] == 'all'){
                    return client.events[message.channel.id][8+id]['credits'] = 0
                }
                if(args[0] < 0 || !Number.isFinite(args[0])){
                    message.channel.send('Invalid selection.')
                    return
                }
                client.events[message.channel.id][8+id]['credits'] -= args[0]
                if(client.events[message.channel.id][8+id]['credits'] < 0){
                    client.events[message.channel.id][8+id]['credits'] = 0
                }
                client.events[message.channel.id][6] = false
                client.events[message.channel.id][7] = false
                console.log('removed credits')
            },
            'r': function(){
                var total = data.grabdata(message.author).info.redeem
                args.splice(0,1)
                args[0] = Number(args[0])
                if(args[0] == 'all'){
                    return client.events[message.channel.id][8+id]['redeems'] = 0
                }
                if(args[0] < 0 || !Number.isFinite(args[0])){
                    message.channel.send('Invalid selection.')
                    return
                }
                client.events[message.channel.id][8+id]['redeems'] -= args[0]
                if(client.events[message.channel.id][8+id]['redeems'] < 0){
                    client.events[message.channel.id][8+id]['redeems'] = 0
                }
                client.events[message.channel.id][6] = false
                client.events[message.channel.id][7] = false
                console.log('removed redeems')
            },
            't': function(){
                args.splice(0,1)
                var total = data.grabdata(message.author).poke
                var index = 0
                while(index < args.length){
                    args[index] = Number(args[index])-1
                    if(Number.isFinite(args[index]) && client.events[message.channel.id][8+id].poke.includes(args[index])){
                        client.events[message.channel.id][8+id].poke.splice(client.events[message.channel.id][8+id].poke.indexOf(args[index]),1)
                    }
                    index++
                }
                client.events[message.channel.id][6] = false
                client.events[message.channel.id][7] = false
                console.log('remove mon')
            }
        }
        const creditcases = ['credits','credit','c']
        const redeemcases = ['redeems','redeem','r']
        const pokecases = ['touhou','toho','t']
        switch (message.content.split(/ +/)[0]){
            case `th!offer`:
                if(redeemcases.includes(args[0])){
                    casesplus['r']()
                }
                if(creditcases.includes(args[0])){
                    casesplus['c']()
                }
                if(pokecases.includes(args[0])){
                    casesplus['t']()
                }
                break
            case `th!remove`:
                if(redeemcases.includes(args[0])){
                    casesplus['r']()
                }
                if(creditcases.includes(args[0])){
                    casesminus['c']()
                }
                if(pokecases.includes(args[0])){
                    casesminus['t']()
                }
                break
        }
        await this.updatemessage(client,message.channel)
    }
}
