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
module.exports = {
    name: ['start'],
    description: 'h',
    execute(message, args) {
        const exampleEmbed = {
            color: 0x0099ff,
            author: {
                name: 'Begin your journey!',
            },
            description: '**Welcome to Gensokyo!**\nTo begin playing, choose one of these character with the `th!pick <name>` command, like this: `th!pick Sunny Milk`. Here are the list of starter characters: \n Star Sapphire \n Sunny Milk \n Luna Child',
            image: {
                url: `https://media.discordapp.net/attachments/1146532841585381456/1146887318670680124/starters.png?width=944&height=407`,
            },



            footer: {
                text: `Note: This bot is in Alpha. Bugs are to be expected.`,
                //icon_url: 'https://i.imgur.com/wSTFkRM.png',
            }
        };

        message.channel.send({ embeds: [exampleEmbed] });
    }
}
