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
const items = require('../modules/items.json')
const util = require('../functions/pokeutil.js')
module.exports = {
    "name": ["buy"],
    "description": 'h',
    "datarequired": true,
    execute(message, args, client) {
        var thearg = args[0].toLowerCase()
        const data = require('../functions/data.js').provideclient(client).grabdata(message.author).info
        if (items[thearg] && data.credit >= items[thearg].buy) {
            if (Number(args[1]) > 1) {
                data.credit = data.credit - items[thearg].buy * Number(args[1])
                util.inventory(client, message.author, thearg, Number(args[1]))
                message.channel.send(`Purchase successful. You spent ${items[thearg].buy * Number(args[1])} credits to buy ${Number(args[1]) > 1 && Math.round(args[1]) || ''} ${Number(args[1]) > 1 && items[thearg].name + 's' || items[thearg].name}`)
            } else if (!args[1] || args[1] == 1) {
                data.credit = data.credit - items[thearg].buy
                message.channel.send(`Purchase successful. You spent ${items[thearg].buy} credits to buy ${args[1] && Math.round(Number(args[1])) || 'a'} ${items[thearg].name}`)
                //if(data.inventory[thearg]){data.inventory[thearg] += 1} else {data.inventory[thearg] = 1}
                util.inventory(client, message.author, thearg, 1)
            } else if (!Number.isInteger(Number(args[1])) || Number(args[1]) < 0) {
                message.channel.send(`Invalid amount of items to buy.`)
            } else if (data.credit < items[thearg].buy) {
                message.channel.send("Insufficent funds! Get more credits by completing dailies.")
            }
            
        } else if (!items[thearg]) {
            message.channel.send("Invalid selection. Run `th!items` for a list of items.")
        } else if (data.credit < items[thearg].buy) {
            message.channel.send("Insufficent funds! Get more credits by completing dailies.")
        }
    }
}