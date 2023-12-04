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

const pokemon = require('../modules/pokemon.json')
const pokeutil = require('../functions/pokeutil.js')
const legendarylist = pokeutil.specialmons
const validfilters = {
    shiny: function(arg,filter){
        var push =['shiny',true]
        if(arg.startsWith('!')){
            push[1] = false
        }
        filter.push(push)
    },
    paradox: function(arg,filter){
        var push =['mon',legendarylist.paradox]
        if(arg.startsWith('!')){
            push[0] += 'not'
        }
        filter.push(push)
    },
    ub: function(arg,filter){
        var push =['mon',legendarylist.ub]
        if(arg.startsWith('!')){
            push[0] += 'not'
        }
        filter.push(push)
    },
    legendary: function(arg,filter){
        var push =['mon',legendarylist.legendaries]
        if(arg.startsWith('!')){
            push[0] += 'not'
        }
        filter.push(push)
    },
    mythical: function(arg,filter){
        var push =['mon',legendarylist.mythical]
        if(arg.startsWith('!')){
            push[0] += 'not'
        }
        filter.push(push)
    },
    fav: function(arg,filter,data){
        filter.push([(arg.startsWith('!') && 'idnot') || 'id',data.info.fav || []])
    },
    favorites: function(arg,filter,data){return this.fav(arg,filter,data)},
    favorite: function(arg,filter,data){return this.fav(arg,filter,data)},
    s: function(arg,filter,data){return this.shiny(arg,filter,data)},
    p: function(arg,filter,data){return this.paradox(arg,filter,data)},
    ultrabeast: function(arg,filter,data){return this.ub(arg,filter,data)},
    l: function(arg,filter,data){return this.legendary(arg,filter,data)},
    f: function(arg,filter,data){return this.fav(arg,filter,data)},
    m: function(arg,filter,data){return this.mythical(arg,filter,data)}
}
const filtercheck = {
    shiny: function(arg,poke){
        if((arg == false && !poke.shiny) || (arg == poke.shiny)){
            return true
        }
    },
    monnot: function(arg,poke){
        if(!arg.includes(poke.mon)){
            return true
        }
    },
    mon: function(arg,poke){
        if(arg.includes(poke.mon)){
            return true
        }
    },
    id: function(arg,poke,index){
        if(arg.includes(index)){
            return true
        }
    },
    idnot: function(arg,poke,index){
        if(!arg.includes(index)){
            return true
        }
    }
}
var complicatedfilters = {
    mon: function(arg,filter,not){
        arg = arg.toLowerCase().split(",")
        var newlist = []
        for (let i = 0; i < arg.length; i++) {
            if(pokemon[arg[i]]){newlist.push(arg[i])}
            else{
                for (let key in pokemon) {
                    if(pokemon[key].name.toLowerCase() == arg[i]){
                        newlist.push(key)
                    }
                }
            }
        }
        var push =['mon',newlist]
        if(not){
            push[0] += 'not'
        }
        filter.push(push)
    },
    p: function(arg,filter,data){return this.mon(arg,filter,data)},
    pokemon: function(arg,filter,data){return this.mon(arg,filter,data)}
}
module.exports = {
name: ['touhou','t','toho','th'],
datarequired: true,

execute(message,args,client){
    const data = require('../functions/data.js').provideclient(client)
    const author = message.author
    const plrdat = data.grabdata(author)
    const plrd = plrdat.poke
    var p = 1
    if(args[0] && Number.isFinite(Number(args[0]))){
        p = Number(args[0])
        args.splice(0,1)
    }
    var desc = ''
    var poketab = []
    var filters = []
    var index = 0
    var newd = []
    var sorter = plrdat.info.sort || 'id'
    while(index < args.length){
        if(pokeutil.sorter[args[index].toLowerCase()]){
            sorter = args[index].toLowerCase()
        }else{
        filters.push([])
        var indextwo = 0
        var arg = args[index].split('|')
        while(indextwo < arg.length){
            if(!arg[indextwo]){break}
            var argu = arg[indextwo].toLowerCase()
            if(validfilters[argu.replace('!','')]){
                validfilters[argu.replace('!','')](argu,filters[filters.length-1],plrdat)
            }else{
                for (let key in complicatedfilters) {
                    if(argu.replace('!','').slice(0,key.length+1) == `${key}:`){
                        var not = (argu.charAt(0) == "!")
                        complicatedfilters[key](argu.replace('!','').slice(key.length+1),filters[filters.length-1],not)
                    }
                  }
            }
            indextwo++
        }
        }
        index++
    }
    index = 0
    while(index < plrd.length){
        var poke = plrd[index]
        if(!poke){break}
        var valid = true
        if(filters.length > 0){
            var indextwo = 0
            while(indextwo < filters.length){
                var tempvalid = false
                if(!filters[indextwo]){break}
                var indexthree = 0
                while(indexthree < filters[indextwo].length){
                    var filter = filtercheck[filters[indextwo][indexthree][0]](filters[indextwo][indexthree][1],poke,index)
                    if(filter == true){
                        tempvalid=true
                    }
                    indexthree++
                }
                if(tempvalid == false){valid=false}
                indextwo++
            }
            
        }
        if(valid){
            newd.push([poke,index])
        }
        index++
    }
    if(sorter!='id'){newd=pokeutil.sorter[sorter](newd)}
    index = 0
    if(newd.length>0){
    while(index < 20){
        if(!newd[index+(p*20)-20]){break}
        var poke = newd[index+(p*20)-20][0]
        if(!poke){break}
        poketab[index] = `**${pokemon[poke.mon].name}**${poke.shiny && ' ⭐' || ''} | Level: ${pokeutil.getlevel(poke)} | Number: ${newd[index+(p*20)-20][1]+1}${plrdat.info.detailed && ` | IV: ${pokeutil.calcpokemonivpercent(poke)}%` || ''}${poke.nickname && `  | Nickname: ${poke.nickname}` || ''}\n`
        index++
    }
    }
    var val = 0
    while(val < poketab.length){
        if(poketab[val]){
            desc = desc + poketab[val]
        }
        val += 1
    }
    const exampleEmbed = {
        color: 0x3CBF46,
        author: {
            name: 'Your Character:',
        },
        description: desc,
        footer: {
            text: `Showing ${(p*20)-19}-${(p*20)-(20-val)} of ${newd.length} ${newd.length > 1 && "characters" || "character"} matching this search.`
        }
    };
    if(desc != ''){
    message.channel.send({ embeds: [exampleEmbed] })
    }else{
    message.channel.send('There are no characters on this page.')
    }
}
}