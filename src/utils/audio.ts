const AUDIO_ASSETS = {
  dice: 'https://assets.mixkit.co/sfx/preview/mixkit-rolling-dice-2002.mp3',
  cash: 'https://assets.mixkit.co/sfx/preview/mixkit-money-bag-drop-1987.mp3',
  move: 'https://assets.mixkit.co/sfx/preview/mixkit-simple-game-countdown-921.mp3',
  card: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-marimba-notif-2022.mp3',
  error: 'https://assets.mixkit.co/sfx/preview/mixkit-negative-tone-interface-608.mp3',
  win: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
  news: 'https://assets.mixkit.co/sfx/preview/mixkit-urgent-breaking-news-notification-3103.mp3',
  bgm: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' // Placeholder Lounge Music
};

class AudioController {
  private static instance: AudioController;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private bgmPlayer: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  private constructor() {
    // Preload common SFX
    Object.entries(AUDIO_ASSETS).forEach(([key, url]) => {
      if (key !== 'bgm') {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.audioCache.set(key, audio);
      }
    });
  }

  public static getInstance(): AudioController {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController();
    }
    return AudioController.instance;
  }

  public playSFX(key: keyof typeof AUDIO_ASSETS) {
    if (this.isMuted) return;
    const audio = this.audioCache.get(key);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    } else if (key === 'bgm') {
      this.playBGM();
    }
  }

  public playBGM() {
    if (this.bgmPlayer) return;
    this.bgmPlayer = new Audio(AUDIO_ASSETS.bgm);
    this.bgmPlayer.loop = true;
    this.bgmPlayer.volume = 0.3;
    if (!this.isMuted) {
      this.bgmPlayer.play().catch(e => console.warn('BGM play failed:', e));
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmPlayer) {
      if (this.isMuted) this.bgmPlayer.pause();
      else this.bgmPlayer.play();
    }
  }
}

export const gameAudio = AudioController.getInstance();
