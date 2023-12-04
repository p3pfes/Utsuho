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

const { BurstHandlerMajorIdKey, RoleSelectMenuInteraction } = require('discord.js')
const pokemon = require('../modules/pokemon.json')
const items = require('../modules/items.json')
const spritefol = './2hu'
var stagerand = Math.floor(Math.random() * 5) + 1
const fs = require('fs')
const { name } = require('../cmds/catch')
exports.types = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water', 'Fire']
exports.typeicons = {
    Bug: '<:Bug:936476623107158057>',
    Dark: '<:Dark:936476632053612615>',
    Dragon: '<:Dragon:936476640060534864>',
    Electric: '<:Electric:936476646750441522>',
    Fairy: '<:Fairy:936476653083832370>',
    Fighting: '<:Fighting:936476659845062706>',
    Flying: '<:Flying:936476666300084244>',
    Ghost: '<:Ghost:936476672805466123>',
    Grass: '<:Grass:936476682200686622>',
    Ground: '<:Ground:936476688852873236>',
    Ice: '<:Ice:936476710264799242>',
    Normal: '<:Normal:936476717751627777>',
    Poison: '<:Poison:936476727620825181>',
    Psychic: '<:Psychic:936476735233482762>',
    Rock: '<:Rock:936476741927591998>',
    Steel: '<:Steel:936476748693008466>',
    Water: '<:Water:936476756351791115>',
    Fire: '<:Fire:1138644367360413716>'

}
exports.prefix = {
    prefix: function () {
        return "th!"
    }
}
exports.gettime = function(){
    return Math.round(Date.now() / 1000)
}
exports.expgroup = {
    fast: function (lvl) {
        return Math.floor(lvl ** 3 * 4 / 5)
    },
    mediumfast: function (lvl) {
        return Math.floor(lvl ** 3)
    },
    mediumslow: function (lvl) {
        return Math.floor(lvl ** 3 * 6 / 5 - lvl ** 2 * 15 + 100 * lvl - 140)
    },
    slow: function (lvl) {
        return Math.floor(lvl ** 3 * 5 / 4)
    },
    fluctuating: function (lvl) {
        if (lvl < 15) {
            lvl = Math.floor((Math.floor((lvl + 1) / 3) + 24) * lvl ** 3 / 50)
        } else if (lvl < 36) {
            lvl = Math.floor(((lvl + 14) * lvl ** 3) / 50)
        } else {
            lvl = Math.floor((lvl ** 3) * (Math.floor(lvl / 2) + 32) / 50)
        }
        return lvl
    },
    erratic: function (lvl) {
        if (lvl < 50) {
            return Math.floor(lvl ** 3 * (100 - lvl) / 50)
        } else if (lvl < 68) {
            return Math.floor(lvl ** 3 * (150 - lvl) / 100)
        } else if (lvl < 98) {
            return Math.floor(lvl ** 3 * Math.floor((1911 - (10 * lvl)) / 3) / 500)
        } else {
            return Math.floor(lvl ** 3 * (160 - lvl) / 100)
        }
    }
}
exports.sorter = {
    'ivl': function (list) {
        var index = 0
        var newlist = []
        while (index < list.length) {
            var ivval = list[index][0].ivs.reduce((partialSum, a) => partialSum + a, 0)
            if (!newlist[ivval]) {
                newlist[ivval] = []
            }
            newlist[ivval].push(list[index])
            index++
        }
        index = 0
        var newerlist = []
        while (index < newlist.length) {
            if (newlist[index]) {
                var indextwo = 0
                while (indextwo < newlist[index].length) {
                    newerlist.push(newlist[index][indextwo])
                    indextwo++
                }
            }
            index++
        }
        return newerlist
    },
    'ivh': function (list) {
        var index = 0
        var newlist = []
        while (index < list.length) {
            var ivval = list[index][0].ivs.reduce((partialSum, a) => partialSum + a, 0)
            if (!newlist[ivval]) {
                newlist[ivval] = []
            }
            newlist[ivval].push(list[index])
            index++
        }
        index = newlist.length
        var newerlist = []
        while (index > 0) {
            if (newlist[index]) {
                var indextwo = 0
                while (indextwo < newlist[index].length) {
                    newerlist.push(newlist[index][indextwo])
                    indextwo++
                }
            }
            index--
        }
        return newerlist
    },
    'ivlowest': function (list) {
        return this.ivl(list)
    },
    'ivhighest': function (list) {
        return this.ivh(list)
    },
    'iv': function (list) {
        return this.ivh(list)
    },
    'id': true
}
exports.credits = function (client, user, creds) {
    if (!creds) { creds = 0 }
    const data = require('../functions/data.js').provideclient(client).grabdata(user).info
    if (!data.credit) {
        data.credit = 0
    }
    data.credit += creds
    if (data.credit <= 0) {
        delete data.credit
    }
    return (data.credit || 0)
}
exports.inventory = function(client,user,item,am){
    if(!item){return}
    if(!am){am = 0}
    let return0;
    const data = require('../functions/data.js').provideclient(client).grabdata(user).info
    if(!data.inventory){
        data.inventory = {}
    }
    if(!data.inventory[item]){
        data.inventory[item] = am
    }else{
        data.inventory[item] += am
    }
    if(data.inventory.item < 1){
        delete data.inventory[item]
        return0 = true
    }
    if(Object.keys(data.inventory).length === 0){
        delete data.inventory
        return0 = true
    }
    if (return0){return 0}
    return data.inventory[item]
}
exports.shopstuff = function (itemname) {
    let theitem;
    let itemName;
    Object.keys(items).forEach(function (itemb) {
        if (items[itemb].name == itemname) {
            theitem = items[itemb]
            itemName = itemname
            return [itemName, itemname]
        }

    })
}
exports.redeems = function (client, user, creds) {
    if (!creds) { creds = 0 }
    const data = require('../functions/data.js').provideclient(client).grabdata(user).info
    if (!data.redeem) {
        data.redeem = 0
    }
    data.redeem += creds
    if (data.redeem <= 0) {
        delete data.redeem
    }
    return (data.redeem || 0)
}
exports.calcpokemonivpercent = function (poke) {
    const mon = pokemon[poke.mon]
    var num = 0
    var i = 0
    while (i < 6) {
        num += poke.ivs[i]
        i++
    }
    return Math.floor(10000 * (num / 186)) / 100
}
const color = [
    'Black',
    'Green',
    'Blue',
    'Purple',
    'Red',
    'Pink',
    'Gray',
    'White',
    'Yellow',
    'Brown'
]
exports.coloricon = {
    Black: '⚫',
    Green: '🟢',
    Blue: '🔵',
    Purple: '🟣',
    Red: '🔴',
    Pink: '',
    Gray: '',
    White: '⚪',
    Yellow: '🟡',
    Brown: '🟤',
}
exports.colortohex = {
    Blue: 0x0000FF,
    Black: 0x000000,
    Green: 0x00FF00,
    Purple: 0x800080,
    Red: 0xFF0000,
    White: 0xFFFFFF,
    Yellow: 0xFFFF00,
    Brown: 0xA52A2A
}
const regions = ['Touhou 6', 'Touhou 7', 'Touhou 8', 'Touhou 9', 'Touhou 10', 'Touhou 11', 'Touhou 12', 'Touhou 13', 'Touhou 14', 'Touhou 15', 'Touhou 16', 'Touhou 17', 'Touhou 18', 'Touhou 19', 'the spin-off games', 'Touhou 1', 'Touhou 2', 'Touhou 3', 'Touhou 4', 'Touhou 5',]
exports.getdailyline = {
    'catchcolor': function (thing) {
        return `Catch **${thing[4]} ${color[thing[5]]}** ${exports.coloricon[color[thing[5]]]} character(s) for **${thing[1]}** credits. **(${thing[3]}/${thing[4]})** ${thing[2] && "✅" || "❌"}`
    },
    'catchregion': function (thing) {
        return `Catch **${thing[4]}** character(s) from **${regions[thing[5]]}** for **${thing[1]}** credits. **(${thing[3]}/${thing[4]})** ${thing[2] && "✅" || "❌"}`
    },
    'catchamount': function (thing) {
        return `Catch **${thing[4]}** character(s) for **${thing[1]}** credits. **(${thing[3]}/${thing[4]})** ${thing[2] && "✅" || "❌"}`
    },
}


