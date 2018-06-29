import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {SoundComponent} from '../sound';
import {SvgIconComponent} from "../../ui/svgicon";
import './generator.scss';

class Card {
    num: number;
    style: string;
    step: string;
    label_class: string;
    num_string: string;

    constructor(n: number, c: string, s: string, l: string, ns: string) {
        this.num = n;
        this.style = c;
        this.step = s;
        this.label_class = l;
        this.num_string = ns;
    }
}


@Component({
    template: require('./generator.vue'),
    components: {
        'it-sound': SoundComponent,
        'it-svgicon': SvgIconComponent
    },
    beforeRouteLeave(to, from, next) {
        // Stop play on leave page
        this.$bus.$emit("stopPlayDown");
        next();
    },
})
export class GeneratorComponent extends Vue {

    version: string = this.$ver;
    beats: number[] = [];
    beats_on: any = false;
    isAudio: boolean = true;
    swOffClr: string = '#ff999c';
    nums: number[] = [];

    options: any = {};
    options_def = {
        bit_count: 8,
        rows: 1,
        evenness: 'even',
        syncopation: 0,
        rock_step: true,
        step_names: true,
        show_bits: true,
        show_row_index: true,
        show_triple: true,
        couple: true,
        sound: {
            soundType: 1,
            bpm: 130,
            isPlayAccent: false,
            accentBit: 8
        },
        kick_instead_hold: false,
        manual_mode: false
    };

    classes = [
        new Card(0, 'white', 'hold', '', '0'),
        new Card(1, 'blue', 'step', '', '1'),
        new Card(2, 'red', 'bllch', '', '2'),
        new Card(-1, 'green', 'STep', '', 'S'),
    ];
    cards = [];


    created() {

        this.$translate.setTranslationModule('generator', this);

        // Load saved options from LocalStorage
        if (this.$ls.get('ver') == this.version) {
            let opt = this.$ls.get('options');
            if (opt) {
                this.options = opt;
            }
            else {
                this.options = this.options_def;
                this.$ls.set('options', this.options);
            }

            this.nums = this.$ls.get('nums', []);
        } else {
            this.options = this.options_def;
            this.$ls.set('ver', this.version);
            this.$ls.set('options', this.options);
        }
    }

    mounted() {

        this.$watch('options', (value) => {
            this.$ls.set('options', value);
        }, {deep: true});

        this.$watch('nums', (value) => {
            this.$ls.set('nums', value);
        }, {deep: true});


        // when use manual mode than do not couple steps
        this.$watch('options.manual_mode', (mode) => {
            if (mode) {
                this.options.rock_step = false;
            }
        });

        this.$watch('options.rock_step', (value) => {
            if (value) {
                this.nums[0] = 1;
                this.nums[1] = 1;
                this.rerender();
            }
        });

        this.$watch(() => {
            return this.options.bit_count + this.options.evenness
        }, () => {
            this.generate([]);
        });

        this.$watch(() => {
            return `${this.options.couple}${this.options.kick_instead_hold}${this.options.show_triple}`
        }, () => {
            this.rerender();
        });


        this.$bus.$on('updatePlayUp', (value: boolean) => {
            this.beats_on = value;
        });
        this.$bus.$on('updateSoundProps', (value: any) => {
            this.options.sound = value;
        });

        this.rerender();
    }

    rerender(): void {
        this.generate(this.nums);
    }


    toggleSound(): void {
        this.beats_on = !this.beats_on;
        this.$bus.$emit("updatePlayDown", this.beats_on);
    }

    addBeats() {
        this.nums = this.nums.concat(this.nums.slice(-this.options.bit_count));
        this.options.rows++;
        this.rerender();
    }

    removeBeats() {
        if (this.options.rows > 1) {
            this.nums.splice(-this.options.bit_count, this.options.bit_count);
            this.options.rows--;
            this.rerender();
        }
    }

