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
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/
const color = ['Black','Green','Blue','Purple','Red','Pink','Gray','White','Yellow','Brown']
const regionnum = [14, 24, 32, 37, 45, 53, 60, 67, 75, 82, 90, 97, 114, 119, 128, 132, 140, 145, 152]
const pokeutil = require('./pokeutil.js')
const pokemon = require('../modules/pokemon.json')
const things = [
function(){ //catchcolor
    var tab = ['catchcolor',0,false,0,Math.floor(Math.random()*6)+1,Math.floor(Math.random()*color.length)]
    tab[1] = Math.max((tab[4]*50)-Math.floor(Math.random()*125),100)
    return tab
},
function(){ //catchregion
    var tab = ['catchregion',Math.floor(Math.random()*150)+100,false,0,Math.floor(Math.random()*6)+1,Math.floor(Math.random()*8)] 
    tab[1] = Math.max((tab[4]*25)-Math.floor(Math.random()*100),50)
    return tab
},
function(){ //catchamount
    var tab =  ['catchamount',0,false,0,Math.floor(Math.random()*30)+20] 
    tab[1] = Math.max((tab[4]*10)-Math.floor(Math.random()*75),20)
    return tab
},
]
exports.generatetasks = function(streak){
    var index = 0
    var tasks = []
    var amount = Math.floor((streak/6)+3,8)
    while(index < amount) {
        var r = Math.floor(Math.random() * things.length)
        tasks.push(things[r]())
        index++
    }
    return tasks
}
const checker = {
    'catchcolor': function(thing,mon,client,user){
        var update = false
        if(pokemon[mon].color == color[thing[5]]){
            thing[3]++
            update = true
        }
        if(thing[2]){return}
        if(thing[3] >= thing[4]){
            pokeutil.statistic(client,user,'daily')
            pokeutil.credits(client,user,thing[1])
            thing[2] = true
        }
        if(update){
            return pokeutil.getdailyline[thing[0]](thing)
        }
    },
    'catchregion': function(thing,mon,client,user){
        var i = 0
        var region
        var update = false
        while(i < 8){
            if(pokemon[mon].num <= regionnum[i]){
                region = i
                break
            }
            i++
        }
        if(region == thing[5]){
            thing[3]++
            update = true
        }
        if(thing[2]){return}
        if(thing[3] >= thing[4]){
            pokeutil.statistic(client,user,'daily')
            thing[2] = true
            pokeutil.credits(client,user,thing[1])
        }
        if(update){
        return pokeutil.getdailyline[thing[0]](thing)
        }
    },
    'catchamount': function(thing,mon,client,user){
        thing[3]++
        if(thing[2]){return}
        if(thing[3] >= thing[4]){
            pokeutil.statistic(client,user,'daily')
            thing[2] = true
            pokeutil.credits(client,user,thing[1])
        }
        return pokeutil.getdailyline[thing[0]](thing)
    },

}
function checkArrays(arrays) {
    for (let i = 0; i < arrays.length; i++) {
      if (!arrays[i][2]) {
        return false;
      }
    }
    return true;
  }

function deemchance(streak){
    if(streak>30){streak = 30}
    return 1000-(streak * 30);
}
exports.caughtpokemoncheck = function(client,user,mon){
    const dat = require('./data.js').provideclient(client).checkdata(user).info
    const data = dat.daily[1]
    var index = 0
    var extra = []
    console.log(data.length + ' data')
    while(index < data.length){
        var t = checker[data[index][0]](data[index],mon,client,user)
        if(t){
        extra.push(t)
        }
        index++
    }
    if(extra[0] && checkArrays(data)){
        pokeutil.statistic(client,user,'dailyc')
        if(Math.floor(Math.random()*deemchance(dat.daily[2]))==1){
            pokeutil.redeems(client,user,1)
        }
        dat.daily[2]++
    }
    console.log(extra)
    if(extra.length > 0){
        return '\n\n' + extra.join([separator = '\n']) 
    }
    return ''
}

exports.allowstreak = function(dat){
    return (checkArrays(dat[1]) && dat[2] || 0)
}
