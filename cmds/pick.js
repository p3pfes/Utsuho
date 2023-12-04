/*
    Meloetta - A Discord bot to play Character
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

const pokeutil = require('../functions/pokeutil.js');
const generate = require('../functions/pokegenerate.js').genmon
const pokemodule = require('../modules/pokemon.json')
const validmons = ['sunny', 'luna', 'star']
module.exports = {
    name: ['pick'],
    description: 'h',
    noargs:true,
    
    
    execute(message,args,client){
        const data = require('../functions/data.js').provideclient(client)
        if(data.checkdata(message.author)){
            message.channel.send('You have already begun your adventure!')
        }else if(!args){
            message.channel.send('You must specify a character to pick!')
        }else{
            var sel = false
            for(const starter of validmons){
                var mon = pokeutil.pokenamechecker(args,starter)
                if(mon){
                    sel = mon[0]
                }
            }
            if(args=='random'){
                sel = validmons[Math.floor(Math.random() * validmons.length)]
            }
            if(sel){
                console.log('making data')
                data.makenewdata(message.author)
                generate(message.author,client,{mon: sel, lvl: 5})
                message.channel.send('Congratulations! ' + pokemodule[sel].name + ' is your first character! Type `th!info` to see it!')
                return
            }else{
                message.channel.send(`That's not a valid character!`)
                return
            }
            message.channel.send(`You can't pick that character!`)

        }
    }
}