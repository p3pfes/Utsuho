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
const discord = require('discord.js')
const pokemon = require('../modules/pokemon.json')
const st = { hp: 'HP:', atk: 'Attack:', def: 'Defense:', spa: 'Sp. Attack:', spd: 'Sp. Defense:', spe: 'Speed:' }
var regions = {
    Kanto: 'Kantonian',
    Johto: 'Johtonian',
    Hoenn: 'Hoennian',
    Sinnoh: "Sinnohian",
    Unova: "Unovan",
    Kalos: "Kalosian",
    Alola: "Alolan",
    Galar: 'Galarian',
    Hisui: 'Hisuian',
    Paldea: "Paldean",
    pc98: "pc98",
    ex: "ex",
    2: "2"
}
const allowedforms = ['Galar', 'Alola', 'Black', 'Paldea', 'Hisui', 'White', 'Therian', 'Origin', 'ex', 'pc98', '2']
module.exports = {
    name: ['tohoinfo', 'tohoinf', 'ti'],
    description: 'h',
    noargs: true,
    execute(message, content, client) {
        var found = false
        var shiny = false
        const oldcontent = content
        content = content.toLowerCase()
        if (content.split(' ')[0] == 'shiny') {
            shiny = true
            content = content.split(' ')
            content.shift()
            content = content.toString().replace(',', ' ')
        }
        Object.keys(pokemon).forEach(function (monno, monName) {
            var mon = pokeutil.pokenamechecker(content, monno)
            if (mon && mon[0]) {
                mon = function () {
                    let i = 0;
                    while (i < 4) {
                        if (mon[1][i] && content == mon[1][i].toLowerCase()) {
                            return mon[0]
                        }
                        i++;
                    }
                    return undefined
                }()
            }
            if (pokemon[monno].num == content) {
                mon = monno
            }

            if (mon && ((pokemon[monno].forme && allowedforms.includes(pokemon[monno].forme)) || !pokemon[monno].forme)) {
                //var spr = pokeutil.obtainsprite({mon: mon, shiny: shiny})
                mon = pokemon[mon]
                var spr = pokeutil.obtainsprite({ mon: mon, shiny: shiny })
                if (mon.sprite == "-3.png" || mon.sprite == "-2.png" || mon.sprite == "-1.png") {
                    message.channel.send('No!')
                    found = true
                    return
                }
                found = true
                var desc = `**${(shiny && "⭐ ") || ''}Info on ${mon.name}**`
                desc += `\n**Color:** ${mon.color} ${pokeutil.coloricon[mon.color]}\n**Base stats:**\n`
                Object.keys(mon.baseStats).forEach(function (stat) {
                    desc += `**${st[stat]}** ${mon.baseStats[stat]}\n`
                })
                const filly = new discord.AttachmentBuilder(spr[0])
                const exampleEmbed = {
                    color: 0xeb0707,
                    author: {
                        name: 'Character Info',
                    },
                    description: desc,
                    image: {
                        url: `attachment://${spr[1]}`,
                    },
                };

                message.channel.send({ embeds: [exampleEmbed], files: [filly] });
            }
        })
        if (!found) {
            message.channel.send(`No character by that name found.`);
        }

    }
}
