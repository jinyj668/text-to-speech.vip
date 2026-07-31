// jinyj 的 Edge TTS 客户端 - Cloudflare Tunnel 版
// 通过 jinyj 的 Windows 服务器 + Cloudflare Tunnel 调用 Edge TTS

(function(window) {
  'use strict';

  // ★★★ 关键：使用 jinyj 自己的 Windows 服务器 URL（永久域名）
  const WORKER_URL = 'https://tts.jinyj.ccwu.cc';

  // 30+ Edge TTS 常用语音
  const DEFAULT_VOICES = [
    { ShortName: 'zh-CN-XiaoxiaoNeural', FriendlyName: 'Microsoft Xiaoxiao Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunxiNeural', FriendlyName: 'Microsoft Yunxi Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunjianNeural', FriendlyName: 'Microsoft Yunjian Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaoyiNeural', FriendlyName: 'Microsoft Xiaoyi Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunyangNeural', FriendlyName: 'Microsoft Yunyang Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaomengNeural', FriendlyName: 'Microsoft Xiaomeng Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaohanNeural', FriendlyName: 'Microsoft Xiaohan Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunyeNeural', FriendlyName: 'Microsoft Yunye Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-YunzhiNeural', FriendlyName: 'Microsoft Yunzhi Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Male', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-XiaoruiNeural', FriendlyName: 'Microsoft Xiaorui Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-liaoning-XiaobeiNeural', FriendlyName: 'Microsoft Xiaobei Online (Natural) - Chinese (Liaoning)', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-CN-shaanxi-XiaoniNeural', FriendlyName: 'Microsoft Xiaoni Online (Natural) - Chinese (Shaanxi)', Gender: 'Female', Locale: 'zh-CN' },
    { ShortName: 'zh-HK-HiuMaanNeural', FriendlyName: 'Microsoft HiuMaan Online (Natural) - Chinese (Cantonese, Traditional)', Gender: 'Female', Locale: 'zh-HK' },
    { ShortName: 'zh-HK-WanLungNeural', FriendlyName: 'Microsoft WanLung Online (Natural) - Chinese (Cantonese, Traditional)', Gender: 'Male', Locale: 'zh-HK' },
    { ShortName: 'zh-TW-HsiaoChenNeural', FriendlyName: 'Microsoft HsiaoChen Online (Natural) - Chinese (Taiwanese Mandarin)', Gender: 'Female', Locale: 'zh-TW' },
    { ShortName: 'zh-TW-YunJheNeural', FriendlyName: 'Microsoft YunJhe Online (Natural) - Chinese (Taiwanese Mandarin)', Gender: 'Male', Locale: 'zh-TW' },
    { ShortName: 'en-US-JennyNeural', FriendlyName: 'Microsoft Jenny Online (Natural) - English (United States)', Gender: 'Female', Locale: 'en-US' },
    { ShortName: 'en-US-GuyNeural', FriendlyName: 'Microsoft Guy Online (Natural) - English (United States)', Gender: 'Male', Locale: 'en-US' },
    { ShortName: 'en-US-AriaNeural', FriendlyName: 'Microsoft Aria Online (Natural) - English (United States)', Gender: 'Female', Locale: 'en-US' },
    { ShortName: 'en-US-DavisNeural', FriendlyName: 'Microsoft Davis Online (Natural) - English (United States)', Gender: 'Male', Locale: 'en-US' },
    { ShortName: 'en-US-TonyNeural', FriendlyName: 'Microsoft Tony Online (Natural) - English (United States)', Gender: 'Male', Locale: 'en-US' },
    { ShortName: 'en-GB-SoniaNeural', FriendlyName: 'Microsoft Sonia Online (Natural) - English (United Kingdom)', Gender: 'Female', Locale: 'en-GB' },
    { ShortName: 'en-GB-RyanNeural', FriendlyName: 'Microsoft Ryan Online (Natural) - English (United Kingdom)', Gender: 'Male', Locale: 'en-GB' },
    { ShortName: 'ja-JP-NanamiNeural', FriendlyName: 'Microsoft Nanami Online (Natural) - Japanese (Japan)', Gender: 'Female', Locale: 'ja-JP' },
    { ShortName: 'ja-JP-KeitaNeural', FriendlyName: 'Microsoft Keita Online (Natural) - Japanese (Japan)', Gender: 'Male', Locale: 'ja-JP' },
    { ShortName: 'ko-KR-SunHiNeural', FriendlyName: 'Microsoft SunHi Online (Natural) - Korean (Korea)', Gender: 'Female', Locale: 'ko-KR' },
    { ShortName: 'ko-KR-InJoonNeural', FriendlyName: 'Microsoft InJoon Online (Natural) - Korean (Korea)', Gender: 'Male', Locale: 'ko-KR' },
    { ShortName: 'fr-FR-DeniseNeural', FriendlyName: 'Microsoft Denise Online (Natural) - French (France)', Gender: 'Female', Locale: 'fr-FR' },
    { ShortName: 'de-DE-KatjaNeural', FriendlyName: 'Microsoft Katja Online (Natural) - German (Germany)', Gender: 'Female', Locale: 'de-DE' },
    { ShortName: 'es-ES-ElviraNeural', FriendlyName: 'Microsoft Yaoyao Online (Natural) - Chinese (Mandarin, Simplified)', Gender: 'Female', Locale: 'es-ES' },
    { ShortName: 'it-IT-ElsaNeural', FriendlyName: 'Microsoft Elsa Online (Natural) - Italian (Italy)', Gender: 'Female', Locale: 'it-IT' },
    { ShortName: 'ru-RU-SvetlanaNeural', FriendlyName: 'Microsoft Svetlana Online (Natural) - Russian (Russia)', Gender: 'Female', Locale: 'ru-RU' },
  ];

  // 生成音频（HTTP POST 到 jinyj 的 Windows 服务器）
  async function generateAudio(text, voice, rate, volume) {
    const response = await fetch(WORKER_URL + '/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text,
        voice: voice,
        rate: String(rate || '0%'),
        volume: String(volume || '0%'),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error('Server error: ' + response.status + ' ' + errText);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('audio')) {
      const errText = await response.text();
      throw new Error('Non-audio response: ' + errText);
    }

    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  // 暴露给全局
  window.EdgeTTS = {
    DEFAULT_VOICES,
    generateAudio,
    WORKER_URL,
  };
})(window);