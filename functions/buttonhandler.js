var pokeutil = require('./pokeutil.js')
const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timed out');
    }, 20000);
  }).catch(error => console.error(error));

function tradebattlestuff(interaction,client){
    if(!client.events[interaction.channel.id] || (client.events[interaction.channel.id][0] != 'traderequest' && client.events[interaction.channel.id][0] != 'battlerequest')){
        interaction.reply({content:'There is nothing to accept/deny in this channel!',ephemeral:true})
        return false
    }
    return true
  }
const { ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ready = new ButtonBuilder()
            .setCustomId('readytrade')
            .setLabel('Ready')
            .setStyle(ButtonStyle.Success)
const cancel = new ButtonBuilder()
            .setCustomId('canceltrade')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
const row = new ActionRowBuilder().addComponents(ready,cancel);
const tradecmds = require('../cmds/tradecmds.js')
module.exports = {
    accepttb: async function(client,interaction){
        if(!tradebattlestuff(interaction,client)){return}
        if(client.events[interaction.channel.id][3] != interaction.user.id){
            interaction.reply({content:'You were not the one sent a request!',ephemeral:true})
            return false
        }
        console.log("finduser",client.events[interaction.channel.id][2].id,client.events[interaction.channel.id][3].id)
        if(pokeutil.finduserinevent(client,client.events[interaction.channel.id][2].id,client.events[interaction.channel.id][3].id)){
            interaction.reply({content:'Trade/Battle is already going on elsewhere, either with yourself or the inviter. Close that, and try again!',ephemeral:true})
        }
        if(client.events[interaction.channel.id][0] == 'traderequest'){
            try {
            const member = await Promise.race([interaction.guild.members.fetch({ user: client.events[interaction.channel.id][2]}), timeoutPromise]);
            client.events[interaction.channel.id][0] = 'trade'
            client.events[interaction.channel.id][1] = pokeutil.gettime()
            client.events[interaction.channel.id].push(member.user.username,interaction.user.username,false,false,{'credits':0,'redeems':0,'poke':[]},{'credits':0,'redeems':0,'poke':[]},0)
            client.events[interaction.channel.id].push(await interaction.reply({components: [row],embeds: [{
                color: 0x3CBF46,
                title: `Trade between ${member.user.username} and ${interaction.user.username}`,
                description: `<@${member.user.id}> is offering | ❌\n${'` `'}\n<@${interaction.user.id}> is offering | ❌\n${'` `'}`,
            }]}))
            
            }catch(error){
                interaction.reply(`Error! ${error}`)
                delete client.events[interaction.channel.id]
            }
        }else{
            try {
            const member = await Promise.race([interaction.guild.members.fetch({ user: client.events[interaction.channel.id][2]}), timeoutPromise]);
            client.events[interaction.channel.id][0] = 'battle'
            client.events[interaction.channel.id][1] = pokeutil.gettime()
            var membersel = {...pokeutil.findmonoffid(member.user,require('../functions/data.js').provideclient(client).checkdata(member.user).info.select,client)}
            var authorsel = {...pokeutil.findmonoffid(interaction.user,require('../functions/data.js').provideclient(client).checkdata(interaction.user).info.select,client)}
            client.events[interaction.channel.id].push(member.user.username,interaction.user.username,membersel,authorsel,interaction.user,pokeutil.statcalc(membersel,'hp'),pokeutil.statcalc(authorsel,'hp'),false,false)
            interaction.reply({embeds: [{
                color: 0x3CBF46,
                title: `${client.events[interaction.channel.id][4]} VS ${client.events[interaction.channel.id][5]}`,
                description: 
                `${client.events[interaction.channel.id][2]} ${membersel.mon} - ${client.events[interaction.channel.id][9]}/${client.events[interaction.channel.id][9]} HP\n
                ${client.events[interaction.channel.id][3]} ${authorsel.mon} - ${client.events[interaction.channel.id][10]}/${client.events[interaction.channel.id][10]} HP`,
            }]})
            member.user.send('Battle began!')
            interaction.user.send('Battle began!')
            console.log(client.events[interaction.channel.id])
            }catch(error){
                delete client.events[interaction.channel.id]
                interaction.reply(`Error! ${error}`)
            }
        }

    },
    denytb: function(client,interaction){
        if(!tradebattlestuff(interaction,client)){return}
        if(client.events[interaction.channel.id][3] != interaction.user.id && client.events[interaction.channel.id][2] != interaction.user.id){
            interaction.reply({content:'You were not the one sent a request!',ephemeral:true})
        }
        delete client.events[interaction.channel.id]
        interaction.reply({content:'Request denied/cancelled.'})
    },
    readytrade: function(client,interaction){
        var id = tradecmds.dochecks(client,interaction.channel,interaction.user)
        if(typeof id == 'string'){
            interaction.reply({content:id,ephemeral:true})
            return
        }
        tradecmds.ready(client,id,interaction.channel)
        interaction.reply({content:'You are ready!',ephemeral:true})
    },
    canceltrade: function(client,interaction){
        console.log('cancel')
        var id = tradecmds.dochecks(client,interaction.channel,interaction.user)
        if(typeof id == 'string'){
            interaction.reply({content:id,ephemeral:true})
            return
        }
        delete client.events[interaction.channel.id]
        interaction.reply('Trade cancelled.')
    },
}