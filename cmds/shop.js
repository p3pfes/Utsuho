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
const pokemon = require('../modules/pokemon.json')
const items = require('../modules/items.json')
const util =  require('../functions/pokeutil.js')
itemarr = []
let desc
module.exports = {
    name: ['shop'],
    description: 'h',
    datarequired: true,
    execute(message, args, client) {
        let desc = ''
        Object.keys(items).forEach(function(item){          
            desc+= `${items[item].name} **~** Buy for ${items[item].buy} **~** For use on ${pokemon[items[item].mega[0]].name} \n`
        })
        message.channel.send({
            embeds: [{
                color: 0xeb0707,
                title: 'Kourindo Item Shop',
                description: desc
            }]
        })
    }
}