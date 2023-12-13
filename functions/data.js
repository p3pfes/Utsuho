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
const fs = require('fs');

var saveloc = './saves'

if (!fs.existsSync(saveloc)) {
    fs.mkdirSync(saveloc);
}
saveloc = saveloc + '/'

exports.provideclient = function (dcord) {
    const ret = {
        "makenewdata": function (client) {
            dcord.savecache[client.id] = {
                "poke": [],
                "info": { "select": 1, 'daily': [Date.now(), require('./generatedaily.js').generatetasks(0), 0], 'statistics': { 'caught': 0, 'startdate': Date.now() }, 'pokedex': {}, 'inventory': {} },
            }
            const area = saveloc + client.id
            fs.mkdirSync(area)
            fs.appendFile(area + '/poke.json', '[]', function (err) {
                if (err) throw err;
            });
            fs.appendFile(area + '/info.json', JSON.stringify(dcord.savecache[client.id]['info']), function (err) {
                if (err) throw err;
            });

        },
        "checkdata": function (client, createnewifnot) {
            if (!fs.existsSync(saveloc + client.id)) {
                if (createnewifnot) {
                    this.makenewdata(client)
                } else {
                    return false
                }
            }
            if (!dcord.savecache[client.id]) {
                console.log('creating savecache')
                dcord.savecache[client.id] = {}
                const commandFiles = fs.readdirSync(`${saveloc}/${client.id}/`).filter(file => file.endsWith('.json'))
                for(const file of commandFiles){
                    var data = fs.readFileSync(`${saveloc}/${client.id}/${file}`, 'utf8')
                    dcord.savecache[client.id][file.substring(0, file.lastIndexOf('.'))] = JSON.parse(data)
                }
                if(!dcord.savecache[client.id]['info']['daily']){
                    dcord.savecache[client.id]['info']['daily'] = [Date.now(),require('./generatedaily.js').generatetasks(0),0]
                }else if(dcord.savecache[client.id]['info']['daily'][0]+86400000 < Date.now()){
                    dcord.savecache[client.id]['info']['daily'][0] = Date.now()
                    var streak = require('./generatedaily.js').allowstreak(dcord.savecache[client.id]['info']['daily'])
                    dcord.savecache[client.id]['info']['daily'] = [Date.now(),require('./generatedaily.js').generatetasks(streak),streak]
                }
            }
            //console.log(dcord.savecache[client.id])
            return dcord.savecache[client.id]
        },
        "addpokemon": function(client,pokemon){
            const save = this.checkdata(client).poke
            var sav = false
            if(save.length == 0){
                sav = true
            }
            save.push(pokemon);
            if(sav){
                this.savefromcache(client.id)
            }
        },
        "grabdata": function(client){
            return this.checkdata(client)
        },
        "firstgoing": function(){
            dcord.savecache = {}
        },
        'savefromcache': function(id){
            if(fs.existsSync(saveloc+id)){
                Object.keys(dcord.savecache[id]).forEach(function(save){
                    if(fs.readFileSync(saveloc+id+'/'+save+'.json') != JSON.stringify(dcord.savecache[id][save])){
                        fs.writeFileSync(saveloc+id+'/'+save+'.json',JSON.stringify(dcord.savecache[id][save]) )
                    }
                })
            }
        },
        "savecache": function(){
            Object.keys(dcord.savecache).forEach(function(id){
                ret.savefromcache(id)
            })
            dcord.savecache = {}
        }
    }
    return ret
}
