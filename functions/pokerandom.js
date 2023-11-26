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

const { messageLink, Message } = require('discord.js')
const pokemon = require('../modules/pokemon.json')
const fs = require('fs')
const categories = {
    Worst: [5000, []],
    Low: [2100, []],
    LowerAverage: [1455, []],
    UpperAverage: [600, []],
    High: [350, []],
    Best: [4, []],
}

Object.keys(pokemon).forEach(function (mon, monName) {
    //if(pokemon[mon].num >= 1010){return}
    var s = 0
    Object.keys(pokemon[mon].baseStats).forEach(function (StatName) {
        s = s + pokemon[mon].baseStats[StatName]
    })


    if (s <= 550) {
        categories.Worst[1].push(mon)
        console.log(categories.Worst[1], "Worst")
    } else if (s < 575) {
        categories.Low[1].push(mon)
        console.log(categories.Low[1], "Low")
    } else if (s < 600) {
        categories.LowerAverage[1].push(mon)
        console.log(categories.LowerAverage[1], "LowerAverage")
    } else if(s < 630) {
        categories.UpperAverage[1].push(mon)
        console.log(categories.UpperAverage[1], "UpperAverage")
    } else if (s < 680) {
        categories.High[1].push(mon)
        console.log(categories.High[1], "High")
    }
    else {
        categories.Best[1].push(mon)
        console.log(categories.Best[1], "Best")
    }
})

var am = 0

Object.keys(categories).forEach(function (cat) {
    am = am + categories[cat][0]
})

if (!fs.existsSync('./chances.json')) {
    fs.appendFile('./chances.json', JSON.stringify(categories), function (err) {
        if (err) throw err;
        console.log('saved chances!');
    });
}
exports.pickmon = function pickmon() {
    var lastone = 0
    const rando = Math.floor(Math.random() * am)
    var a = 0
    var monName
    //var cos
    Object.keys(categories).forEach(function (cat) {
        a = a + categories[cat][0]
        if (rando >= lastone && rando <= a) {
            monName = categories[cat][1][Math.floor(Math.random() * categories[cat][1].length)]        
        }
        lastone = a
    })
    if (monName == `funnyhat` || monName == `monkey` || monName == `afuckingstone` || pokemon[monName].forme == "2") {
        monName = `cirno`
    }

    /*if(!cos){
        cos = monName
    }*/
    return monName//,cos
}
