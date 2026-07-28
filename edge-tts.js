/**
 * jinyj 的 Edge TTS 浏览器实现
 * 基于 travisvn/edge-tts-client (TypeScript) 翻译为纯 JavaScript
 *
 * 关键特性：
 * - 纯前端，无需后端
 * - 调用 Microsoft Edge TTS 官方 API
 * - 30+ 高质量神经声音
 * - 完全免费
 */

const EDGE_TTS = {
  CLIENT_TOKEN: '6A5AA1D4EAFF4E9FB37E23D68491D6F4',
  SYNTH_URL: 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4',
  VOICES_URL: 'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4',
  BINARY_DELIM: 'Path:audio\r\n',
  VOICE_LANG_REGEX: /\w{2}-\w{2}/,
  OUTPUT_FORMAT: 'audio-24khz-96kbitrate-mono-mp3',
};

// 30+ 常用 Edge TTS 语音（精简版，加载后会被官方列表覆盖）
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
  { ShortName: 'en-US-JaneNeural', FriendlyName: 'Microsoft Jane Online (Natural) - English (United States)', Gender: 'Female', Locale: 'en-US' },
  { ShortName: 'en-US-NancyNeural', FriendlyName: 'Microsoft Nancy Online (Natural) - English (United States)', Gender: 'Female', Locale: 'en-US' },
  { ShortName: 'en-US-SaraNeural', FriendlyName: 'Microsoft Sara Online (Natural) - English (United States)', Gender: 'Female', Locale: 'en-US' },
  { ShortName: 'en-GB-SoniaNeural', FriendlyName: 'Microsoft Sonia Online (Natural) - English (United Kingdom)', Gender: 'Female', Locale: 'en-GB' },
  { ShortName: 'en-GB-RyanNeural', FriendlyName: 'Microsoft Ryan Online (Natural) - English (United Kingdom)', Gender: 'Male', Locale: 'en-GB' },
  { ShortName: 'ja-JP-NanamiNeural', FriendlyName: 'Microsoft Nanami Online (Natural) - Japanese (Japan)', Gender: 'Female', Locale: 'ja-JP' },
  { ShortName: 'ja-JP-KeitaNeural', FriendlyName: 'Microsoft Keita Online (Natural) - Japanese (Japan)', Gender: 'Male', Locale: 'ja-JP' },
  { ShortName: 'ko-KR-SunHiNeural', FriendlyName: 'Microsoft SunHi Online (Natural) - Korean (Korea)', Gender: 'Female', Locale: 'ko-KR' },
  { ShortName: 'ko-KR-InJoonNeural', FriendlyName: 'Microsoft InJoon Online (Natural) - Korean (Korea)', Gender: 'Male', Locale: 'ko-KR' },
  { ShortName: 'fr-FR-DeniseNeural', FriendlyName: 'Microsoft Denise Online (Natural) - French (France)', Gender: 'Female', Locale: 'fr-FR' },
  { ShortName: 'fr-FR-HenriNeural', FriendlyName: 'Microsoft Henri Online (Natural) - French (France)', Gender: 'Male', Locale: 'fr-FR' },
  { ShortName: 'de-DE-KatjaNeural', FriendlyName: 'Microsoft Katja Online (Natural) - German (Germany)', Gender: 'Female', Locale: 'de-DE' },
  { ShortName: 'de-DE-ConradNeural', FriendlyName: 'Microsoft Conrad Online (Natural) - German (Germany)', Gender: 'Male', Locale: 'de-DE' },
  { ShortName: 'es-ES-ElviraNeural', FriendlyName: 'Microsoft Elvira Online (Natural) - Spanish (Spain)', Gender: 'Female', Locale: 'es-ES' },
  { ShortName: 'it-IT-ElsaNeural', FriendlyName: 'Microsoft Elsa Online (Natural) - Italian (Italy)', Gender: 'Female', Locale: 'it-IT' },
  { ShortName: 'ru-RU-SvetlanaNeural', FriendlyName: 'Microsoft Svetlana Online (Natural) - Russian (Russia)', Gender: 'Female', Locale: 'ru-RU' },
];

// ============================================
// EdgeTTSClient 类（纯 JS 实现）
// ============================================

class EdgeTTSClient {
  constructor(enableLogging = false) {
    this.log = enableLogging ? console.log.bind(console) : () => {};
    this.ws = null;
    this.voice = null;
    this.voiceLocale = null;
    this.requestQueue = {};
    this.connectionStartTime = 0;
  }

