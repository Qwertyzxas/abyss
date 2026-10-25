import { dive, MAX_DEPTH } from "./depth";

function createBrownNoise(context: AudioContext, seconds: number) {
  const length = context.sampleRate * seconds;
  const buffer = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}

export class OceanAmbience {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private waterFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;
  private sonarBus: GainNode | null = null;
  private timers: number[] = [];

  get running() {
    return this.context?.state === "running";
  }

  async start() {
    if (!this.context) this.build();
    const context = this.context!;
    await context.resume();
    this.master!.gain.cancelScheduledValues(context.currentTime);
    this.master!.gain.setTargetAtTime(0.9, context.currentTime, 1.2);
    this.timers.push(window.setInterval(() => this.followDepth(), 180));
    this.timers.push(window.setInterval(() => this.ping(), 9000));
  }

  async stop() {
    if (!this.context || !this.master) return;
    this.timers.forEach((id) => window.clearInterval(id));
    this.timers = [];
    this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.4);
    await new Promise((resolve) => window.setTimeout(resolve, 1600));
    if (this.timers.length === 0) await this.context.suspend();
  }

  private build() {
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);

    const noise = context.createBufferSource();
    noise.buffer = createBrownNoise(context, 6);
    noise.loop = true;

    const waterFilter = context.createBiquadFilter();
    waterFilter.type = "lowpass";
    waterFilter.frequency.value = 900;
    waterFilter.Q.value = 0.4;

    const waterGain = context.createGain();
    waterGain.gain.value = 0.32;

    const swell = context.createOscillator();
    swell.frequency.value = 0.07;
    const swellDepth = context.createGain();
    swellDepth.gain.value = 0.14;
    swell.connect(swellDepth).connect(waterGain.gain);

    noise.connect(waterFilter).connect(waterGain).connect(master);

    const droneGain = context.createGain();
    droneGain.gain.value = 0;
    droneGain.connect(master);
    [55, 82.4, 110.3].forEach((frequency, index) => {
      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.value = frequency;
      osc.detune.value = index * 4 - 4;
      const level = context.createGain();
      level.gain.value = 0.5 / (index + 1);
      osc.connect(level).connect(droneGain);
      osc.start();
    });

    const sonarBus = context.createGain();
    const echo = context.createDelay(1);
    echo.delayTime.value = 0.34;
    const feedback = context.createGain();
    feedback.gain.value = 0.38;
    const echoTone = context.createBiquadFilter();
    echoTone.type = "lowpass";
    echoTone.frequency.value = 1800;
    sonarBus.connect(master);
    sonarBus.connect(echo);
    echo.connect(echoTone).connect(feedback).connect(echo);
    echoTone.connect(master);

    noise.start();
    swell.start();

    this.context = context;
    this.master = master;
    this.waterFilter = waterFilter;
    this.droneGain = droneGain;
    this.sonarBus = sonarBus;
    this.followDepth();
  }

  private followDepth() {
    if (!this.context || !this.waterFilter || !this.droneGain) return;
    const t = Math.min(1, dive.meters / MAX_DEPTH);
    const now = this.context.currentTime;
    this.waterFilter.frequency.setTargetAtTime(900 - 760 * Math.sqrt(t), now, 0.6);
    this.droneGain.gain.setTargetAtTime(0.02 + 0.09 * Math.sqrt(t), now, 0.8);
  }

  private ping() {
    if (!this.context || !this.sonarBus || dive.meters < 800) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1180, now);
    osc.frequency.exponentialRampToValueAtTime(1120, now + 1.4);
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.07, now + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    osc.connect(envelope).connect(this.sonarBus);
    osc.start(now);
    osc.stop(now + 1.7);
  }
}
