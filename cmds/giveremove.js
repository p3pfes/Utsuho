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

module.exports = {
    "name": ["item"],
    "description": 'h',
    "datarequired": true,

    execute(message, args, client) {
        let int = Number(args[1]) - 1
        var argusm = int.toString()
        var data = require('../functions/data.js').provideclient(client).grabdata(message.author).poke
        
        var infodat = require('../functions/data.js').provideclient(client).grabdata(message.author).info
        if (args[0] == "give" && items[args[2].toLowerCase()]) {
            let thearg = args[2].toLowerCase() 
            let foundItem = false
            let bool;
            Object.keys(infodat.inventory).forEach(function (index) {
                if (!foundItem && index == thearg) {
                    if (data[argusm].item) {
                        if (items[thearg].name == items[index].name) {
                            
                            bool = "maybe"
                        } else {
                            bool = "yeah"
                        }
                    }
                    switch(bool) {
                        case "maybe":
                            message.channel.send(`Replaced ${pokemodule[data[argusm].mon].name}'s ${items[data[argusm].item].name} with ${items[thearg].name}.`)
                            console.log(data[argusm].item, index)
                            if(infodat.inventory[data[argusm].item] > 0){infodat.inventory[data[argusm].item] += 1} else {infodat.inventory[data[argusm].item] = 1}
                            delete data[argusm].item
                            data[argusm].item = thearg
                            infodat.inventory[index] -= 1
                            if(infodat.inventory[index] <= 0) {delete infodat.inventory[index]}
                            foundItem = true
                            return                           
                        case "yeah":
                            message.channel.send(`Item is not in your inventory.`)
                            foundItem = true
                            return
                        default:
                            data[argusm].item = thearg
                            message.channel.send(`Gave ${items[thearg].name} to ${pokemodule[data[argusm].mon].name}`)
                            infodat.inventory[index] -= 1
                            if(infodat.inventory[index] <= 0) {delete infodat.inventory[index]}
                            foundItem = true
                            return
                    }
                }
            })
            if (!foundItem) {
                message.channel.send(`Item is not in your inventory.`)
            }
        } else if (args[0] == "remove") {
            if (data[argusm]) {
                if (!data[argusm].item) {
                    message.channel.send('No held item on this character.')
                    return
                } else if (data[argusm].item) {
                    if (!infodat.inventory[data[argusm].item]) {
                        infodat.inventory[data[argusm].item] = 1
                    } else{
                        infodat.inventory[data[argusm].item] += 1
                    }
                    
                    delete data[argusm].item
                    message.channel.send('Item removed.')
                    return
                }
            }
        } else {
            message.channel.send("Invalid selection.")
            return
        }
    }
}