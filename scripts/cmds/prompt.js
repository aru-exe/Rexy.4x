const axios = require('axios');

const config = {
  name: 'prompt',
  category: 'MEDIA',
  author: 'Nyx'
};

const onStart = async function({ api, event, args }) {
  try {
  const i = event.messageReply.attachments[0].url;
          const tinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${i}`);
          const tinyUrl = tinyUrlResponse.data;
         /* const h = await axios.get(`https://ljrm5l-8000.csb.app/api/imgur?link=${tinyUrl}`)
          const imgurLink = h.data;*/
    if (!tinyUrl) {
      return api.sendMessage(
        '❌ Please reply to a message with an image attachment.',
        event.threadID,
        event.messageID
      );
    }

const b = await axios.get(`https://www.noobz-api.rf.gd/api/prompt?url=${tinyUrl}`)
   api.sendMessage(
      ` ${b.data}`,
      event.threadID,
      event.messageID
    );
  } catch (error) {
    console.error(error);
    return api.sendMessage(
      '❌ An error occurred while processing your request.',
      event.threadID,
      event.messageID
    );
  }
};

module.exports = {
  config,
  onStart
};
