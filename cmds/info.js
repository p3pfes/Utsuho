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
const pokemons = require('../modules/pokemon.json')
const items = require(`../modules/items.json`)
//const items = require('../modules/items.json')
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
function HPcalc(poke,species) {
    if(!species){species = poke.mon}
	return ((poke.ivs[1]+2* pokemons[species].baseStats.hp)*pokeutil.getlevel(poke)/100)+10+pokeutil.getlevel(poke)
}

function otherstatcalc(poke,basestat,nature,species){
    if(!species){species = poke.mon}
	return (((poke.ivs[st2.indexOf(basestat)]+2*pokemons[species].baseStats[basestat])*pokeutil.getlevel(poke)/100)+5) * nature
}

function statcalc(poke,basestat,nature,species){
    var calc
    if(basestat == 'hp'){
        calc = HPcalc(poke,species)
    }else{
        calc = otherstatcalc(poke,basestat,nature,species)
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
/*(function getgendersymbol(poke){
      if(!poke.gender){return''}
    if(poke.gender == 'M'){return'♂️'}
    return '♀️'
} */
module.exports = {
    name: ['info','i','inf','il','ir'],
    description: 'h',
    datarequired: true,
    execute(message,args,client){
        const data = require('../functions/data.js').provideclient(client)
        const plrdat = data.grabdata(message.author)
        var selected = plrdat.info.select
        if(args[0] || message.content.split(' ')[0].toLowerCase() == `${pokeutil.prefix.prefix()}il` || message.content.split(' ')[0].toLowerCase() == 'th!ir'){
            if(message.content.split(' ')[0].toLowerCase() == `th!il` || message.content.split(' ')[0].toLowerCase() == 'th!ir' || args[0].toLowerCase() == 'recent'|| args[0].toLowerCase() == 'latest'|| args[0].toLowerCase() == 'r'|| args[0].toLowerCase() == 'l'){
                selected = plrdat.poke.length
            }else{
                selected = args[0]
            }   
        }
        const poke = pokeutil.findmonoffid(message.author,selected,client)
        if(!poke){
            message.channel.send('Touhou character does not exist.')
            return
        }
        var color = 0x8B0000
        var species = poke.mon
        if(poke.item && items[poke.item].mega && items[poke.item].mega[0] == poke.mon){
            species = items[poke.item].mega[1]
            color = 0xff0505
        }
        if(poke.mon == species && poke.gmax){
            color = 0xff0505
        }
        console.log()
        var nam = (poke.nickname && `"${poke.nickname}"` )|| pokemons[species].name
        var lvl = pokeutil.getlevel(poke)
        desc = ''
        if(lvl==100){
            desc += "**Max Level**\n"
        }else{
            var exp = (pokeutil.expgroup[pokemons[poke.mon].exp](lvl+1)-pokeutil.expgroup[pokemons[poke.mon].exp](lvl))+(poke.lvl-pokeutil.expgroup[pokemons[poke.mon].exp](lvl))
            if(poke.lvl == pokeutil.expgroup[pokemons[poke.mon].exp](lvl)){
                exp = 0
            }
            desc += `${exp}/${pokeutil.expgroup[pokemons[poke.mon].exp](lvl+1)-pokeutil.expgroup[pokemons[poke.mon].exp](lvl)} XP\n`
        }
        desc += `**OT:** ${(poke.ot.startsWith('R') && `<:miltank:914678775042699305> ${poke.ot.substring(1,poke.ot.length)}`) ||`<@${poke.ot}>`}\n`
        if(poke.item){
            desc += `\n**Held Item:** ${items[poke.item].name}`
        }
        desc = desc + '\n'
        desc = desc + `**Nature:** ${poke.nature}\n`
        var i = 0
        while(i < 6){
            desc += `**${st[st2[i]]}** ${statcalc(poke,st2[i],naturecheck(poke,st2[i]),species)}${plrdat.info.detailed && ` - IV: ${poke.ivs[i]}/31` || ''} \n`
            i++
        }
        if(plrdat.info.detailed){
        desc += `**Total IV %:** ${pokeutil.calcpokemonivpercent(poke)}%\n`
        }
        if(poke.nickname){
        desc = desc + `**Nickname:** ${poke.nickname}`
        }
        var spr = pokeutil.obtainsprite(poke,((species == poke.mon && poke.gmax) && species + 'gmax') || species)
      
        const file = new AttachmentBuilder(spr[0])
        if(poke.redeem){
            color = 0x000000
        }
        const exampleEmbed = {
            color: color,
            title: `${poke.shiny && ' ⭐' || ''} Level ${pokeutil.getlevel(poke)} ${nam}`,
            author: {
                name: 'Info',
            },
            description: desc,
            image: {
                url: `attachment://${spr[1]}`
            },
            footer: {
                text: `Selected Character: ${selected}/${plrdat.poke.length}`,
            },
        };
        
        message.channel.send({ embeds: [exampleEmbed], files: [file] })
    }
}
