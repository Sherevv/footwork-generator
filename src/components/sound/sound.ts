import debounce from 'debounce';
import { Options, Prop, Vue } from 'vue-property-decorator';
import AudioSampleLoader from '@/lib/AudioSampleLoader.js';
import SvgIconComponent from '@/ui/svgicon';

interface iOSAudioBufferSourceNode extends Partial<AudioBufferSourceNode> {
    noteOn: any;
    noteOff: any;
}

interface BufferSourceSetter {
    (buffer: AudioBuffer): void;
}

@Options({
    beforeDestroy() {
        // Clear listeners
        this.$bus.$off('updatePlayDown');
        this.$bus.$off('stopPlayDown');
    },
    components: {
        'it-svgicon': SvgIconComponent,
    },
})
export default class SoundComponent extends Vue {
    mounted(): void {
        this.initSound();
    }

    beforeUnmount(): void {
        this.stop();
        this.$bus.$emit('updatePlayUp', false);
        this.$bus.$off('updatePlayDown');
        this.$bus.$off('stopPlayDown');
    }

    @Prop()
    options: any;
    @Prop()
    isA: any;
    @Prop()
    beats: number[];
    @Prop()
    swOffClr: any;

    beats_on = false;

    isAudio = false;
    isWebAudioAPI = true;

    metronomeBufferSource: AudioBuffer;
    metronomeSource: AudioBufferSourceNode;
    rhythmBufferSource: AudioBuffer;
    rhythmSource: AudioBufferSourceNode;
    accentBufferSource: AudioBuffer;
    accentSource: AudioBufferSourceNode;

    codecs: any = {
        mp3: null,
        ogg: null,
        wav: null,
    };

    audioContext: any;

    soundType = 1;
    bpm = 130;
    isPlayAccent = false;
    accentBit = 8;
    rate = 60000 / this.bpm;

    sliderMessage = '';

    setupAudioContext(): void {
        try {
            const audioContext = AudioContext || webkitAudioContext;
            if (typeof AudioContext !== 'undefined') {
                this.audioContext = new audioContext();
            } else {
                this.isWebAudioAPI = false;
            }
        } catch (e) {
            this.isWebAudioAPI = false;
        }
    }

    setupCodecs(): void {
        const audioTest = new Audio();
        const mpegTest = audioTest
            .canPlayType('audio/mpeg;')
            .replace(/^no$/, '');
        this.codecs = {
            mp3: !!(
                mpegTest ||
                audioTest.canPlayType('audio/mp3;').replace(/^no$/, '')
            ),
            ogg: !!audioTest
                .canPlayType('audio/ogg; codecs="vorbis"')
                .replace(/^no$/, ''),
            wav: !!audioTest
                .canPlayType('audio/wav; codecs="1"')
                .replace(/^no$/, ''),
        };
    }

    initSound(): void {
        this.isAudio = this.isA;
        this.soundType = this.options.sound.soundType;
        this.bpm = this.options.sound.bpm;
        this.isPlayAccent = this.options.sound.isPlayAccent;
        this.accentBit = this.options.sound.accentBit;
        this.rate = 60000 / this.bpm;

        this.setupAudioContext();
        if (this.isWebAudioAPI) {
            this.isAudio = true;
            this.setupCodecs();
            this.loadSource();
        } else {
            console.error('Audio init error');
        }

        this.$watch(
            'bpm',
            debounce((bpmNew: number) => {
                this.rate = 60000 / bpmNew;
                this.updateSliderMessage(bpmNew);
                this.updateSound();
            }, 300)
        );

        this.$watch(
            () => {
                return `${this.beats}${this.soundType}${this.isPlayAccent}${this.accentBit}`;
            },
            debounce(() => {
                this.updateSound();
            }, 300)
        );

        this.$bus.$off('updatePlayDown');
        this.$bus.$off('stopPlayDown');

        this.$bus.$on('updatePlayDown', () => {
            this.toggleSound(true);
        });
        this.$bus.$on('stopPlayDown', () => {
            this.stop();
        });

        this.updateSliderMessage(this.bpm);
    }

    loadSource(): void {
        this.loadSound('kick', this.setRhythmBufferSource);
        this.loadSound('metro1', this.setMetronomeBufferSource);
        this.loadSound('metro3', this.setAccentBufferSource);
    }

    setRhythmBufferSource(source: AudioBuffer): void {
        this.rhythmBufferSource = source;
    }

    setMetronomeBufferSource(source: AudioBuffer): void {
        this.metronomeBufferSource = source;
    }

