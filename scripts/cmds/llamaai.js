 const axios = require("axios");

const aApi = async () => {
  const a = await axios.get(
    "https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json"
  );
  return a.data.api;
};

module.exports.config = {
  name: "llamaai",
  aliases: ["lma", "llama", "llm"],
  version: "1.6.9",
  author: "Nazrul",
  role: 0,
  category: "ai",
  description: "Talk with AI assistant model llama",
  countDown: 5,
  guide: {
    en: "{pn} your question",
  },
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const prompt = args.join(" ");
  if (!prompt) {
    return api.sendMessage("🛠️ Use: /llm hey", event.threadID, event.messageID);
  }

  const data = await usersData.get(event.senderID);
  const name = data?.name || "Darling";
  const mentions = [{ id: event.senderID, tag: name }];

  try {
    const res = await axios.get(`${await aApi()}/nazrul/llama?q=${encodeURIComponent(prompt)}`);
    const text = res.data.result[0].message.content;

    const replyMessage = `🎀 Hey, ${name}\n\n🛠️ ${text}`;
    api.sendMessage(
      { body: replyMessage, mentions },
      event.threadID,
      (error, info) => {
        if (error) return api.sendMessage("An error occurred!", event.threadID, event.messageID);

        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          msg: replyMessage,
        });
      },
      event.messageID
    );
  } catch (err) {
    api.sendMessage(`error🦆💨`, event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event, args }) => {
  const xPrompt = args.join(" ");
  if (!xPrompt) return;

  try {
    const res = await axios.get(`${await aApi()}/nazrul/llama?q=${encodeURIComponent(xPrompt)}`);
    const text2 = res.data.result[0].message.content;

    api.sendMessage(
      { body: text2 },
      event.threadID,
      (error, info) => {
        if (error) return api.sendMessage("An error occurred!", event.threadID, event.messageID);

        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          msg: text2,
        });
      },
      event.messageID
    );
  } catch (err) {
    api.sendMessage(`error🦆💨`, event.threadID, event.messageID);
  }
};
