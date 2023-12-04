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
const pokemon = require('../modules/pokemon.json')
const allowedforms = ["PC98"]
var disallowedmons = ['dudunsparcethreesegment','mausholdfour']
module.exports = {
    name: ['redeem'],
    description: 'h',
    noargs: true,
    datarequired:true,
    execute(message,content,client) {
        var found = false
        var missing = true
        var redeems = pokeutil.redeems(client,message.author,0)
        if(redeems==0){
            message.channel.send('You need a redeem to use this command! Do daily quests to earn them!')
            return
        }
        content=content.toLowerCase()
        Object.keys(pokemon).forEach(function(monno, monName){
            var mon = pokeutil.pokenamechecker(content,monno)
            if(mon && mon[0]){
                mon = function(){
                    let i = 0;
                    while (i < 4) {
                        if(mon[1][i] && content == mon[1][i].toLowerCase()){
                            return mon[0]
                        }
                        i++;
                    }
                    return undefined
                }()
            }
            if(pokemon[monno].num == content){
                mon = monno
            }
            
            if(mon && (!disallowedmons.includes(mon)) && ((pokemon[monno].forme && allowedforms.includes(pokemon[monno].forme)) || !pokemon[monno].forme)){
                if(pokemon[mon].num < 0){
                    message.channel.send('Stop.')
                    found = true
                    return
                }
                found = true
                pokeutil.redeems(client,message.author,-1)
                client.genmon(message,mon,null,true)
            }})
        if(!found){
            if(content.length == 0){
                message.channel.send(`You must specify a character to redeem!`);
                return
            }
            message.channel.send(`No character by that name found.`);
        }
        
    }
}