    setAccentBufferSource(source: AudioBuffer): void {
        this.accentBufferSource = source;
    }

    loadSound(fileName: string, bufferSourceSetter: BufferSourceSetter): void {
        const audioLoader: any = new AudioSampleLoader();

        let songExt = 'mp3';
        if (this.codecs.mp3) songExt = 'mp3';
        else if (this.codecs.ogg) songExt = 'ogg';
        else if (this.codecs.wav) songExt = 'wav';
        audioLoader.src = `../assets/sounds/${fileName}.${songExt}`;
        audioLoader.ctx = this.audioContext;
        audioLoader.onload = () => {
            bufferSourceSetter(audioLoader.response);
        };
        audioLoader.onerror = function () {
            console.error(`Error loading ${fileName}.${songExt} Audio`);
        };
        audioLoader.send();
    }

    updateSound(): void {
        if (this.beats_on) {
            this.stopSound();
            this.beats_on = false;
            this.toggleSound();
        }
        this.$bus.$emit('updateSoundProps', {
            bpm: this.bpm,
            soundType: this.soundType,
            isPlayAccent: this.isPlayAccent,
            accentBit: this.accentBit,
        });
    }

    toggleSound(fromTop = false): void {
        if (!this.beats_on) {
            this.play();
        } else {
            this.stop();
        }

        if (!fromTop) {
            this.$bus.$emit('updatePlayUp', this.beats_on);
        }
    }

    play(): void {
        this.beats_on = true;

        switch (this.soundType) {
            case 1:
                this.playBeats();
                break;
            case 2:
                this.playMetronome();
                break;
            case 3:
                this.playBoth();
        }
        if (this.isPlayAccent) {
            this.accentSource = this.startSource(
                this.audioContext,
                this.setAccentSource(
                    this.accentBufferSource,
                    this.accentBit,
                    this.bpm
                )
            );
        }
    }

    stop(): void {
        this.beats_on = false;
        this.stopSound();
    }

    playBeats(): void {
        if (this.beats_on && this.isWebAudioAPI) {
            this.rhythmSource = this.startSource(
                this.audioContext,
                this.setRhythmSource(this.beats, this.bpm)
            );
        }
    }

    playMetronome(): void {
        if (this.isWebAudioAPI) {
            this.metronomeSource = this.startSource(
                this.audioContext,
                this.setMetronomeSource(this.bpm)
            );
        }
    }

    playBoth(): void {
        this.rhythmSource = this.startSource(
            this.audioContext,
            this.setRhythmSource(this.beats, this.bpm)
        );
        this.metronomeSource = this.startSource(
            this.audioContext,
            this.setMetronomeSource(this.bpm)
        );
    }

    stopSound(): void {
        if (this.accentSource) {
            this.stopSource(this.accentSource);
        }
        if (this.metronomeSource) {
            this.stopSource(this.metronomeSource);
        }
        if (this.rhythmSource) {
            this.stopSource(this.rhythmSource);
        }
    }

    stopSource(source: AudioBufferSourceNode): void {
        // Safari uses another api
        source.stop
            ? source.stop(0)
            : (<iOSAudioBufferSourceNode>source).noteOff(0);
        source.disconnect();
        (<unknown>source) = null;
    }

    startSource(audioContext: AudioContext, soundBuffer: AudioBuffer): any {
        const source = audioContext.createBufferSource();
        source.connect(audioContext.destination);

        source.buffer = soundBuffer;
        source.loop = true;

        // Safari uses another api
        // eslint-disable-next-line
        source.start ? source.start(0) : (<iOSAudioBufferSourceNode>source).noteOn(0); // eslint-disable-line

        return source;
    }

    setRhythmSource(beats: number[], bpm: number): any {
        const rate = 60 / bpm;
        const noteRate = rate / 3;

        // Create empty buffer
        let soundBuffer = this.createEmptyBuffer(0.0001);
        // Create buffer one note size with silence
        const emptyBuffer = this.createEmptyBuffer(noteRate);
        // Create buffer double note size with silence
        const emptyDoubleBuffer = this.createEmptyBuffer(2 * noteRate);
        // Create buffers with sound
        const rhythmBuffer = this.mergeWithSilenceBuffer(
            this.rhythmBufferSource,
            noteRate
        );
        const rhythmDoubleBuffer = this.mergeWithSilenceBuffer(
            this.rhythmBufferSource,
            2 * noteRate
        );

        for (let i = 0; i < beats.length; i++) {
            if (beats[i] == 1) {
                if (i % 2 == 0) {
                    soundBuffer = this.appendBuffer(soundBuffer, rhythmBuffer);
                } else {
                    soundBuffer = this.appendBuffer(
                        soundBuffer,
                        rhythmDoubleBuffer
                    );
                }
            } else {
                if (i % 2 == 0) {
                    soundBuffer = this.appendBuffer(soundBuffer, emptyBuffer);
                } else {
                    soundBuffer = this.appendBuffer(
                        soundBuffer,
                        emptyDoubleBuffer
                    );
                }
            }
        }

        return soundBuffer;
    }

