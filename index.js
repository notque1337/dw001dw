import { parseInfo, DownloadAudioOnly } from "./src/youtube.js";
import { Telegraf } from 'telegraf';
import mongoose from "mongoose";
import { RdIdUser } from "./models/post.js";
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
const port = 8000 || process.env.PORT
dotenv.config();
const API_TOKEN_TGBOT = process.env.API_TOKEN_TGBOT;
console.log('api', API_TOKEN_TGBOT)
const db = process.env.CONNECT_KEY_MONGO;
mongoose.set("strictQuery", false);
mongoose
.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((res)=> console.log('connected to DB'))
.catch((err)=> console.log('err'))

const StreamersRegexList = {
    YOUTUBE: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(((.*(\?|\&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/,
};

var app = express()

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('App listening at http://%s:%s', host, port)
})

const bot = new Telegraf(API_TOKEN_TGBOT, {handlerTimeout: 9_000_000});
bot.start(ctx => {
  const idUser =  ctx.from.id
  const rdIdUser = new RdIdUser({idUser});
  rdIdUser.save()
  .then((result) => console.log(result))
  .catch((error) => console.log(error))

  ctx.replyWithHTML("Привет. Отправь мне ссылку на видео YouTube - получи звук из видео");

})

bot.command('allcountusers', (ctx) => {
  RdIdUser.find()
  .then((result) => {
  let smUsers = Object.keys(result).length
  ctx.reply(`Всего юзеров, ${smUsers}`);
  })


});



bot.on('message', async (ctx) => {
  if(StreamersRegexList.YOUTUBE.test(ctx.message.text)){
  console.log(ctx.message.text);
  const infVideo = await parseInfo(ctx.message.text);
  try{
  const getBufferVideo = await DownloadAudioOnly(infVideo);
    ctx.reply("Начал загрузку аудио, в среднем это занимает длительность видео...");
    
    

 const sendAudioUser = await ctx.replyWithAudio({
    url: `${getBufferVideo[0]}`,
    filename: `${getBufferVideo[1]}`},
    {
    caption: `Получай аудио из видео YouTube: @SkachatmuzikuYoutubeBOT`
  })
  
console.log(sendAudioUser);
  // Using context shortcut
  await ctx.reply(`Надеюсь я тебе помог :)`);
}catch(e){
  await ctx.reply(`У нас проблемы.. мы пытаемся их решить`);
}
}else{
    await ctx.reply(`Я понимаю только Ютуб, проверь ссылку`);

}

});




bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
