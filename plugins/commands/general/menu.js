module.exports.config = {
  name: "اوامر",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "حمودي سان 🇸🇩",
  description: "قائمة الأوامر كاملة بستايل دورا 🍭",
  commandCategory: "النظام",
  usages: "[اسم الأمر | رقم الصفحة]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 30
  }
};

module.exports.languages = {
  "ar": {
    "moduleInfo": "❀━━━━〖 %1 〗━━━━❀\n🍭 الوصف: %2\n📌 طريقة الاستعمال: %3\n📂 القسم: %4\n⏳ الانتظار: %5 ثانية\n👑 الصلاحية: %6\n✨ الكود بواسطة: %7 ✨",
    "helpList": "🍭 يوجد %1 أمر في دورا بوت! 🍭\nاستخدم: 『 %2اوامر اسم_الأمر 』 لرؤية تفاصيل أي أمر ✨",
    "user": "👤 مستخدم",
    "adminGroup": "👑 أدمن المجموعة",
    "adminBot": "⚡ أدمن البوت",
    "notFound": "🍭 هل ترون الخطأ؟ أنا لا أراه 👀"
  }
};

module.exports.run = function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  // لو المستخدم كتب اسم أمر موجود
  if (command) {
    return api.sendMessage(
      getText("moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`,
        command.config.commandCategory,
        command.config.cooldowns,
        ((command.config.hasPermssion == 0) ? getText("user") :
          (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")),
        command.config.credits
      ),
      threadID,
      messageID
    );
  }

  // لو المستخدم كتب رقم صفحة
  const arrayInfo = [];
  for (var [name] of (commands)) arrayInfo.push(name);
  arrayInfo.sort();

  const numberOfOnePage = 10; // عدد الأوامر في كل صفحة
  const page = parseInt(args[0]) || 1;
  const startSlice = numberOfOnePage * (page - 1);
  const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

  if (returnArray.length === 0) {
    return api.sendMessage(getText("notFound"), threadID, messageID);
  }

  let msg = "❀━━━━〖 🍭 دورا بوت 🍭 〗━━━━❀\n\n";
  let i = startSlice;

  for (let item of returnArray) {
    msg += `🍭 ${++i}. 『${item}』\n`;
    msg += `✨ الوصف: ${commands.get(item).config.description}\n`;
    msg += "━━━━━━━━━━━━━━━\n";
  }

  msg += `📖 الصفحة: (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\n`;
  msg += `👑 البادئة: ${prefix}\n`;
  msg += `📜 إجمالي الأوامر: ${arrayInfo.length}\n`;
  msg += "❀━━━━━━━━━━━━❀";

  return api.sendMessage(msg, threadID, async (error, info) => {
    if (autoUnsend) {
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(info.messageID);
    }
  });
};