  async sendMessage(message) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (attempt === 1) this.connectionStartTime = Date.now();
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.log(`Connecting... attempt ${attempt}`);
        await this.initWebSocket();
      } else {
        break;
      }
    }
    this.ws.send(message);
  }

  initWebSocket() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(EDGE_TTS.SYNTH_URL);
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = () => {
        this.log('Connected in', (Date.now() - this.connectionStartTime) / 1000, 's');
        this.sendMessage(this.getConfigMessage()).then(resolve);
      };

      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onclose = () => this.handleClose();
      this.ws.onerror = (err) => reject('WebSocket error: ' + err);
    });
  }

  handleMessage(event) {
    const buffer = new Uint8Array(event.data);
    const decoder = new TextDecoder();
    const message = decoder.decode(buffer);

    const requestIdMatch = /X-RequestId:(.*?)\r\n/.exec(message);
    const requestId = requestIdMatch ? requestIdMatch[1] : '';

    if (message.includes('Path:turn.end')) {
      const emitter = this.requestQueue[requestId];
      if (emitter) {
        emitter.audioData = emitter.audioChunks.join('');
        emitter.onEnd && emitter.onEnd();
      }
    } else if (message.includes('Path:audio')) {
      this.cacheAudioData(buffer, requestId);
    } else if (message.includes('Path:turn.start')) {
      // 标记新请求开始
    } else {
      this.log('Unknown message:', message.slice(0, 100));
    }
  }

  cacheAudioData(buffer, requestId) {
    const delimBytes = new TextEncoder().encode(EDGE_TTS.BINARY_DELIM);
    const delimIndex = this.findDelimiterIndex(buffer, delimBytes);

    if (delimIndex === -1) return;

    const audioStart = delimIndex + delimBytes.length;
    const audioData = buffer.slice(audioStart);

    const emitter = this.requestQueue[requestId];
    if (emitter) {
      if (!emitter.audioChunks) emitter.audioChunks = [];
      emitter.audioChunks.push(audioData);

      if (emitter.onData) emitter.onData(audioData);
    }
  }

  findDelimiterIndex(buffer, delimiter) {
    for (let i = 0; i <= buffer.length - delimiter.length; i++) {
      let match = true;
      for (let j = 0; j < delimiter.length; j++) {
        if (buffer[i + j] !== delimiter[j]) { match = false; break; }
      }
      if (match) return i;
    }
    return -1;
  }

  handleClose() {
    this.log('Disconnected');
    for (const id in this.requestQueue) {
      const e = this.requestQueue[id];
      if (e.onClose) e.onClose();
    }
  }

  getConfigMessage() {
    return `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{
            "context": {
                "synthesis": {
                    "audio": {
                        "metadataoptions": {
                            "sentenceBoundaryEnabled": "true",
                            "wordBoundaryEnabled": "true"
                        },
                        "outputFormat": "${EDGE_TTS.OUTPUT_FORMAT}"
                    }
                }
            }
        }`;
  }

  async setMetadata(voiceName, voiceLocale) {
    this.voice = voiceName;
    this.voiceLocale = voiceLocale || this.inferLocale(voiceName);

    if (!this.voiceLocale) throw new Error('Could not infer voiceLocale');

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connectionStartTime = Date.now();
      await this.initWebSocket();
    }
  }

  inferLocale(voiceName) {
    const m = EDGE_TTS.VOICE_LANG_REGEX.exec(voiceName);
    return m ? m[0] : null;
  }

  close() {
    if (this.ws) this.ws.close();
  }

  toStream(text, options) {
    options = options || {};
    const pitch = options.pitch || '+0Hz';
    const rate = options.rate || 1.0;
    const volume = options.volume || 100.0;

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${this.voiceLocale}">
            <voice name="${this.voice}">
                <prosody pitch="${pitch}" rate="${rate}" volume="${volume}">
                    ${escapeXml(text)}
                </prosody>
            </voice>
        </speak>`;

    return this.sendSSMLRequest(ssml);
  }

  sendSSMLRequest(ssml) {
    if (!this.ws) throw new Error('WebSocket not initialized');

    const requestId = generateRandomHex(16);
    const requestMessage = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml.trim()}`;

    const emitter = {
      audioChunks: [],
      audioData: null,
      onData: null,
      onEnd: null,
      onClose: null,
    };

    this.requestQueue[requestId] = emitter;
    this.sendMessage(requestMessage);

    return emitter;
  }
}

// ============================================
// 工具函数
// ============================================

function generateRandomHex(length) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => `0${b.toString(16)}`.slice(-2)).join('');
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function uint8ArrayToBlob(uint8Array, mimeType) {
  return new Blob([uint8Array], { type: mimeType });
}

function concatUint8Arrays(arrays) {
  let totalLength = 0;
  for (const arr of arrays) totalLength += arr.length;
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// 暴露给全局
window.EdgeTTS = {
  EdgeTTSClient,
  DEFAULT_VOICES,
  generateRandomHex,
  uint8ArrayToBlob,
  concatUint8Arrays,
};