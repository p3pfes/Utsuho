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
const pokemon = require('../modules/pokemon.json')
module.exports = {
    name: ['release'],
    description: 'h',
    datarequired: true,
    noargs: true,
    eventlocked:true,
    execute(message,args,client){
        const data = require('../functions/data.js').provideclient(client)
        const plrdat = data.grabdata(message.author)
        const mon = pokeutil.findmonoffid(message.author,args,client)
        if(plrdat.poke.length == 1){
            message.channel.send("You must have atleast 1 Touhou character with you!")
            return
        }
        if(mon){
            if(plrdat.info.fav && plrdat.info.fav.includes(args-1)){
                message.channel.send(`You cannot release a favourited character!`)
                return
            }
            message.channel.send(`You have released your level ${pokeutil.getlevel(mon)} ${mon.nickname || pokemon[mon.mon].name}.`)
            pokeutil.removepokemon(plrdat,args-1)
            return
        }
        message.channel.send('Invalid selection')
    }
}
