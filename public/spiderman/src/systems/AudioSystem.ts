export class AudioSystem {
  private ctx: AudioContext | null = null

  init(): void {
    if (this.ctx) return
    this.ctx = new AudioContext()
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
}
