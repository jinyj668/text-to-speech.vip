// jinyj 的 Edge TTS 客户端 - 32 种声音完整版
// 通过 jinyj 的 Windows 服务器 + Cloudflare Tunnel 调用 Edge TTS

(function(window) {
  'use strict';

  // 永久域名 URL
  const WORKER_URL = 'https://tts.jinyj.ccwu.cc';

  // 32 种 Edge TTS 神经声音（完整版）
  const DEFAULT_VOICES = [
    // 普通话 5 种
    { ShortName: 'zh-CN-XiaoxiaoNeural', FriendlyName: '晓晓 (Xiaoxiao) - 普通话女声', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunxiNeural', FriendlyName: '云希 (Yunxi) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunjianNeural', FriendlyName: '云健 (Yunjian) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaoyiNeural', FriendlyName: '晓伊 (Xiaoyi) - 普通话女声', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunyangNeural', FriendlyName: '云扬 (Yunyang) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    // 中文女 3 种
    { ShortName: 'zh-CN-XiaomengNeural', FriendlyName: '晓梦 (Xiaomeng) - 普通话女声', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaohanNeural', FriendlyName: '晓涵 (Xiaohan) - 普通话女声', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaoruiNeural', FriendlyName: '晓睿 (Xiaorui) - 普通话女声', Gender: 'Female', Locale: 'zh-CN' },
    // 中文男 2 种
    { ShortName: 'zh-CN-YunyeNeural', FriendlyName: '云野 (Yunye) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunzhiNeural', FriendlyName: '云之 (Yunzhi) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    // 中文方言 2 种
    { ShortName: 'zh-CN-liaoning-XiaobeiNeural', FriendlyName: '晓北 (Xiaobei) - 东北话女声', Gender: 'Female', Locale: 'zh-CN-liaoning' },
    { ShortName: 'zh-CN-shaanxi-XiaoniNeural', FriendlyName: '晓妮 (Xiaoni) - 陕西话女声', Gender: 'Female', Locale: 'zh-CN-shaanxi' },
    // 粤语 2 种
    { ShortName: 'zh-HK-HiuMaanNeural', FriendlyName: '晓曼 (HiuMaan) - 粤语女声', Gender: 'Female', Locale: 'zh-HK' },
    { ShortName: 'zh-HK-WanLungNeural', FriendlyName: '云龙 (WanLung) - 粤语男声', Gender: 'Male', Locale: 'zh-HK' },
    // 台湾普通话 2 种
    { ShortName: 'zh-TW-HsiaoChenNeural', FriendlyName: '晓臻 (HsiaoChen) - 台湾女声', Gender: 'Female', Locale: 'zh-TW' },
    { ShortName: 'zh-TW-YunJheNeural', FriendlyName: '云哲 (YunJhe) - 台湾男声', Gender: 'Male', Locale: 'zh-TW' },
    // 英文 7 种
    { ShortName: 'en-US-JennyNeural', FriendlyName: 'Jenny - 英语女声 (美式)', Gender: 'Female', Locale: 'en-US' },
    { ShortName: 'en-US-GuyNeural', FriendlyName: 'Guy - 英语男声 (美式)', Gender: 'Male', Locale: 'en-US' },
    { ShortName: 'en-US-AriaNeural', FriendlyName: 'Aria - 英语女声 (美式)', Gender: 'Female', Locale: 'en-US' },
    { ShortName: 'en-US-DavisNeural', FriendlyName: 'Davis - 英语男声 (美式)', Gender: 'Male', Locale: 'en-US' },
    { ShortName: 'en-US-TonyNeural', FriendlyName: 'Tony - 英语男声 (美式)', Gender: 'Male', Locale: 'en-US' },
    { ShortName: 'en-GB-SoniaNeural', FriendlyName: 'Sonia - 英语女声 (英式)', Gender: 'Female', Locale: 'en-GB' },
    { ShortName: 'en-GB-RyanNeural', FriendlyName: 'Ryan - 英语男声 (英式)', Gender: 'Male', Locale: 'en-GB' },
    // 日语 2 种
    { ShortName: 'ja-JP-NanamiNeural', FriendlyName: '七海 (Nanami) - 日语女声', Gender: 'Female', Locale: 'ja-JP' },
    { ShortName: 'ja-JP-KeitaNeural', FriendlyName: '慶太 (Keita) - 日语男声', Gender: 'Male', Locale: 'ja-JP' },
    // 韩语 2 种
    { ShortName: 'ko-KR-SunHiNeural', FriendlyName: '선히 (Sun-Hi) - 韩语女声', Gender: 'Female', Locale: 'ko-KR' },
    { ShortName: 'ko-KR-InJoonNeural', FriendlyName: '인준 (InJoon) - 韩语男声', Gender: 'Male', Locale: 'ko-KR' },
    // 法德意俄西 5 种
    { ShortName: 'fr-FR-DeniseNeural', FriendlyName: 'Denise - 法语女声', Gender: 'Female', Locale: 'fr-FR' },
    { ShortName: 'de-DE-KatjaNeural', FriendlyName: 'Katja - 德语女声', Gender: 'Female', Locale: 'de-DE' },
    { ShortName: 'es-ES-ElviraNeural', FriendlyName: 'Elvira - 西班牙语女声', Gender: 'Female', Locale: 'es-ES' },
    { ShortName: 'it-IT-ElsaNeural', FriendlyName: 'Elsa - 意大利语女声', Gender: 'Female', Locale: 'it-IT' },
    { ShortName: 'ru-RU-SvetlanaNeural', FriendlyName: 'Светлана - 俄语女声', Gender: 'Female', Locale: 'ru-RU' },
  ];

  // 暴露给全局
  window.EdgeTTS = {
    DEFAULT_VOICES,
    WORKER_URL,
  };
})(window);