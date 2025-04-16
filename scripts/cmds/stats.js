const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "stats",
    category: "MEDIA",
    author: "Nyx",
  },

  onStart: async ({ event, message, usersData, api, args }) => {
    try {
      let uid;
      const uid1 = event.senderID;
      const uid2 = Object.keys(event.mentions)[0];

      if (args[0]) {
        if (/^\d+$/.test(args[0])) {
          uid = args[0];
        } else {
          const match = args[0].match(/profile\.php\?id=(\d+)/);
          if (match) {
            uid = match[1];
          }
        }
      }

      if (!uid) {
        uid = event.type === "message_reply" ? event.messageReply.senderID : uid2 || uid1;
      }

      const userID = uid;
      const profilePicUrl = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(userID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      const name = userInfo[userID]?.name || "Unknown";
      const userData = await usersData.get(userID);
      const money = userData?.money || 0;
      const exp = userData?.exp || 0;
      const tinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${profilePicUrl}`);
      const shortUrl = tinyUrlResponse.data;
      const Response = await axios.get(
        `https://www.noobz-api.rf.gd/api/stats?name=${name}&url=${shortUrl}&money=${money}&exp=${exp}`
      );
      const imageUrl = Response.data.image;
      console.log(imageUrl);

      if (!imageUrl) {
        message.reply("❌ Failed to generate the image.");
      }
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const filePath = `${__dirname}/cache/stats.png`;
      fs.writeFileSync(filePath, imageResponse.data);

    message.reply(
        {
          body: `Hey ${name}! 😊\n\n💰 Total Money: ${money}\n✨ EXP: ${exp}`,
          attachment: fs.createReadStream(filePath),
        },
        () => fs.unlinkSync(filePath)
      );
    } catch (error) {
      message.reply("❌ Failed to retrieve user information. Please try again later."+''+error.message);
    }
  },
};
