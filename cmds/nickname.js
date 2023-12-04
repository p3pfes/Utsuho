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

const pokeutil = require('../functions/pokeutil.js')
module.exports = {
    name: ['nickname','nick'],
    description: 'h',
    noargs: true,
    datarequired:true,
    execute(message,args,client){
        const data = require('../functions/data.js').provideclient(client)
        const mon = pokeutil.findmonoffid(message.author,data.grabdata(message.author).info.select,client)
        if(args){
            if(args.length <= 30){
                mon.nickname = args
                message.channel.send(`Set your current characters's nickname to ${args}!`)   
            }else{
                message.channel.send("Nickname limit is 30 characters.")
            }
        }else{
            delete mon.nickname
            message.channel.send(`Reset your current character's nickname.`)
        }
    }

}