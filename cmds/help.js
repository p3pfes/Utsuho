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
const util = require('../functions/pokeutil.js');
module.exports = {
    name: ['help', 'h'],
    description: 'h',


    execute(message, args) {
        switch (args[0]) {
            case "trade":
                message.channel.send({
                    embeds: [{
                        color: 0xeb0707,
                        title: "Utsuho Trade Commands Help",
                        description: "**\nth!ready \nth!remove [c, credits, credit, r, redeem, redeems, t, touhou, th] \nth!offer [c, credits, credit, r, redeems, redeem, t, touhou, th] \nth!cancel **"
                    }]
                })
                return
            case "touhou":
                message.channel.send({
                    embeds: [{
                        color: 0xeb0707,
                        title: 'Utsuho Touhou Character Commands',
                        description: '\nTo start, there are a variation of the command that can be used (**th!t, th!toho, th!th, th!touhou**) to execute this command. \n There are also sorts, to sort your characters depending on IVs. This can be done by running **th!sort [SORTER]**. Here are the list of sorters: **\nivhighest, ivh, iv** (for sorting by highest to lowest) **\nivlowest, iv** (for sorting lowest to highest) \n id (for sorting from the first to latest character obtained)'
                    }]
                })
                return
            case "info":
                message.channel.send({
                    embeds: [{
                        color: 0xeb0707,
                        title: 'Utsuho Info Commands',
                        description: '\nThere are many info commands in utsuho, for example: \n \n**th!shortinfo (ID BASED) \nth!techinfo (ID BASED) \nth!tohoinfo (CHARACTER NAME BASED) \nth!info (ID BASED)** \n \n If you wish to have detailed viewing of stats, run the command **th!detailed**.',
                        footer: {
                            text: 'For clarification, ID based means it is based on the id of a character that you have caught.'
                        }
                    }]
                })
                return

            case "misc":
                message.channel.send({
                    embeds: [{
                        color: 0xeb0707,
                        title: 'Utsuho Misc Commands',
                        description: '**\nth!select [Character ID] \nth!redeem [Character name] \nth!bal \nth!chance [Character name] \nth!nickname**'
                    }]
                })
                return
            default:
                message.channel.send({
                    embeds: [{
                        color: 0xeb0707,
                        title: 'Utsuho Help List',
                        description: `**\nth!help info \nth!help touhou\nth!help trade \nth!help misc**`,
                        footer: {
                            text: 'Usage: If you need help with trade commands, you do `th!help trade`'
                        }
                    }]

                })
                return
        }
    }
}