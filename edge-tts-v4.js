// jinyj 的 Edge TTS 客户端 - 实测稳定版
// 只包含实测稳定的 15 种声音（其他 17 种偶尔失败，已移除）
// 修复：开头 2 字读 2 遍问题

(function(window) {
  'use strict';

  // 永久域名 URL
  const WORKER_URL = 'https://tts.jinyj.ccwu.cc';

  // 实测稳定的 15 种声音（基于 2026-08-03 真实测试）
  // 移除：英文 7 个、法德意俄 4 个、xiaomeng/xiaohan/yunye/yunzhi/xiaorui（不稳定）
  const DEFAULT_VOICES = [
    // 普通话 5 种
    { ShortName: 'zh-CN-XiaoxiaoNeural', FriendlyName: '晓晓 (Xiaoxiao) - 普通话女声', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunxiNeural', FriendlyName: '云希 (Yunxi) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunjianNeural', FriendlyName: '云健 (Yunjian) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaoyiNeural', FriendlyName: '晓伊 (Xiaoyi) - 普通话女声', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunyangNeural', FriendlyName: '云扬 (Yunyang) - 普通话男声', Gender: 'Male', Locale: 'zh-CN' },
    // 中文方言 2 种
    { ShortName: 'zh-CN-liaoning-XiaobeiNeural', FriendlyName: '晓北 (Xiaobei) - 东北话女声', Gender: 'Female', Locale: 'zh-CN-liaoning' },
    { ShortName: 'zh-CN-shaanxi-XiaoniNeural', FriendlyName: '晓妮 (Xiaoni) - 陕西话女声', Gender: 'Female', Locale: 'zh-CN-shaanxi' },
    // 粤语 2 种
    { ShortName: 'zh-HK-HiuMaanNeural', FriendlyName: '晓曼 (HiuMaan) - 粤语女声', Gender: 'Female', Locale: 'zh-HK' },
    { ShortName: 'zh-HK-WanLungNeural', FriendlyName: '云龙 (WanLung) - 粤语男声', Gender: 'Male', Locale: 'zh-HK' },
    // 台湾普通话 2 种
    { ShortName: 'zh-TW-HsiaoChenNeural', FriendlyName: '晓臻 (HsiaoChen) - 台湾女声', Gender: 'Female', Locale: 'zh-TW' },
    { ShortName: 'zh-TW-YunJheNeural', FriendlyName: '云哲 (YunJhe) - 台湾男声', Gender: 'Male', Locale: 'zh-TW' },
    // 日语 2 种
    { ShortName: 'ja-JP-NanamiNeural', FriendlyName: '七海 (Nanami) - 日语女声', Gender: 'Female', Locale: 'ja-JP' },
    { ShortName: 'ja-JP-KeitaNeural', FriendlyName: '慶太 (Keita) - 日语男声', Gender: 'Male', Locale: 'ja-JP' },
    // 韩语 2 种
    { ShortName: 'ko-KR-SunHiNeural', FriendlyName: '선히 (Sun-Hi) - 韩语女声', Gender: 'Female', Locale: 'ko-KR' },
    { ShortName: 'ko-KR-InJoonNeural', FriendlyName: '인준 (InJoon) - 韩语男声', Gender: 'Male', Locale: 'ko-KR' },
  ];

  // 暴露给全局
  window.EdgeTTS = {
    DEFAULT_VOICES,
    WORKER_URL,
  };
})(window);