module.exports.config = {
  name: "أوامر",
  version: "1.0.5",
  hasPermssion: 0,
  credits: "حمودي سان 🇸🇩 | تعديل ChatGPT",
  description: "قائمة الأوامر كاملة",
  commandCategory: "النظام",
  usages: "[رقم الصفحة/الكل]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  "ar": {
    "helpList": "🍭 يوجد %1 أمر في Dora Bot 🍭\n\nاكتب: 'أوامر [رقم]' لعرض قسم آخر\nاكتب: 'أوامر الكل' لعرض جميع الأوامر ✨",
    "moduleInfo": "🍭✨ 「 %1 」 ✨🍭\n📜 الوصف: %2\n📌 الاستخدام: %3\n📂 القسم: %4\n⏳ الوقت: %5 ثانية\n👑 الصلاحية: %6\n✍️ المطور: %7"
  }
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  const arrayInfo = [];
  for (var [name] of commands) arrayInfo.push(name);
  arrayInfo.sort();

  const numberOfOnePage = 20;

  // لو كتب "أوامر الكل"
  if (args[0] && args[0].toLowerCase() === "الكل") {
    let msg = "🍭✨ قائمة كل الأوامر ✨🍭\n\n";
    let i = 0;
    for (let item of arrayInfo) {
      msg += `🍭 ${++i}. 『${item}』\n📜 ${commands.get(item).config.description}\n━━━━━━━━━━━━━━━ 🍭\n`;
    }
    msg += `\n📑 المجموع: ${arrayInfo.length} أمر\n👑 البادئة: ${prefix}`;
    return api.sendMessage(msg, threadID, async (error, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    });
  }

  // تحديد الصفحة (افتراضي 1)
  const page = parseInt(args[0]) || 1;
  const startSlice = numberOfOnePage * (page - 1);
  const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

  if (returnArray.length === 0) {
    return api.sendMessage("🍭❌ هذه الصفحة غير موجودة 🍭", threadID, messageID);
  }

  let msg = `🍭✨ قائمة الأوامر (📖 صفحة ${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}) ✨🍭\n\n`;
  let i = startSlice;
  for (let item of returnArray) {
    msg += `🍭 ${++i}. 『${item}』\n📜 ${commands.get(item).config.description}\n━━━━━━━━━━━━━━━ 🍭\n`;
  }
  msg += `\n📑 المجموع: ${arrayInfo.length} أمر\n👑 البادئة: ${prefix}\n\n💡 اكتب: أوامر [رقم] لعرض صفحة أخرى\n💡 أوامر الكل لعرض جميع الأوامر`;

  return api.sendMessage(msg, threadID, async (error, info) => {
    if (autoUnsend) {
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(info.messageID);
    }
  });
};