exports.specialmons = {
    "legendaries": ["articuno", "articunogalar", "zapdos", "zapdosgalar", "moltres", "moltresgalar", "mewtwo", "mewtwomegax", "mewtwomegay", "raikou", "entei", "suicune", "lugia", "hooh", "regirock", "regice", "registeel", "latias", "latiasmega", "latios", "latiosmega", "kyogre", "kyogreprimal", "groudon", "groudonprimal", "rayquaza", "rayquazamega", "uxie", "mesprit", "azelf", "dialga", "dialgaorigin", "palkia", "palkiaorigin", "heatran", "regigigas", "giratina", "giratinaorigin", "cresselia", "cobalion", "terrakion", "virizion", "tornadus", "tornadustherian", "thundurus", "thundurustherian", "reshiram", "zekrom", "landorus", "landorustherian", "kyurem", "kyuremblack", "kyuremwhite", "xerneas", "xerneasneutral", "yveltal", "zygarde", "zygarde10", "zygardecomplete", "typenull", "silvally", "silvallybug", "silvallydark", "silvallydragon", "silvallyelectric", "silvallyfairy", "silvallyfighting", "silvallyfire", "silvallyflying", "silvallyghost", "silvallygrass", "silvallyground", "silvallyice", "silvallypoison", "silvallypsychic", "silvallyrock", "silvallysteel", "silvallywater", "tapukoko", "tapulele", "tapubulu", "tapufini", "cosmog", "cosmoem", "solgaleo", "lunala", "necrozma", "necrozmaduskmane", "necrozmadawnwings", "necrozmaultra", "zacian", "zaciancrowned", "zamazenta", "zamazentacrowned", "eternatus", "eternatuseternamax", "kubfu", "urshifu", "urshifurapidstrike", "urshifugmax", "urshifurapidstrikegmax", "regieleki", "regidrago", "glastrier", "spectrier", "calyrex", "calyrexice", "calyrexshadow", "enamorus", "enamorustherian", "wochien", "chienpao", "tinglu", "chiyu", "koraidon", "miraidon"],
    "mythical": ['mew', 'celebi', 'jirachi', 'deoxys', 'deoxysattack', 'deoxysspeed', 'deoxysdefense', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus', 'victini', 'keldeo', 'keldeoresolute', 'meloetta', 'meloettapirouette', 'genesect', 'genesectdouse', 'genesectshock', 'genesectburn', 'genesectchill', 'diancie', 'dianciemega', 'hoopa', 'hoopaunbound', 'volcanion', 'magearna', 'marshaodw', 'zeraora', 'meltan', 'melmetal', 'zarude', 'zarudedada'],
    "paradox": ["greattusk", "screamtail", "brutebonnet", "fluttermane", "slitherwing", "sandyshocks", "irontreads", "ironbundle", "ironhands", "ironjugulis", "ironmoth", "ironthorns", "roaringmoon", "ironvaliant", "walkingwake", "ironleaves"],
    "ub": ["nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana", "guzzlord", "poipole", "naganadel", "stakataka", "blacephalon"]
}

exports.finduserinevent = function (client, user1, user2) {
    var find = []
    Object.keys(client.events).forEach(function (ev) {
        if (client.events[ev][0] == 'trade') {
            var id1 = client.events[ev][2].id
            var id2 = client.events[ev][3].id
            if (id1 == user1 || id2 == user1) {
                find.push(ev)
            }
            if (user2 && (id1 == user2 || id2 == user2)) {
                find.push(ev)
            }
        }
    })
    if (find.length == 0) { return }
    return find
}
exports.checkforpokemonbyname = function (name, rname) {
    var yesname = false
    var rname = false
    Object.keys(pokemon).forEach(function (nam, mon) {
        if (name == nam) {
            yesname = name
            rname = pokemon[yesname].name

        }
    })
    return [yesname, rname]
}

exports.findmonoffid = function (author, id, client) {
    const data = require('../functions/data.js').provideclient(client).grabdata(author).poke
    if (id <= data.length) { ; return data[id - 1] }
}
exports.finditemoffname = function(author, args, client) {
    const infodat = require('../functions/data.js').provideclient(client).grabdata(author).info
    foundItem = false
    infodat.inventory.forEach(function() {
        if (!foundItem && items[args].name.toLowerCase() == infodat.inventory[index].name.toLowerCase()) {
                return infodat.inventory[index]
        }
    })
}
exports.obtainsprite = function (poke, species) {
    if (!species) { species = poke }
    //console.log(species)
    species = poke
    //var png = species + '.png'
    if (poke.item && items[poke.item].mega[0] == poke.mon) {
        let pokenam
        var pokenamel = pokemon[items[poke.item].mega[1]]
        pokenam = pokenamel
        var final = `${spritefol}/${pokenam.sprite}`
        var finalfinal = pokenam.sprite
        return [final, finalfinal]
    }
    if (pokemon[poke.mon]) {
        var final = `${spritefol}/${pokemon[poke.mon].sprite}`
        var finalfinal = pokemon[poke.mon].sprite
        return [final, finalfinal]
    } else if (poke.mon.sprite) {
        var final = `${spritefol}/${poke.mon.sprite}`
        var finalfinal = poke.mon.sprite
        return [final, finalfinal]
    }

}

exports.obtainspritespawn = function (poke) {
    return [`${spritefol}/${poke.sprite}`, `${poke.sprite}`]
}

exports.checkforshiny = function (poke) {
    var png = pokemon[poke].num
    if (pokemon[poke].forme) {
        png = png + pokemon[poke].forme.charAt(0).toUpperCase()
    }
    return fs.existsSync(`${spritefol}/shiny/${png}.png`)
}
/*exports.getgendersymbol = function (poke) {
    if (!poke.gender) { return '' }
    if (poke.gender == 'M') { return '♂️' }
    return '♀️'
}*/
exports.getlevel = function (poke) {
    var i = 0
    while (i < 100) {
        if (this.expgroup[pokemon[poke.mon].exp](i) >= poke.lvl) {
            break
        }
        i++
    }
    return i
}
exports.checkforlvlupevo = function (poke) {
    if (!pokemon[poke.mon].evolutions) { return }
    for (const evolve in pokemon[poke.mon].evolutions) {
        if (pokemon[poke.mon].evolutions[evolve].variant == 'level_up' && pokemon[poke.mon].evolutions[evolve].requirements.length == 1 && pokemon[poke.mon].evolutions[evolve].requirements[0].variant == 'level' && pokemon[poke.mon].evolutions[evolve].requirements[0].minLevel <= this.getlevel(poke)) {
            return pokemon[poke.mon].evolutions[evolve].result
        }
    }
}

exports.removepokemon = function (data, id) {
    if (data.info.fav) {
        var index = 0
        while (index < data.info.fav.length) {
            if (data.info.fav[index] > id) {
                data.info.fav[index] = data.info.fav[index] - 1
            } else if (data.info.fav[index] == id) {
                data.info.fav.splice(index, 1)
            }
            index++
        }
    }
    if (data.info.selected > id + 1 || data.info.selected == id + 1) {
        data.info.selected--
    }
    return data.poke.splice(id, 1)[0]
}
exports.regionalformcatcher = function (args, mon) {
    var name = pokemon[mon].baseSpecies
    return pokemon[name]
}
exports.pokenamechecker = function (args, mon) {
    var names = [mon, pokemon[mon].name]
    var regions = {
        pc98: "pc98",
        ex: "ex"
    }
    if (pokemon[mon].forme) {
        if (regions[pokemon[mon].forme]) {
            names[3] = regions[pokemon[mon].forme] + " " + (pokemon[mon].name).split('-')[0]
        }
        names[2] = (pokemon[mon].forme + ' ' + (pokemon[mon].name).split('-')[0])
        names[4] = (pokemon[mon].name).split('-')[0]
        names[5] = pokemon[mon].baseSpecies
    }
    for (i in names) {
        if (args.toLowerCase() == names[i].toLowerCase()) {
            return [mon, names]
        }
    }
    for (i in names) {
        if (args.toLowerCase() == names[i].toLowerCase()) {
            return [mon, names[3]]
        }
    }
}
/*
{
        "DateMet" : "3/27/2021",
        "EV" : {
          "AtkEV" : 85,
          "DefEV" : 25,
          "HPEV" : 18,
          "SpAEV" : 23,
          "SpDEV" : 32,
          "SpeedEV" : 49
        },
        "Experience" : 1059860,
        "Gender" : "Female",
        "IV" : {
          "AtkIV" : 18,
          "DefIV" : 23,
          "HPIV" : 28,
          "SpAIV" : 6,
          "SpDIV" : 12,
          "SpeedIV" : 18
        },
        "LevelMet" : "LvlDOT 95",
        "Lvl" : 100,
        "Moves" : {
          "Calm Mind" : [ 2, 20 ],
          "Foul Play" : [ 4, 15 ],
          "Recover" : [ 3, 10 ],
          "Zen Headbutt" : [ 1, 15 ]
        },
        "Nature" : "Hasty",
        "Owner" : "81imega",
        "PartyPosition" : 1,
        "PokeName" : "Sableye",
        "Pokeball" : "Pokeball",
        "Reverse" : "eyelbaS",
        "Ribbons" : {
          "Legend" : {
            "Obtained" : "4/13/2021",
            "Selected" : false
          }
        },
        "Where" : "???"
      },
*/
/*{"mon":"charmander","lvl":5,"ot":"350700613983535105","shiny":true,"nature":"Gentle","ivs":{"hp":7,"atk":9,"def":27,"spa":2,"spd":23,"spe":23},"id":1}*/
const conversion = {
    "AtkIV": "atk",
    "DefIV": "def",
    "HPIV": "hp",
    "SpAIV": "spa",
    "SpDIV": "spd",
    "SpeedIV": "spe"
}
const conversione = {
    "AtkEV": "atk",
    "DefEV": "def",
    "HPEV": "hp",
    "SpAEV": "spa",
    "SpDEV": "spd",
    "SpeedEV": "spe"
}
function reverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}


