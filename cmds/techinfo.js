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
const pokemons = require('../modules/pokemon.json')
const {AttachmentBuilder} = require('discord.js')

const st = {hp: 'HP:', atk: 'Attack:', def: 'Defense:', spa: 'Sp. Attack:', spd: 'Sp. Defense:', spe: 'Speed:'}
const st2 = ['hp','atk','def','spa','spd','spe']
const nstats = { //Boost = 110% (1.1), Down = 90% (.9)
	"neutral": ["Hardy","Docile","Serious","Bashful","Quirky"],
	"atkB": ["Lonely","Brave","Adamant","Naughty"],
	"atkD": ["Bold","Timid","Modest","Calm"],
	"defB": ["Bold","Relaxed","Impish","Lax"],
	"defD": ["Lonely","Hasty","Mild","Gentle"],
	"speB": ["Timid","Hasty","Jolly","Naive"],
	"speD": ["Brave","Relaxed","Quiet","Sassy"],
	"spaB": ["Modest","Mild","Quiet" ,"Rash"],
	"spaD": ["Adamant","Impish","Jolly","Careful"],
	"spdB": ["Calm","Gentle","Sassy","Careful"],
	"spdD": ["Naughty","Lax","Naive","Rash"]
}
function HPcalc(poke) {
	return ((poke.ivs[1]+2* pokemons[poke.mon].baseStats.hp)*pokeutil.getlevel(poke)/100)+10+pokeutil.getlevel(poke)
}

function otherstatcalc(poke,basestat,nature){
	return (((poke.ivs[st2.indexOf(basestat)]+2*pokemons[poke.mon].baseStats[basestat])*pokeutil.getlevel(poke)/100)+5) * nature
}

function statcalc(poke,basestat,nature){
    var calc
    if(basestat == 'hp'){
        calc = HPcalc(poke)
    }else{
        calc = otherstatcalc(poke,basestat,nature)
    }
    return Math.round(calc)
}

function naturecheck(poke,ste){
    var ret = 1
    Object.keys(nstats).forEach(function(stat){
        nstats[stat].forEach(function(nature){
            if(poke.nature == nature){
                const s = stat.substring(0,3)
                if(s != 'neu' && ste == s){
                    if(stat.endsWith('B')){
                        ret = 1.1
                    }else{
                        ret = 0.9
                    }
                }
                
            }
        })

    })
    return ret
}

module.exports = {
    name: ['techinfo','tinfo'],
    description: 'h',
    datarequired: true,
    execute(message,args,client){
        const data = require('../functions/data.js').provideclient(client)
        const plrdat = data.grabdata(message.author)
        var selected = plrdat.info.select
        if(args[0]){
            if(args[0] == 'recent'|| args[0] == 'latest'|| args[0] == 'r'|| args[0] == 'l'){
                selected = plrdat.poke.length
            }else{
                selected = args[0]
            }   
        }
        const poke = pokeutil.findmonoffid(message.author,selected,client)
        if(!poke){
            message.channel.send('Character does not exist.')
            return
        }
        const spr = pokeutil.obtainsprite(poke)
        const exampleEmbed = {
            color: 0x0099ff,
            title: `Touhou character info for ID ${selected}`,
            description: JSON.stringify(poke,null,"\t"),
        };
        
        message.channel.send({ embeds: [exampleEmbed]})
    }
}
