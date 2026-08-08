const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenAI } = require('@google/generative-ai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// FIXED INITIALIZATION FOR GEMINI
const ai = new GoogleGenAI(process.env.GEMINI_KEY);

const SYSTEM_PROMPT = `
You are a polite, safe, and appropriate Discord server assistant. Keep your responses short and friendly.
Rules:
1. If someone asks how to get early access, tester, EA, or anything similar, output this exact text layout:
**To get Early Access u Need to Do one of the Following:**
1. Boost Server Twice
2. Invite 20 Members
3. Reach Level 10
4. Pay 350 Robux

2. If someone asks who made you or anything similar, respond: "I was made by Zenix (Zdev)".
`;

client.once('ready', () => {
  console.log("True Cloud AI Bot is live 24/7!");
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const msgLower = message.content.toLowerCase();
  const isTag = message.mentions.has(client.user);
  const isKeyword = msgLower.includes('ea') || msgLower.includes('tester') || msgLower.includes('access') || msgLower.includes('made you') || msgLower.includes('creator');

  if (isTag || isKeyword) {
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser says: ${message.content}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      
      return message.reply(response.text());
    } catch (err) {
      console.error(err);
      return message.reply("My AI connection hit a small snag. Try again!");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
