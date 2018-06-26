import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {SoundComponent} from '../sound';
import {SvgIconComponent} from "../../ui/svgicon";

class Card {
    num: number;
    style: string;
    step: string;
    label_class: string;

    constructor(n: number, c: string, s: string, l: string) {
        this.num = n;
        this.style = c;
        this.step = s;
        this.label_class = l;
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

    options:any = {};
    options_def = {
        bit_count: 8,
        evenness: 'even',
        rock_step: true,
        step_names: true,
        show_bits: true,
        show_triple: true,
        couple: true,
        sound: {
            soundType: true,
            bpm: 130
        },
        kick_instead_hold: false,
        manual_mode: false
    };

    classes = [
        new Card(0, 'white', 'hold', ''),
        new Card(1, 'blue', 'step', ''),
        new Card(2, 'red', 'bllch', ''),
    ];
    cards = [];


    created() {

        this.$translate.setTranslationModule('generator', this);

        // Load saved options from LocalStorage
        if (this.$ls.get('ver') == this.version) {
            let opt = this.$ls.get('options');
            console.log(opt.sound.bpm);
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
        this.$bus.$on('updateSoundProps', (value:any) => {
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

    generate(nums: number[]): void {

        console.log('generate!');
        console.log(nums);

        let use_old_nums = false;
        if (nums && nums.length > 0) {
            use_old_nums = true;
        }

        let cards: Card[] = this.cards = [];
        let beats: number[] = this.beats = [];
        let options = this.options;
        let sum = 0;
        let num = 0;
        let num_arr: number[] = [];
        for (let i = 0; i < options.bit_count; i++) {

            if (!use_old_nums) {
                if (options.rock_step && i < 2)
                    num = 1;
                else if (options.evenness !== 'no' && i === (options.bit_count - 1)) {
                    if (options.evenness === 'even') {
                        if (sum % 2 == 0) {
                            num = this.getRandomFromArray([0, 2]);
                        }
                        else
                            num = 1;

                    }
                    else {
                        if (sum % 2 == 0) {
                            num = 1;
                        }
                        else
                            num = this.getRandomFromArray([0, 2]);
                    }
                }
                else {
                    num = this.getRandomNumber(3) - 1;
                    if (num < 0)
                        num = 0;
                }
            }
            else {
                num = nums[i];
            }

            if (num == 1) {
                beats[2 * i] = 0;
                beats[2 * i + 1] = 1;
            }
            else if (num == 2) {
                beats[2 * i] = 1;
                beats[2 * i + 1] = 1;
            }
            else {
                beats[2 * i] = 0;
                beats[2 * i + 1] = 0;
            }

            let card = {...this.classes[num]};
            if (num == 0 && options.kick_instead_hold == true)
                card.step = 'kick';
            cards[i] = card;

            if (options.couple) {
                if (i % 2 == 0) {
                    cards[i].label_class = 'left-lbl';
                }
                else {
                    cards[i].label_class = 'right-lbl';
                }
            }

            if (options.show_triple && ((options.couple && i % 2 == 1) || (!options.couple && i > 0))) {
                if (num == 2 && cards[i - 1].num == 1) {
                    cards[i - 1].step = 'triple';
                    cards[i - 1].label_class = 'left-lbl';
                    cards[i].step = 'step';
                    cards[i].label_class = 'right-lbl';
                }
            }
            if (options.rock_step && i == 1 && options.couple) {
                cards[i - 1].step = 'rock';
                cards[i - 1].label_class = 'left-lbl';
                cards[i].step = 'step';
                cards[i].label_class = 'right-lbl';
            }

            sum = sum + num;
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
