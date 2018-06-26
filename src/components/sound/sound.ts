import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import AudioSampleLoader from '../../lib/AudioSampleLoader.js';
import debounce from 'debounce';
import {SvgIconComponent} from '../../ui/svgicon';

@Component({
    template: require('./sound.vue'),
    props: ['options', 'beats', 'isA'],
    data() {
        return {
            isAudio: this.$props.isA,
            isRhythmer: this.$props.options.sound.isRhythmer,
            bpm: this.$props.options.sound.bpm
        }
    },
    beforeDestroy() {
        // Clear listeners
        this.$bus.$off(['updatePlayDown', 'stopPlayDown']);
    },
    components: {
        'it-svgicon': SvgIconComponent
    },
})
export class SoundComponent extends Vue {
    mounted() {
        this.initSound();
    }

    options: any;
    beats_on: boolean = false;
    @Prop()
    beats: number[];
    isAudio: boolean = false;

    rate = 60000 / this.options.sound.bpm;

    isWebAudioAPI: boolean = true;

    metronomeBufferSource: any = null;
    metronomeSource: any = null;
    rhythmBufferSource: any = null;
    rhythmSource: any = null;
    playSource: any = null;

    codecs: any = {
        mp3: null,
        ogg: null,
        wav: null
    };

    audioContext: any;

    isRhythmer = true;
    bpm = 60;

    setupAudioContext(): void {
        try {
            AudioContext = AudioContext || webkitAudioContext;
            if (typeof AudioContext !== 'undefined') {
                this.audioContext = new AudioContext();
            } else {
                this.isWebAudioAPI = false;
            }
        } catch (e) {
            this.isWebAudioAPI = false;
        }
    }


