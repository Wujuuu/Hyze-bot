const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client;
const timers = require('timers')
const config = require('./config.json')
const express = require('express');
const db = require("quick.db");
const Levels = require("discord-xp");
Levels.setURL(config["Bot_Info"].mongodb);
const mongoose = require('mongoose');

const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online
///////////////////////////////////////////////////             
const activity1 = config["Bot_Info"].activity1
const type1 = config["Bot_Info"].type1
const activity2 = config["Bot_Info"].activity2
const type2 = config["Bot_Info"].type2
const activity3 = config["Bot_Info"].activity3
const type3 = config["Bot_Info"].type3
const time1 = config["Bot_Info"].activitytime
////////////////////////////////////////////////////

//Activites Const

let activities = [
  {
    name:`${activity1}`,
    options:{
      type:`${type1}`
    }
  },
  {
    name:`${activity2}`,
    options:{
      type:`${type2}`
    }
  },
  {
    name:`${activity3}`,
    options:{
      type:`${type3}`
    }
  }
]
let i = 0;

//On Ready



const { GiveawaysManager } = require('discord-giveaways'); 

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} Entrou do sorteio #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} não reagir à oferta #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`O sorteio de  #${giveaway.messageID} terminou! Vencedores: ${winners.map((member) => member.user.username).join(', ')}`);
});






client.on('raw', async (dados, message) => {
  
  if(dados.t == 'PRESENCE_UPDATE' && client.guilds.cache.get("714575005966401637").members.cache.get(dados.d.user.id)){
    let membro = client.guilds.cache.get("714575005966401637").members.cache.get(dados.d.user.id)

    if(dados.d.game == null) return membro.roles.remove("853073575560085514")
    if(dados.d.game.state == undefined) return membro.roles.remove("853073575560085514")

    let valor = dados.d.game.state.toLowerCase()
    let n = valor.search(/((?:discord\.gg|discordapp\.com|www\.|http|invite))/g)
    
    if(n>=0) membro.roles.add("853073575560085514")
    if(n<0 && membro.roles.cache.has("853073575560085514")) membro.roles.remove("853073575560085514")
  }
});

//xp
client.on("message", async (message) => {

  
  if (!message.guild) return;
  if (message.author.bot) return;


  let quantia = Math.floor(Math.random() * 150) + 50;
  const randomAmountOfXp = Math.floor(Math.random() * 14) + 1;
  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  if (hasLeveledUp) {

    let hyyze_xp = db.get(`hyyyze_xp_${message.guild.id}`);

    let userr = message.author;
    const user = await Levels.fetch(message.author.id, message.guild.id);
    client.channels.cache.get(hyyze_xp).send(`${message.author}, Parabéns! Você subiu para o nivel **${user.level}**. :tada:, e ganhou \`${quantia} moedas\` com o level up.`)
    db.add(`money_${message.guild.id}_${userr.id}`, quantia)

   
 

  }
});





client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

  client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = config["Bot_Info"].prefix
    let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let commandfile;

    if (client.commands.has(cmd)) {
      commandfile = client.commands.get(cmd);
  } else if (client.aliases.has(cmd)) {
    commandfile = client.commands.get(client.aliases.get(cmd));
  }
  
      if (!message.content.startsWith(prefix)) return;

          
  try {
    commandfile.run(client, message, args);
  
  } catch (e) {
  }}
  )



client.on("message", async (message, guild) => {
  let autor = message.author;
  if(message.author.Client || message.channel.type === "dm") return;

  // deleting his afk if he send a msg

  if(db.has(`afk-${message.author.id}+${message.guild.id}`)) { // if he has afk
      const oldReason = db.get(`afk-${message.author.id}+${message.guild.id}`) // get the reason 
      await db.delete(`afk-${message.author.id}+${message.guild.id}`)

      let embed22 = new Discord.MessageEmbed()
      .setTitle("VOLTOUUU!")
      .setColor("BLUE")
      .setDescription(`${autor} não está mais ausente.\n\n**Motivo:**\n \`${oldReason}\``)


      message.reply(embed22) // send this msg
  }


  // checking if someone mentioned the afk person

  if(message.mentions.members.first()) { // if someone mentioned the person
      if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) { // db will check if he is afk
          message.channel.send("**AUSENTE:**\n " + message.mentions.members.first().user.tag  + "\n**Motivo:** " +  db.get(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) // if yes, it gets from the db the afk msg and send it
      }
   }
})





