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

const pokeutil = require('../functions/pokeutil.js')
const regions = ['Touhou 6', 'Touhou 7', 'Touhou 8', 'Touhou 9', 'Touhou 10', 'Touhou 11', 'Touhou 12', 'Touhou 13', 'Touhou 14', 'Touhou 15', 'Touhou 16', 'Touhou 17', 'Touhou 18', 'Touhou 19','the spin-off games', 'Touhou 1', 'Touhou 2', 'Touhou 3', 'Touhou 4', 'Touhou 5']
const color = [
    'Black',
    'Green',
    'Blue',
    'Purple',
    'Red',
    'Pink',
    'Gray',
    'White',
    'Yellow'
]
function getString(number) {
    const bCount = Math.min(Math.floor(number / 6),5);
    return "🔥".repeat(bCount)+(number < 30 && "◾".repeat(5-bCount) || '')
}

module.exports = {
    name: ['daily'],
    description: 'h',
    datarequired: true,
    execute(message,args,client){
        var data = require('../functions/data.js').provideclient(client).checkdata(message.author).info.daily
        const unixTime = (data[0]+86400000 - Date.now())/1000
        var hoursleft = Math.floor(unixTime/60/60)
        var minutesleft = Math.floor(unixTime/60 - (hoursleft*60))
        var desc = ''
        desc+= `**Current Streak** - ${data[2]}\n`
        desc+=`[${getString(data[2])}]\n`
        desc+='\n'
        var index = 0
        data = data[1]
        while(index < data.length){
            desc+= (index+1 + '. ' + pokeutil.getdailyline[data[index][0]](data[index]) + '\n')
            index++
        }
        const exampleEmbed = {
            color: 0xeb0707,
            author: {
                name: `Daily`,
                //icon_url: 'https://i.imgur.com/wSTFkRM.png',
                //url: 'https://discord.js.org',
            },
            description: desc,
            footer: {
                text: `Your daily resets in ${hoursleft} hours, ${minutesleft} minutes, and ${Math.floor(unixTime-(hoursleft*60*60)-(minutesleft*60))} seconds.`,
            },
            //thumbnail: {
            //    url: `https://cdn.discordapp.com/attachments/827801376141606912/909304212054224937/money-bag_1f4b0.png`,
            //},
        };
        
        message.channel.send({ embeds: [exampleEmbed] });
    }
}