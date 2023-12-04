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

var pokeutil = require('../functions/pokeutil.js')
module.exports = {
    name: ['bal','balance','b','credits'],
    description: 'h',
    datarequired: true,
    execute(message,args,client){
        var credit = pokeutil.credits(client,message.author)
        var redeem = pokeutil.redeems(client,message.author)
        const exampleEmbed = {
            color: 0xeb0707,
            author: {
                name: `${message.author.username}'s balance:`,
            },
            description: `You currently have ${credit} 🪙 credits and ${redeem} 🧧 redeems.`,
            thumbnail: {
                url: `https://cdn.discordapp.com/attachments/827801376141606912/909304212054224937/money-bag_1f4b0.png`,
            },
        };
        
        message.channel.send({ embeds: [exampleEmbed] });
        

    }
}