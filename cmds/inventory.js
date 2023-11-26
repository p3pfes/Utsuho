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
    'name': ['inv', 'inventory'],
    'description': 'h',
    'datarequired': true,

    execute(message, args, client) {
        const data = require('../functions/data.js').provideclient(client).grabdata(message.author).info
        let desc = ''
        if (!data.inventory || Object.keys(data.inventory).length === 0) {
            message.channel.send("Inventory is empty.")
            if (!data.inventory){
                data.inventory = {}
            }
                return
        }
        Object.keys(items).forEach(function (index) {
            if (data.inventory[index.toLowerCase()] > 0) {
                desc += `\n ${data.inventory[index.toLowerCase()]} ${data.inventory[index.toLowerCase()] > 1 && items[index].name + 's' || items[index].name} **~** Use on ${pokemodule[items[index].mega[0]].name} **~** Selling Price: ${items[index].buy * 0.9}`
            }

        })
        message.channel.send({
            embeds: [{
                color: 0xeb0707,
                title: "**Inventory List**",
                description: desc
            }]
        })
    }
}