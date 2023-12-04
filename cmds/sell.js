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

const items = require(`../modules/items.json`)
const pokemodule = require(`../modules/pokemon.json`)
const util = require(`../functions/pokeutil.js`)

module.exports = {
    "name": ['sell'],
    "description": 'h',
    "datarequired": true,

    execute(message, args, client) {
        foundSellItem = false
        var infodat = require('../functions/data.js').provideclient(client).grabdata(message.author).info
        if (args[0]) {
            Object.keys(infodat.inventory).forEach(function (index) {
                if (!foundSellItem) {
                    console.log(index.toLowerCase())
                    if (infodat.inventory[index.toLowerCase()] && items[args[0].toLowerCase()] && items[index.toLowerCase()].name == items[args[0].toLowerCase()].name) {
                        if (!args[1]) { args[1] = 1 }
                        message.channel.send(`Sold ${Number(args[1]) > 1 && args[1] || 'a'} ${args[1] > 1 && items[args[0].toLowerCase()].name + 's' || items[args[0].toLowerCase()].name} for ${args[1] > 1 && (items[args[0].toLowerCase()].buy * args[1]) * 0.9 || items[args[0].toLowerCase()].buy * 0.9} credits.`)
                        infodat.credit = infodat.credit + (items[args[0]].buy * 0.9)
                        if (Number(args[1]) > infodat.inventory[index.toLowerCase()] || infodat.inventory[index.toLowerCase()] < 1) {
                            console.log(infodat.inventory[index.toLowerCase()])
                            delete infodat.inventory[index.toLowerCase()]
                            foundSellItem = true
                        }
                        infodat.inventory[index.toLowerCase()] = infodat.inventory[index.toLowerCase()] - Number(args[1])
    
                        if(infodat.inventory[index.toLowerCase()] <= 0) {delete infodat.inventory[index.toLowerCase()]}
                        if(Object.keys(infodat.inventory).length === 0) {delete infodat.inventory}
                        foundSellItem = true
                        return
                    } else if (items[args[0].toLowerCase()] && !infodat.inventory[args[0].toLowerCase()]) {
                        message.channel.send(`Item does not exist in your inventory.`)
                        foundSellItem = true
                    } else {
                        message.channel.send(`Invalid selection of item.`)
                        foundSellItem = true
                    }
                }
            })

        }
    }
}