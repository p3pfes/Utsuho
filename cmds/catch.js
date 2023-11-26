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

const pokemodule = require('../modules/pokemon.json')
const pokeutil = require('../functions/pokeutil.js')
const generate = require('../functions/pokegenerate.js').genmon
const daily = require('../functions/generatedaily.js').caughtpokemoncheck
const items = require('../modules/items.json')
module.exports = {
    name: ['catch', 'c'],
    description: 'h',
    datarequired: true,
    noargs: true,
    execute(message, args, client, istrying) {
        var stuff = client.activeCaptures[message.channel.id]
        if (!stuff /*|| (stuff[2][2] instanceof Promise)*/) { return }
        var index = 0
        var nocatch = true
        while (index < stuff.length) {
            var mon = stuff[index]
            if (mon) {
                mon = mon[0]
                var namecheck = pokeutil.pokenamechecker(args, mon)
                if (namecheck && namecheck[0]) {
                    const genmonned = generate(message.author, client, { mon: mon, redeem: stuff[index][3] })
                    client.activeCaptures[message.channel.id].splice(index, 1)
                    if (client.activeCaptures[message.channel.id].length == 0) {
                        delete client.activeCaptures[message.channel.id]
                    }

                    message.channel.send(`Congratulations <@${message.author.id}>! You caught a level ${pokeutil.getlevel(genmonned)} ${genmonned.shiny && "⭐ Shiny " || ''}${pokemodule[genmonned.mon]['name']} (${pokeutil.calcpokemonivpercent(genmonned)}%) ${genmonned.item && "with an item" || ''}!` + daily(client, message.author, mon))
                    nocatch = false
                    break
                }
            }

            index++
        }
        if (!istrying && nocatch) {
            message.channel.send("This is the wrong character!")
        }
    }
}