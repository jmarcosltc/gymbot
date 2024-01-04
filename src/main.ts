"use strict";

import printWithChance, {botLoves} from "./helpers/Eastereggs";
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
import adicionarTreino, {
  addTreinoGeral,
  jaTreinou,
  limparTreinosSemanais, pegarQtdTreinosSemanais,
  pegarTodosTreinos,
} from "./firebase";
import { pegarQtdTreinos } from "./firebase";
import changelog, {nextOnRoadMap} from './helpers/Changelog';
const cron = require("node-cron");


const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "client-one",
    dataPath: "./Auth",
  }),
});

client.on('loading_screen', (percent: any, message: any): void => {
  console.log(`CARREGANDO BOT ${percent}% ⌛ ${message}`);
});

client.on("qr", (qr: any) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (): void => {
  console.log('Cliente para uso do GymBOT autenticado com sucesso.');
});

client.on('auth_failure', (msg: string): void => {
  console.error('Não foi possível restaurar a sessão do GymBOT: ', msg);
});

client.on("ready", (): void => {
  console.log("GymBOT está pronto para uso.");
});

client.on("disconnected", (reason: any): void => {
  client.sendMessage("120363027638141274@g.us", "GymBOT Foi desconectado :( \nMotivo: " + reason + "\nVai se fuder Whatsapp.");
})

client.on("message", async (msg: any) => {
  const chat = await msg.getChat();

  if (msg.body == "!ping") msg.reply("pong");

  if (!chat.isGroup) return;
  if (msg.isStatus) return;
  let nome = await msg.getContact();
  let nomeUser = nome.pushname;

  // 120363153322528004@g.us
  //120363027638141274@g.us <- projetin
  if (chat.id._serialized === "120363027638141274@g.us") { // || chat.id._serialized === "120363153322528004@g.us"

    if (msg.body == "!treinei") {
        if(await jaTreinou(msg.author)) {
            msg.reply("⚠️ Você já treinou hoje! Treino não contabilizado para os treinos da aposta, apenas para o *total de treinos*.");
            return;
        }
      await adicionarTreino(msg.author, nomeUser);
      msg.reply(
        `Treino ${
          nomeUser == undefined ? "do " : "do " + nomeUser
        } contabilizado com sucesso! ✅\nTotal de treinos na semana: *${(await pegarQtdTreinosSemanais(msg.author)) || 0}*\nTreinos no total: *${(await pegarQtdTreinos(msg.author)) || 0}*`
      ); //${treinos}
    } else if (msg.body == "!treino") {
      msg.reply(
        `Contagem de treinos para ${nomeUser}: *${await pegarQtdTreinos(
          msg.author
        ) || 0}*`
      );
    } else if (msg.body == "!treinos") {
      const todosTreinos = await pegarTodosTreinos();
      let treinoMessage = "";
      for (const treino in todosTreinos) {
        console.log(
          `${todosTreinos[treino].nome}: ${
            todosTreinos[treino].treinos_semanais || 0
          }`
        );
        
        treinoMessage += `${todosTreinos[treino].nome}: ${'✅'.repeat(todosTreinos[treino].treinos_semanais)}\n`;
      }
      chat.sendMessage("🔵 Treinos do grupo na semana:\n" + treinoMessage);
    } else if (msg.body == "!total") {
      const todosTreinos = await pegarTodosTreinos();
      let treinoMessage = "";
      for (const treino in todosTreinos) {
        console.log(
          `${todosTreinos[treino].nome}: ${todosTreinos[treino].treinos}`
        );

        treinoMessage += `${todosTreinos[treino].nome}: ${todosTreinos[treino].treinos}\n`;
      }
      chat.sendMessage("Treinos do grupo no total:\n" + treinoMessage);
    } else if(msg.body == "!ajuda") {
        chat.sendMessage("Comandos disponíveis:\n!treinei - Contabiliza um treino para você\n" +
            "!treino - Mostra quantos treinos você tem\n" +
            "!treinos - Mostra quantos treinos cada pessoa do grupo tem\n" +
            "!total - Mostra quantos treinos cada pessoa do grupo tem no total\n")
    } else {
      if (msg.body[0] == "!") {
        chat.sendMessage(
          "🟠 Desculpe, eu não reconheço esse comando. \nPara uma lista de comandos digite: *!ajuda*"
        );
      }
    }

    if(printWithChance()) try {msg.react("🏳️‍🌈")} catch (e) { console.log("Erro ao reagir com emoji.") }
    if(printWithChance()) try {msg.react("🐔")} catch (e) { console.log("Erro ao reagir com emoji.") }
    if(botLoves(msg.body)) try{msg.react("❤️")} catch (e) { console.log("Erro ao reagir com emoji.") }
  }

});

const clearVariable = (): void => {
  limparTreinosSemanais().then(() => console.log("Variable cleared."));
};

cron.schedule("59 23 * * 6", clearVariable);

client.initialize().then(() => {
  client.sendMessage("120363027638141274@g.us", "GymBOT Iniciado com sucesso!")
  console.log("Client initialized.")
});
