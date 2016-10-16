require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api'),
  bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true});

var secrets = [];

var options = {
  reply_markup: JSON.stringify({
    force_reply: true
  })
};

bot.onText(/\/tellasecret/, (msg) => {
  var fromId = msg.from.id;
  console.log('opa');
  bot.sendMessage(fromId, 'Tell me a secret, I\'ll keep it!', options)
    .then((msg) => {
      console.log('skldjfsdjkf ' + JSON.stringify(msg));
      bot.onReplyToMessage(msg.chat.id, msg.message_id, (msg) => {
        secrets.push({secret: msg.text, who: msg.from.username});
        bot.sendMessage(fromId, 'Saved! Try this command: /getasecret');
      })
    });
});

bot.onText(/\/getasecret/, (msg) => {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, secrets[Math.round(Math.random() * (secrets.length - 1))].secret);
});
