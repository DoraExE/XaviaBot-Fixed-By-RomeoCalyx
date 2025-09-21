module.exports.config = {
  name: "المطور",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "حمودي سان",
  description: "يعرض معلومات المطور",
  commandCategory: "المطور",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;

  try {
    // رسالة أولى تطلب من المستخدمين نداء "مطور"
    await api.sendMessage("🤖🔍 أين المطور؟ أنا لا أراه... هل ترون المطور؟ قولوا: \"مطور\"", threadID);

    // ننتظر قليلاً ثم نرد بـ "أحسنتم" ومعلومات المطور
    await new Promise(resolve => setTimeout(resolve, 1800));

    const devInfo =
`✨ أحسنتم! ✨

🧑‍💻 اسم المطور: حمودي سان
🔗 الصفحة على فيسبوك: https://www.facebook.com/DoraYogiEXE
🌍 البلد: السودان 🇸🇩
🎭 الشخصية المفضلة: Dora
🎮 Free Fire ID: 12345678 🏴‍☠️
📱 واتساب: +249900042500

♥️🥰 أحبكم سنافري — أفعل ما بوسعي لإسعادكم`;

    return api.sendMessage(devInfo, threadID);
  } catch (err) {
    return api.sendMessage("⚠️ حدث خطأ أثناء جلب معلومات المطور.", threadID);
  }
};
