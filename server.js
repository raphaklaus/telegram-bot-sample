require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api'),
  bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true}),
  bunyan = require('bunyan');
  logger = bunyan.createLogger({
    name: 'Bot'
  });

var secrets = [];

var options = {
  reply_markup: JSON.stringify({
    force_reply: true
  })
};

logger.info('I\'s alive!');

bot.onText(/\/tellasecret/, (msg) => {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, 'Tell me a secret, I\'ll keep it!', options)
    .then((msg) => {
      bot.onReplyToMessage(msg.chat.id, msg.message_id, (msg) => {
        logger.info(`New secret entered: ${msg.text} from ${msg.from.username}`);
        secrets.push({secret: msg.text, who: msg.from.username});
        bot.sendMessage(fromId, 'Saved! Try this command: /getasecret');
      })
    });
});

bot.onText(/\/getasecret/, (msg) => {
  var fromId = msg.from.id;
  if (secrets.length > 0)
    bot.sendMessage(fromId, secrets[Math.round(Math.random() * (secrets.length - 1))].secret);
  else
    bot.sendMessage(fromId, 'Sorry, there is no secret yet, please use the command /tellasecret');
});
