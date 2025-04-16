module.exports = {
  config: {
    name: "imagine",
    aliases: ["t2i", "gen"],
    version: "1.0",
    author: "Anas", // Updated author
    countDown: 3, // Reduced countdown for faster response
    role: 0,
    longDescription: {
      vi: "",
      en: "Get images from text.",
    },
    category: "araf",
    guide: {
      vi: "",
      en:
        "Type {pn} with your prompts\nExample: {pn} cute dog\nYou can also specify a model and ratio (optional).\nExample: {pn} cute dog | 3 | 1:1",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const text = args.join(" ");
      if (!text) {
        return message.reply("Please provide a prompt.");
      }

      let prompt = text;
      let model = "3"; // Default model if not provided
      let ratio = "1:1"; // Default ratio if not provided

      // Check if a model and ratio are specified in the prompt
      if (text.includes("|")) {
        const [promptText, modelText, ratioText] = text.split("|").map((str) => str.trim());
        prompt = promptText;
        model = modelText || model; // Use provided model, or fallback to default
        ratio = ratioText || ratio; // Use provided ratio, or fallback to default
      }

      // Send a quick message to indicate the process is ongoing
      const waitingMessage = await message.reply("✅ | Creating your Imagination...");

      // Build the API URL using the provided prompt
      const API = `https://hasans-api.onrender.com/imagine?prompt=${encodeURIComponent(prompt)}`;

      // Make the API call to get the image quickly
      const imageStream = await global.utils.getStreamFromURL(API);

      // Send the generated image as an attachment
      await message.reply({
        attachment: imageStream,
      });

      // Unsending the waiting message and sending the final response
      await api.unsendMessage(waitingMessage.messageID);

    } catch (error) {
      console.log(error);
      message.reply("Failed to generate the image. Please try again later.");
    }
  },
};
