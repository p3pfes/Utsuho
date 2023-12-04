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
const pokemod = require('../modules/pokemon.json')
const data = require('./data.js')
const pokeutil = require('./pokeutil.js')
const items = require(`../modules/items.json`)
const itemarr = ['udongun', 'gungnir', 'hakurouken']
function decidegender(mon) {
    if (pokemod[mon].maleRatio == -1) { return 'N' }
    var val = Math.floor(Math.random() * 1000)
    if (val > pokemod[mon].maleRatio * 1000) {
        return 'F'
    }
    return 'M'
}
function decideitem(){
    let itemchance = Math.floor(Math.random() * 100)
    if (itemchance == 1) {
        let i = Math.floor(Math.random() * itemarr.length)
        return itemarr[i]
    } else {
        return 
    }
}
const ShinyChance = 8192
const Natures = [
    "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
    "Bold", "Docile", "Relaxed", "Impish", "Lax",
    "Timid", "Hasty", "Serious", "Jolly", "Naive",
    "Modest", "Mild", "Quiet", "Bashful", "Rash",
    "Calm", "Gentle", "Sassy", "Careful", "Quirky"
]
const stats = ["hp", "atk", "def", "spa", "spd", "spe"]

exports.genmon = function (author, client, tab) {
    console.log(tab)
    const id = author.id
    if (!tab.lvl) {
        tab.lvl = Math.floor(Math.random() * 54) + 2
    }
    var chance = Math.floor(Math.random() * ShinyChance)
    var gender = decidegender(tab.mon)
    var pok = {
        mon: tab.mon,
        lvl: pokeutil.expgroup[pokemod[tab.mon].exp](tab.lvl),
        ot: id,
        date: Date.now(),
        item: decideitem()
    }
    if (tab.redeem) {
        pok.redeem = true
    }
    if (pok.mon == 'dudunsparce' && Math.floor(Math.random() * 5) == 1) {
        pok.mon = 'dudunsparcethreesegment'
    }
    if (pok.mon == 'maushold' && Math.floor(Math.random() * 100) == 1) {
        pok.mon = 'mausholdfour'
    }
    if (!pok.redeem && Math.floor(Math.random() * 500) == 1 && require('../chances.json').Worst[1].includes(pok.mon)) {
        pok.mon = 'ditto'
    }
    if (gender != 'N') {
        pok.gender = gender
    }
    //if (/*pokeutil.checkforshiny(tab.mon) &&*/ chance == 1) {
    //   pok.shiny = true
    //    console.log('SHINY GENERATED!!')
    //}
    pok.nature = Natures[Math.floor(Math.random() * Natures.length)]
    pok.ivs = [Math.floor(Math.random() * 31), Math.floor(Math.random() * 31), Math.floor(Math.random() * 31), Math.floor(Math.random() * 31), Math.floor(Math.random() * 31), Math.floor(Math.random() * 31)]

    console.log(pok)
    pokeutil.pokedexadd(client, author, pok.mon, pok.shiny)
    if (pokeutil.findclass(pok.mon)) {
        pokeutil.statistic(client, author, pokeutil.findclass(pok.mon).charAt(0) + 'caught')
        if (pok.shiny) {
            pokeutil.statistic(client, author, 's' + pokeutil.findclass(pok.mon).charAt(0) + 'caught')
        }
    }
    data.provideclient(client).addpokemon(author, pok)
    return pok
}