    setupCodecs(): void {
        let audioTest = new Audio();
        let mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');
        this.codecs = {
            mp3: !!(mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, '')),
            ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
            wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')
        };
    }

    initSound(): void {

        this.setupAudioContext();
        if (this.isWebAudioAPI) {
            this.isAudio = true;
            this.setupCodecs();
            this.loadSource();
        } else {
            console.error("Audio init error");
        }


        this.$watch('isRhythmer', debounce(() => {
            this.updateSound();
        }, 300));

        this.$watch('bpm', debounce((bpmNew: number) => {
                this.rate = 60000 / bpmNew;
                this.updateSound();
            }, 300)
        );

        this.$watch('beats', debounce(() => {
            this.updateSound();
        }, 300));

        this.$bus.$on('updatePlayDown', (value: boolean) => {
            this.toggleSound(true);
        });
        this.$bus.$on('stopPlayDown', () => {
            this.stop();
        });
    }

    loadSource() {
        let buffer = {source:this.rhythmBufferSource};

        this.loadSound("kick", this.setRhythmBufferSource);
        this.loadSound("click", this.setMetronomeBufferSource);
    }

    setRhythmBufferSource(source){
        this.rhythmBufferSource = source;
    }
    setMetronomeBufferSource(source){
        this.metronomeBufferSource = source;
    }

    loadSound(fileName, bufferSourceSetter) {
        let audioLoader: any = new AudioSampleLoader();

        let songExt = 'mp3';
        if (this.codecs.mp3)
            songExt = 'mp3';
        else if (this.codecs.ogg)
            songExt = 'ogg';
        else if (this.codecs.wav)
            songExt = 'wav';
        audioLoader.src = "assets/sounds/"+ fileName + '.' + songExt;
        audioLoader.ctx = this.audioContext;
        audioLoader.onload = () => {
            bufferSourceSetter(audioLoader.response);
        };
        audioLoader.onerror = function () {
            console.log("Error loading Metronome Audio");
        };
        audioLoader.send();
    }

    updateSound() {
        if (this.beats_on) {
            this.stopSound();
            this.beats_on = false;
            this.toggleSound();
        }
        this.$bus.$emit("updateSoundProps", {bpm: this.bpm, isRhythmer: this.isRhythmer});
    }

    toggleSound(fromTop = false) {
        if (!this.beats_on) {
            this.play();
        }
        else {
            this.stop();
        }

        if (!fromTop) {
            this.$bus.$emit("updatePlayUp", this.beats_on);
        }
    }

    play() {
        this.beats_on = true;
        if (this.isRhythmer) {
            this.playBeats();
        }
        else {
            this.playMetronome();
        }
    }

    stop() {
        this.beats_on = false;
        this.stopSound();
    }


    playBeats() {
        if (this.beats_on && this.isWebAudioAPI) {
            this.playSource = this.startSource(this.audioContext, this.setRhythmSource(this.beats, this.bpm));
        }
    };

    playMetronome() {
        if (this.isWebAudioAPI) {
            this.playSource = this.startSource(this.audioContext, this.setMetronomeSource(this.bpm));
        }
    }

    stopSound() {
        if (this.isWebAudioAPI) {
            if (this.playSource) {
                this.stopSource(this.playSource);
            }
        }
    }

    stopSource(source) {
        // Safari uses another api
        source.stop ? source.stop(0) : source.noteOff(0);
        source.disconnect();
        source = null;
    }

    startSource(audioContext, soundBuffer) {
        let source = audioContext.createBufferSource();
        source.connect(audioContext.destination);

        source.buffer = soundBuffer;
        source.loop = true;

        // Safari uses another api
        source.start ? source.start(0) : source.noteOn(0);

        return source;
    }

    setRhythmSource(beats: number[], bpm: number) {
        let rate = 60 / bpm;
        let noteRate = rate / 3;

        // Create empty buffer
        let soundBuffer = this.createEmptyBuffer(0.0001);
        // Create buffer one note size with silence
        let emptyBuffer = this.createEmptyBuffer(noteRate);
        // Create buffer double note size with silence
        let emptyDoubleBuffer = this.createEmptyBuffer(2 * noteRate);
        // Create buffers with sound
        let rhythmBuffer = this.mergeWithSilenceBuffer(this.rhythmBufferSource, noteRate);
        let rhythmDoubleBuffer = this.mergeWithSilenceBuffer(this.rhythmBufferSource, 2 * noteRate);

        for (let i = 0; i < beats.length; i++) {
            if (beats[i] == 1) {
                if (i % 2 == 0) {
                    soundBuffer = this.appendBuffer(soundBuffer, rhythmBuffer);
                }
                else {
                    soundBuffer = this.appendBuffer(soundBuffer, rhythmDoubleBuffer);
                }
            } else {
                if (i % 2 == 0) {
                    soundBuffer = this.appendBuffer(soundBuffer, emptyBuffer);
                }
                else {
                    soundBuffer = this.appendBuffer(soundBuffer, emptyDoubleBuffer);
                }
            }
        }

        return soundBuffer;
    }

    setMetronomeSource(bpm: number) {
        let rate = 60 / bpm;
        let metronomeBuffer = this.mergeWithSilenceBuffer(this.metronomeBufferSource, rate);
        return metronomeBuffer;
    }

    appendBuffer(buffer1: any, buffer2: any) {
        let numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
        let tmp = this.audioContext.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
        for (let i = 0; i < numberOfChannels; i++) {
            let channel = tmp.getChannelData(i);
            // Fill channel
            channel.set(buffer1.getChannelData(i), 0); //offset = 0
            channel.set(buffer2.getChannelData(i), buffer1.length); // offset = buffer1.length
        }
        return tmp;
    }

    mergeWithSilenceBuffer(buffer1: any, length: number) {//buffer1 - sound, length - silence
        let frameCount = this.audioContext.sampleRate * length;
        let tmp = this.audioContext.createBuffer(buffer1.numberOfChannels, frameCount, this.audioContext.sampleRate);
        let numberOfChannels = buffer1.numberOfChannels;
        for (let i = 0; i < numberOfChannels; i++) {
            let channel1 = buffer1.getChannelData(i);
            let channel2 = tmp.getChannelData(i);
            let arr_length = Math.min(channel1.length, channel2.length);
            for (let j = 0; j < arr_length; j++)
                channel2[j] = channel1[j];
            //channel2.set(buffer1.getChannelData(i)); //Error: invalid array length
        }
        return tmp;
    }

    createEmptyBuffer(rate: number) {
        let frameCount = this.audioContext.sampleRate * rate;
        let emptyBuffer = this.audioContext.createBuffer(1, frameCount, this.audioContext.sampleRate);
        return emptyBuffer;
    }
}