//autorole
client.on("guildMemberAdd",  async (member) => {
  let ferinha_autorole = db.get(`ferinha_autorole_${member.guild.id}`);
  if (!ferinha_autorole === null) return;
  member.roles.add(ferinha_autorole)
});


//Boas vindas
client.on("guildMemberAdd", (member) => {
  let ferinha_canal_de_boas_vindas = db.get(`ferinha_boas_vindas_${member.guild.id}`);
  let ferinha_contador = member.guild.memberCount;
  let ferinha_servidor = member.guild.name;
  
  if (!ferinha_canal_de_boas_vindas) return;

  let msg_embed_ferinha = new Discord.MessageEmbed() //mensagem embed
  .setAuthor(`${member.user.tag}`, member.user.avatarURL())
  .setDescription(`Seja bem vindo ${member.user} ao servidor **${ferinha_servidor}**. \nEstamos com \`${ferinha_contador}\` membros.`)
  .setColor("YELLOW")
  .addField("ID do usuário:", `${member.user.id}`)
  .setThumbnail(member.user.avatarURL());

  let msg_not_embed_ferinha = `Boas Vindas ${member.user}! \nAtualmente estamos com \`${ferinha_contador}\` membros!`; //mensagem não embed

  client.channels.cache.get(ferinha_canal_de_boas_vindas).send(msg_embed_ferinha)
});

//saida
client.on("guildMemberRemove", (member) => {
  let ferinha_canal_de_saida = db.get(`ferinha_saída_${member.guild.id}`);
  let ferinha_contador = member.guild.memberCount;

  if (!ferinha_canal_de_saida) return;

  let msg_embed_ferinha = new Discord.MessageEmbed() //mensagem embed
  .setAuthor(`${member.user.tag}`, member.user.avatarURL())
  .setDescription(`O usuário ${member.user} saiu do servidor! \nAtualmente estamos com \`${ferinha_contador}\` membros!`)
  .setColor("YELLOW")
  .addField("ID do usuário:", `${member.user.id}`)
  .setThumbnail(member.user.avatarURL());

  let msg_not_embed_ferinha = `O usuário ${member.user} saiu do servidor! \nAtualmente estamos com \`${ferinha_contador}\` membros!`; //mensagem não embed
  
  client.channels.cache.get(ferinha_canal_de_saida).send(msg_embed_ferinha)

});

//para comandos
client.on('message', message => {


let autor = message.author;

     if (message.author.bot) return;
     if (message.channel.type == 'dm') return;
     if (!message.content.toLowerCase().startsWith(config["Bot_Info"].prefix.toLowerCase())) return;
     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config["Bot_Info"].prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
    console.error('Erro:' + err);
    
  }
});

//link do hotel
client.on('message', message => {
    if (message.content.startsWith('link')){
        message.channel.send('**O link é:** https://hyze.online/');
    };
  
});

//login bot console
  client.on('ready', () => {
    console.log(`${client.user.username} foi iniciado com sucesso.`);
    
    timers.setInterval(() => {
      i = i == activities.length ? 0 : i
      client.user.setActivity(activities[i].name, activities[i].options)
      i++
    }, time1)
  });



  

//mensagem com menção e privado
client.on("message", msg => {
  if (msg.author.bot) return;
  if (msg.channel.type == 'dm') return msg.reply('> __:pleading_face:-**Não Respondo Dm**__\n> __:space_invader:-**Sou Apenas Um Bot!**__')
  if (msg.content == `<@!${client.user.id}` || msg.content == `<@!${client.user.id}>`)  {
  let embed1 = new Discord.MessageEmbed()
  .setTitle(`Olá hazyanos!`)
  .setColor(`#FFFF00`)
  .setDescription(`
> :space_invader: » Meu nome é **Hyze Hotel** e a minha função é ajudar vocês!
> :gear: » Meu prefixo é "**.**".
> :oncoming_police_car: » Use **.help** para ver meus comandos.
> :link: » Link Do Hyze Hotel [Clique aqui](https://hyze.online)
  `)
  .setFooter(`» Equipe Hyze Hotel`)
  msg.channel.send(embed1)
} 
});

mongoose.connect(config["Bot_Info"].mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  

}).then(()=>[
  console.log('Conectado a DB')
])



//Log Client In
client.login(config["Bot_Info"].token)