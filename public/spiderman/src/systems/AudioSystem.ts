export class AudioSystem {
  private ctx: AudioContext | null = null
  private musicInterval: any = null
  private musicStep = 0
  private titleAmbienceSource: AudioBufferSourceNode | null = null
  private titleAmbienceFilter: BiquadFilterNode | null = null
  private titleAmbienceGain: GainNode | null = null

  private windSource: AudioBufferSourceNode | null = null
  private windGain: GainNode | null = null
  private windFilter: BiquadFilterNode | null = null

  init(): void {
    if (this.ctx) return
    this.ctx = new AudioContext()
    this.startWind()
  }

  private getCtx(): AudioContext | null {
    return this.ctx
  }

  playWebShoot(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(
      600, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(
      200, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01, ctx.currentTime + 0.12)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }

  playSwingWhoosh(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(
      1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    filter.Q.value = 2
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(
      0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01, ctx.currentTime + 0.3)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start()
    source.stop(ctx.currentTime + 0.3)
  }

  playCollect(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const notes = [523, 659, 784, 988, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + i * 0.08
      gain.gain.setValueAtTime(0.4, t)
      gain.gain.exponentialRampToValueAtTime(
        0.01, t + 0.08)
      osc.start(t)
      osc.stop(t + 0.08)
    })
  }

  playPlayerHit(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(
      150, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(
      80, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(
      0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.01, ctx.currentTime + 0.15)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  }

  playVictory(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const chords = [
      [523, 659, 784],
      [587, 740, 880],
      [523, 659, 784, 1047]
    ]
    chords.forEach((chord, ci) => {
      chord.forEach(freq => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = ctx.currentTime + ci * 0.4
        gain.gain.setValueAtTime(0.2, t)
        gain.gain.exponentialRampToValueAtTime(
          0.01, t + 0.4)
        osc.start(t)
        osc.stop(t + 0.4)
      })
    })
  }

  // Synthesized Start Menu Elements
  private createNoiseBuffer(): AudioBuffer {
    const ctx = this.ctx!
    const bufferSize = ctx.sampleRate * 2.0
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  playTitleAmbience(): void {
    if (!this.ctx) return
    if (this.titleAmbienceSource) return

    const ctx = this.ctx
    const noiseBuf = this.createNoiseBuffer()
    this.titleAmbienceSource = ctx.createBufferSource()
    this.titleAmbienceSource.buffer = noiseBuf
    this.titleAmbienceSource.loop = true

    this.titleAmbienceFilter = ctx.createBiquadFilter()
    this.titleAmbienceFilter.type = 'bandpass'
    this.titleAmbienceFilter.frequency.setValueAtTime(260, ctx.currentTime)
    this.titleAmbienceFilter.Q.value = 1.2

    this.titleAmbienceGain = ctx.createGain()
    this.titleAmbienceGain.gain.setValueAtTime(0.04, ctx.currentTime)

    this.titleAmbienceSource.connect(this.titleAmbienceFilter)
    this.titleAmbienceFilter.connect(this.titleAmbienceGain)
    this.titleAmbienceGain.connect(ctx.destination)

    this.titleAmbienceSource.start()

    // Modulate filter frequency slowly to sound like wind blowing through concrete canyons
    const t = ctx.currentTime
    for (let i = 0; i < 80; i++) {
      const nextTime = t + i * 2.5
      const nextFreq = 180 + Math.random() * 280
      this.titleAmbienceFilter.frequency.linearRampToValueAtTime(nextFreq, nextTime)
    }
  }

  stopTitleAmbience(): void {
    if (this.titleAmbienceSource) {
      try {
        this.titleAmbienceSource.stop()
      } catch (e) {}
      this.titleAmbienceSource = null
    }
  }

  playTitleMusic(): void {
    if (!this.ctx) return
    if (this.musicInterval) return

    this.musicStep = 0

    // G-Minor/Eb/F/Gm chord progression bass line
    const bassFreqs = [
      98.0, 98.0, 98.0, 98.0,      // G2
      77.78, 77.78, 77.78, 77.78,  // Eb2
      87.31, 87.31, 87.31, 87.31,  // F2
      98.0, 98.0, 110.0, 116.54    // G2, G2, A2, Bb2
    ]

    // Heroic brass line
    // G4=392, A4=440, Bb4=466.16, C5=523.25, D5=587.33, F5=698.46
    const melodyFreqs = [
      392, 0, 392, 466.16, 587.33, 0, 523.25, 466.16,
      392, 0, 440, 466.16, 392, 0, 0, 0,
      466.16, 0, 466.16, 523.25, 587.33, 0, 698.46, 587.33,
      523.25, 0, 466.16, 440, 392, 0, 0, 0
    ]

    this.musicInterval = setInterval(() => {
      const ctx = this.ctx!
      if (ctx.state === 'suspended') return

      const t = ctx.currentTime

      // 1. Play bass note
      const bassIndex = Math.floor(this.musicStep / 2) % bassFreqs.length
      const bassFreq = bassFreqs[bassIndex]
      if (this.musicStep % 2 === 0) {
        this.synthBassNote(bassFreq, t)
      }

      // 2. Play melody note
      const melIndex = this.musicStep % melodyFreqs.length
      const melFreq = melodyFreqs[melIndex]
      if (melFreq > 0) {
        this.synthBrassNote(melFreq, t)
      }

      // 3. Play simple hi-hat ticking sound
      if (this.musicStep % 2 === 1) {
        this.synthHiHat(t)
      }

      this.musicStep++
    }, 200) // 150 BPM (200ms per step)
  }

  stopTitleMusic(): void {
    if (this.musicInterval) {
      clearInterval(this.musicInterval)
      this.musicInterval = null
    }
  }

  private synthBassNote(freq: number, time: number): void {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, time)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(140, time)
    filter.frequency.exponentialRampToValueAtTime(380, time + 0.08)
    filter.frequency.exponentialRampToValueAtTime(110, time + 0.28)

    gain.gain.setValueAtTime(0.22, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(time)
    osc.stop(time + 0.38)
  }

  private synthBrassNote(freq: number, time: number): void {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    // Triangle wave filtered sounds like a retro brass instrument
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, time)

    // Vibrant LFO vibrato
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 6.5
    lfoGain.gain.value = 3.5
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    lfo.start(time)
    lfo.stop(time + 0.38)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(450, time)
    filter.frequency.exponentialRampToValueAtTime(1900, time + 0.08)
    filter.frequency.exponentialRampToValueAtTime(750, time + 0.32)

    gain.gain.setValueAtTime(0.14, time)
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(time)
    osc.stop(time + 0.38)
  }

  private synthHiHat(time: number): void {
    const ctx = this.ctx!
    const bufferSize = ctx.sampleRate * 0.03
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 9000

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.015, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    source.start(time)
    source.stop(time + 0.04)
  }

  playTransitionWhoosh(): void {
    const ctx = this.ctx
    if (!ctx) return
    const bufferSize = ctx.sampleRate * 2.2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(120, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 1.3)
    filter.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 2.2)
    filter.Q.value = 3.2

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.01, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.6)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.2)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    source.start()
    source.stop(ctx.currentTime + 2.2)
  }

  startWind(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    if (this.windSource) return

    const bufferSize = ctx.sampleRate * 2.0
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    this.windSource = ctx.createBufferSource()
    this.windSource.buffer = buffer
    this.windSource.loop = true

    this.windFilter = ctx.createBiquadFilter()
    this.windFilter.type = 'lowpass'
    this.windFilter.frequency.value = 350
    this.windFilter.Q.value = 1.0

    this.windGain = ctx.createGain()
    this.windGain.gain.value = 0

    this.windSource.connect(this.windFilter)
    this.windFilter.connect(this.windGain)
    this.windGain.connect(ctx.destination)

    this.windSource.start()
  }

  setWindSpeed(speed: number): void {
    const ctx = this.getCtx()
    if (!ctx || !this.windGain || !this.windFilter) return
    // Scale volume with speed (starts feeling noticeable above speed=20)
    const intensity = Math.min(Math.max((speed - 15) / 45, 0), 1.0)
    // Smooth transition
    this.windGain.gain.setTargetAtTime(intensity * 0.18, ctx.currentTime, 0.1)
    this.windFilter.frequency.setTargetAtTime(300 + intensity * 600, ctx.currentTime, 0.1)
  }

  playFootstep(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.05)
    
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  }

  playJump(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12)
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  }

  playLanding(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    
    osc.type = 'sawtooth'
    filter.type = 'lowpass'
    filter.frequency.value = 180
    
    osc.frequency.setValueAtTime(80, ctx.currentTime)
    gain.gain.setValueAtTime(0.28, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.18)
  }

  playWebAttach(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08)
    
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  }

  playWebRelease(): void {
    const ctx = this.getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.1)
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    
    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }
}