    generate(nums: number[]): void {

        if (process.env.NODE_ENV !== 'production') {
            console.log('generate!');
            console.log(nums);
        }


        let use_old_nums = false;
        if (nums && nums.length > 0) {
            use_old_nums = true;
        }

        let cards: Card[] = this.cards = [];
        let beats: number[] = this.beats = [];
        let options = this.options;
        let sum = 0;
        let num = 0;
        let sync_cnt = 0;
        let num_arr: number[] = [];
        let len = options.bit_count * options.rows;
        for (let i = 0; i < len; i++) {

            if (!use_old_nums) {
                if (options.rock_step && i % options.bit_count < 2) {
                    num = 1;
                } else if (options.evenness !== 'no' && 0 === (i + 1) % options.bit_count) {
                    if (options.evenness === 'even') {
                        if (sum % 2 == 0) {
                            num = this.getRandomFromArray([0, 2]);
                        }
                        else {
                            if (sync_cnt >= options.syncopation) {
                                num = 1
                            } else {
                                num = this.getRandomFromArray([1, -1]);
                            }
                        }
                    }
                    else {

                        if (sum % 2 == 0) {
                            if (sync_cnt >= options.syncopation) {
                                num = 1
                            } else {
                                num = this.getRandomFromArray([1, -1]);
                            }
                        }
                        else {
                            num = this.getRandomFromArray([0, 2]);
                        }
                    }
                }
                else {
                    if (sync_cnt >= options.syncopation) {
                        num = this.getRandomNumber(3) - 1;  // [0,1,2]
                        if (num < 0)
                            num = 0;
                    } else {
                        num = this.getRandomNumber(4) - 2;  // [-1,0,1,2]
                        if (num < -1)
                            num = -1;
                    }
                }
            }
            else {
                num = nums[i];
            }

            if (num === 1) {
                beats[2 * i] = 0;
                beats[2 * i + 1] = 1;
            }
            else if (num === 2) {
                beats[2 * i] = 1;
                beats[2 * i + 1] = 1;
            }
            else if (num === -1) {
                beats[2 * i] = 1;
                beats[2 * i + 1] = 0;
            }
            else {
                beats[2 * i] = 0;
                beats[2 * i + 1] = 0;
            }

            let k = (num > -1) ? num : 3;
            let card = {...this.classes[k]};
            if (num === 0 && options.kick_instead_hold == true)
                card.step = 'kick';
            cards[i] = card;

            if (options.couple) {
                if (i % 2 === 0) {
                    cards[i].label_class = 'left-lbl';
                }
                else {
                    cards[i].label_class = 'right-lbl';
                }
            }

            if (options.show_triple && ((options.couple && i % 2 === 1) || (!options.couple && i > 0))) {
                if (num === 2 && cards[i - 1].num % 2 != 0) {
                    if (cards[i - 1].num === 1) {
                        cards[i - 1].step = 'triple';
                    } else if (cards[i - 1].num === -1) {
                        cards[i - 1].step = 'TRIple';
                    }
                    cards[i - 1].label_class = 'left-lbl';
                    cards[i].step = 'step';
                    cards[i].label_class = 'right-lbl';
                }
            }
            if (options.rock_step && i % options.bit_count === 1 && options.couple) {
                cards[i - 1].step = 'rock';
                cards[i - 1].label_class = 'left-lbl';
                cards[i].step = 'step';
                cards[i].label_class = 'right-lbl';
            }


            sum += Math.abs(num);

            if ((i + 1) % options.bit_count === 0) {
                sync_cnt = 0;
                sum = 0;
            } else if (num === -1) {
                sync_cnt++;
            }

            num_arr[i] = num;
        }
        this.nums = num_arr;

        this.$ls.set('nums', num_arr);

    };

    getRandomNumber(num: number): number {
        return (Math.ceil(Math.random() * num));
    };

    getRandomFromArray(arr: number[]): number {
        return arr[Math.floor(Math.random() * (arr.length))];
    };


}
