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

module.exports = {
    name: ['sorter','sort'],        
    datarequired: true,
    noargs: true,
    execute(message,args,client){
        const plrd = require('../functions/data.js').provideclient(client).grabdata(message.author).info
        args = args.toLowerCase()
        if(!args){message.channel.send('Sorter set to id!'); delete plrd.sort; return}
        if(pokeutil.sorter[args]){
            message.channel.send('Sorter set to ' + args + '!')
            if(args=='id'){
                delete plrd.sort;
                return
            }
            plrd.sort = args
            return
        }
        message.channel.send('Invalid sorter.')
    }
}