const transfertab = {
    "Farfetch'd": "Farfetch\u2019d",
    "MrDOT Mime": "Mr. Mime",
    "Deoxys-S": "Deoxys",
    "Deoxys-A": "Deoxys",
    "Deoxys-D": "Deoxys",
    "NidoranM": "Nidoran-M",
    "NidoranF": "Nidoran-F",
    "Giratina-O": "Giratina",
    "Mudsbray": "Mudbray",
    "Meloetta-P": "Meloetta"
}
const stats = ['atk', 'def', 'hp', 'spa', 'spd', 'spe']
exports.convertmonandadd = function (mon, author, client) {
    const data = require('../functions/data.js').provideclient(client)
    if (transfertab[mon.PokeName]) { mon.PokeName = transfertab[mon.PokeName] }
    if (mon.PokeName == "Egg") { mon.PokeName = reverseString(mon.Reverse); }
    const name = exports.checkforpokemonbyname(mon.PokeName)
    if (name) {
        var tab = {
            "mon": name,
            "lvl": mon.Lvl,
            "nature": mon.Nature,
            "ot": `R${mon.Owner}`,
            "ivs": {},
            "metadata": {
                "pokeball": mon.Pokeball,
                "datemet": mon.DateMet,
                "levelmet": mon.LevelMet.substring(7, mon.LevelMet.length),
                "evs": {}
            },
            "moves": [],
        }
        if (mon.HeldItem) { tab.metadata.helditem = mon.HeldItem }
        if (mon.Nickname) { tab.nickname = mon.nickname }
        if (mon.Where != "???") { tab.metadata.where = mon.Where }
        if (mon.Skin) { tab.metadata.skin = mon.Skin }
        if (mon.Ribbons) { tab.metadata.ribbons = mon.Ribbons }
        if (mon.Shiny) { tab.shiny = true }
        Object.keys(mon.IV).forEach(function (thing) { tab.ivs[conversion[thing]] = mon.IV[thing] })
        stats.forEach(function (thing) { if (!tab.ivs[thing]) { tab.ivs[thing] = 0 } })
        Object.keys(mon.Moves).forEach(function (balls) {
            tab.moves.push(balls)
        })
        if (mon.EV) { Object.keys(mon.EV).forEach(function (thing) { tab.metadata.evs[conversione[thing]] = mon.EV[thing] }) }
        stats.forEach(function (thing) { if (!tab.metadata.evs[thing]) { tab.metadata.evs[thing] = 0 } })
        if (mon.Gender) { tab.gender = mon.Gender.substring(0, 1) }

        data.addpokemon(author, tab)
    } else {
        console.log(`${mon.PokeName} does not exist`)
    }
}
exports.pokedexadd = function (client, user, mon, shiny) {
    var data = require('../functions/data.js').provideclient(client).grabdata(user).info.pokedex
    if (!data[mon]) {
        data[mon] = 0
    }
    data[mon]++
    this.statistic(client, user, 'caught')
    if (shiny) {
        this.statistic(client, user, 'scaught')
    }
}
exports.statistic = function (client, user, statistic, am) {
    if (!am) { am = 1 }
    var dat = require('../functions/data.js').provideclient(client).grabdata(user).info.statistics
    if (!dat[statistic]) {
        dat[statistic] = 0
    }
    dat[statistic] += am
}
exports.findclass = function (mon) {
    if (this.specialmons.legendaries.includes(mon)) {
        return 'legendaries'
    }
    if (this.specialmons.mythical.includes(mon)) {
        return 'mythical'
    }
    if (this.specialmons.paradox.includes(mon)) {
        return 'paradox'
    }
    if (this.specialmons.ub.includes(mon)) {
        return 'ub'
    }
}