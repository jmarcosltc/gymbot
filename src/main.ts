"use strict";

import printWithChance from "./helpers/Eastereggs";
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
import adicionarTreino, {
    jaTreinou,
  limparTreinosSemanais,
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

client.on("qr", (qr: any) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("GymBOT está pronto.");
});

client.on("message", async (msg: any) => {
  const chat = await msg.getChat();

  if (!chat.isGroup) return;
  if (msg.isStatus) return;
  let nome = await msg.getContact();
  let nomeUser = nome.pushname;

    if (msg.body == "!ping") {
      msg.reply("pong");
    }

  // 120363153322528004@g.us
  //120363027638141274@g.us <- projetin
  if (chat.id._serialized === "120363027638141274@g.us" || chat.id._serialized === "120363153322528004@g.us") {

    if (msg.body == "!treinei") {
        if(await jaTreinou(msg.author)) {
            msg.reply("Você já treinou hoje!");
            return;
        }
      await adicionarTreino(msg.author, nomeUser);
      msg.reply(
        `Treino ${
          nomeUser == undefined ? "do " : "do " + nomeUser
        } contabilizado com sucesso! ✅\nTotal de treinos: *${
          (await pegarQtdTreinos(msg.author)) || 0
        }*`
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
      chat.sendMessage("Treinos do grupo na semana:\n" + treinoMessage);
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
            "!total - Mostra quantos treinos cada pessoa do grupo tem no total" +
            "!changelog - Mostra mudanças na ultima atualização do bot")
    } else if(msg.body == "!changelog") {
      chat.sendMessage("*Versão 1.0.2\n*" +
        changelog()
      )
    } else if(msg.body == "!roadmap") {
      chat.sendMessage(nextOnRoadMap())
    } else {
      if (msg.body[0] == "!") {
        chat.sendMessage(
          "Desculpe, eu não reconheço esse comando. \nPara uma lista de comandos digite: *!ajuda*"
        );
      }
    }

    if(printWithChance()) try {msg.react("🏳️‍🌈")} catch (e) { console.log("Erro ao reagir com emoji.") }
  }

});

/**
 * @returns {void}
 */
const clearVariable = () => {
  limparTreinosSemanais();
  console.log("Variable cleared.");
};

cron.schedule("59 23 * * 6", clearVariable);

client.initialize();