    setMetronomeSource(bpm: number): any {
        const rate = 60 / bpm;
        const noteRate = rate / 3;
        // Create buffer one note size with silence
        const emptyBuffer = this.createEmptyBuffer(noteRate);

        // Create buffer double note size with sound
        let metronomeBuffer = this.mergeWithSilenceBuffer(
            this.metronomeBufferSource,
            2 * noteRate
        );
        metronomeBuffer = this.appendBuffer(emptyBuffer, metronomeBuffer); // 1 + 2 = 3 note size

        return metronomeBuffer;
    }

    setAccentSource(
        soundBufferSource: AudioBuffer,
        bit: number,
        bpm: number
    ): any {
        const rate = 60 / bpm;
        const noteRate = rate / 3;
        // Create buffer one note size with silence
        const emptyBuffer = this.createEmptyBuffer(noteRate);

        // Create buffer double note size with sound
        let soundBuffer = this.mergeWithSilenceBuffer(
            soundBufferSource,
            2 * noteRate
        );
        soundBuffer = this.appendBuffer(emptyBuffer, soundBuffer); // 1 + 2 = 3 note size

        const emptyBitBuffer = this.createEmptyBuffer(rate * (bit - 1));
        soundBuffer = this.appendBuffer(soundBuffer, emptyBitBuffer);

        return soundBuffer;
    }

    appendBuffer(buffer1: AudioBuffer, buffer2: AudioBuffer): any {
        const numberOfChannels = Math.min(
            buffer1.numberOfChannels,
            buffer2.numberOfChannels
        );
        const tmp = this.audioContext.createBuffer(
            numberOfChannels,
            buffer1.length + buffer2.length,
            buffer1.sampleRate
        );
        for (let i = 0; i < numberOfChannels; i++) {
            const channel = tmp.getChannelData(i);
            // Fill channel
            channel.set(buffer1.getChannelData(i), 0); //offset = 0
            channel.set(buffer2.getChannelData(i), buffer1.length); // offset = buffer1.length
        }
        return tmp;
    }

    mergeWithSilenceBuffer(buffer1: AudioBuffer, length: number): any {
        //buffer1 - sound, length - silence
        const frameCount = this.audioContext.sampleRate * length;
        const tmp = this.audioContext.createBuffer(
            buffer1.numberOfChannels,
            frameCount,
            this.audioContext.sampleRate
        );
        const numberOfChannels = buffer1.numberOfChannels;
        for (let i = 0; i < numberOfChannels; i++) {
            const channel1 = buffer1.getChannelData(i);
            const channel2 = tmp.getChannelData(i);
            const arr_length = Math.min(channel1.length, channel2.length);
            for (let j = 0; j < arr_length; j++) channel2[j] = channel1[j];
            //channel2.set(buffer1.getChannelData(i)); //Error: invalid array length
        }
        return tmp;
    }

    createEmptyBuffer(rate: number): any {
        const frameCount = this.audioContext.sampleRate * rate;
        // return empty buffer
        return this.audioContext.createBuffer(
            1,
            frameCount,
            this.audioContext.sampleRate
        );
    }

    updateSliderMessage(bpm: number): void {
        if (bpm <= 40) {
            this.sliderMessage = 'Slider_message_40';
        } else if (bpm <= 60) {
            this.sliderMessage = 'Slider_message_60';
        } else if (bpm <= 100) {
            this.sliderMessage = 'Slider_message_100';
        } else if (bpm <= 130) {
            this.sliderMessage = 'Slider_message_130';
        } else if (bpm <= 160) {
            this.sliderMessage = 'Slider_message_160';
        } else if (bpm <= 190) {
            this.sliderMessage = 'Slider_message_190';
        } else if (bpm <= 220) {
            this.sliderMessage = 'Slider_message_220';
        } else if (bpm <= 270) {
            this.sliderMessage = 'Slider_message_270';
        } else if (bpm <= 300) {
            this.sliderMessage = 'Slider_message_300';
        }
    }
}
