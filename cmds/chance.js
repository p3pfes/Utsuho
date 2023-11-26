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

const fs = require('fs')
const util = require('../functions/pokeutil.js')
module.exports = {
    name: [`chance`, `odds`],
    description: 'h',
    execute(message,args){
        if(!args[0]){message.channel.send('You must specify a character'); return} //if no argument, ends it right there
        var shiny = 1 //shiny odds to be used in math. if it isnt a shiny, itll stay as 1 and thus have no effect on the final chance calculation
        var mon = args[0] //the pokemon is the first argument, unless shiny
        //if((args[0]) == 'Shiny'){ //checks if the message specifies shiny
        //    mon = args[1] //if message specifies shiny, set pokemon to next argument
        //    shiny = 1/8192 //since the messages does specify shiny, it sets the odds to be proper shiny odds so the calculation can factor it in
        //}
        const name = util.checkforpokemonbyname(mon)
        const chances = JSON.parse(fs.readFileSync('./chances.json', 'utf8'))
        var bigchance = 0 //soon to be the combined odds of all categories
        var moncat = '' //pokemon category
        Object.keys(chances).forEach(function(categories){
           bigchance += chances[categories][0] //adds the chances of the categories to one another
            chances[categories][1].forEach(function(pokemon){
                if(pokemon == name[0]){moncat = categories} //if finds pokemon in category, sets category (moncat) to the one it found
            })
        })
        if(!moncat){message.channel.send('Invalid character.'); return} //error handling for pokemon that arent in yet or stuff that doesnt exist
        var bignumber = Math.round((shiny*(chances[moncat][0]/bigchance)*(1/chances[moncat][1].length))*100*100000000000000)/100000000000000 //shiny chance (if shiny) * the odds for its category against all the other categories * the odds for it to be picked within its category * 100 (percentage). the big numbers at the end are for providing accurate percentages
        message.channel.send(`${name[1]}'s chance to spawn is ${bignumber}%`)
    }
}