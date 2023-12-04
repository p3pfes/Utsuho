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
const data = require('../functions/data.js')
const pokemon = require('../modules/pokemon.json')

module.exports = {
    name: ['remfav','removefavorite','removefavourite','remfavorite','remfavourite','removefav'],
    description: 'h',
    datarequired: true,
    noargs: true,
    execute(message,args,client){
        args = Number(args)-1
        if(!Number.isFinite(Number(args))){message.channel.send("You must specify a character by ID to remove to your favourites."); return}
        var plrd = data.provideclient(client).grabdata(message.author)
        if(!plrd.info.fav){message.channel.send("You have no character in your favourites."); return}
        if(plrd.poke[args]){
        if(!plrd.info.fav.includes(args)){
            message.channel.send('This character is not in your favourites!')
            return
        }
        plrd.info.fav.splice(plrd.info.fav.indexOf(args),1)
        if(plrd.info.fav.length == 0){
            delete plrd.info.fav
        }
        message.channel.send(`Removed your level ${pokeutil.getlevel(plrd.poke[args])} ${pokemon[plrd.poke[args].mon].name} from your favourites.`)
        return
        }
        message.channel.send('Invalid character selection.')
    }
}