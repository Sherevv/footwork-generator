import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
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

    @Prop(String) b: string;
    @Prop(String) n: string;

    copySucceeded = null;
    shareLink: string = '';
    version: string = this.$ver;
    opt_ver: string = '1';
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
    isShowShareLink: boolean = false;


    created() {

        this.$translate.setTranslationModule('generator', this);


        let options_query = this.checkQueryParams(this.b, this.n);

        // Load saved options from LocalStorage
        this.restoreOptions(options_query);

        this.setSharedLink(this.$route.fullPath);
    }

    restoreOptions(options_query) {
        let opt = this.$ls.get('options');

        // Check version of options
        if (this.$ls.get('ver') === this.opt_ver) {
            if (opt) {
                this.options = opt;
            }
            else {
                this.options = this.options_def;
            }
            // Merge options with options from query params
            this.options = this.merge(this.options, options_query);

            // Get nums from query params
            if (options_query["nums"]) {
                this.nums = options_query["nums"];
            } else {
                this.nums = this.$ls.get('nums', []);
            }

        } else {
            // If versions does not equal, try to merge with defaults
            if (opt) {
                this.options = this.merge(this.options_def, opt);
            }
            else {
                this.options = this.options_def;
            }

            // Merge options with options from query params
            this.options = this.merge(this.options, options_query);

            // Get nums from query params
            if (options_query["nums"]) {
                this.$ls.set('nums', options_query["nums"]);
                this.nums = options_query["nums"];
            }
            this.$ls.set('ver', this.opt_ver);
        }

        this.$ls.set('options', this.options);
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
            if (value && this.options.evenness === 'no') {
                this.nums[0] = 1;
                this.nums[1] = 1;
                this.rerender();
            }
        });

        this.$watch('$route', (to, from) => {
            let options_query = this.checkQueryParams(to.query.b, to.query.n);
            if (options_query["nums"]) {
                this.nums = options_query["nums"];
            }
            this.options = this.merge(this.options, options_query);
            this.rerender();

            this.setSharedLink(to.fullPath);
        });

        this.$watch(() => {
            return this.options.evenness
        }, () => {
            if (this.options.evenness === 'no') {
                this.rerender();
            } else {
                this.generate([]);
            }
        });

        this.$watch(() => {
            return this.options.bit_count
        }, () => {
            if (this.nums.length % this.options.bit_count === 0) {
                this.rerender();
            } else {
                this.generate([]);
            }
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

    checkQueryParams(qb, qn): object {
        let options = {
            bit_count: 8,
            rows: 1,
            evenness: 'no',
            syncopation: 0,
            rock_step: false,
            nums: []
        };

        let b, n;

        if (qb) {
            b = Number(qb);
            if ([4, 6, 8].indexOf(b) === -1) {
                b = 8;
            }
        } else {
            return {};
        }
        if (qn) {
            n = qn.split(',').map(Number);
        } else {
            return {};
        }

        // Check if query params is correct
        if (n.length % b === 0) {
            options.bit_count = b;
            options.rows = n.length / b;
            options.nums = n;
            let s_count = n.filter(x => x === -1).length;
            if (s_count > 0) {
                if (s_count > b) {
                    s_count = b;
                }
                options.syncopation = s_count;
            }
            return options;
        } else {
            return {};
        }

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

        this.$router.push({path: 'generator', query: {b: options.bit_count.toString(), n: this.nums.toString()}}).catch(error => {
            if (error.name != "NavigationDuplicated") {
                throw error;
            }
        });
    };

    toggleShareRhythm() {
        this.isShowShareLink = !this.isShowShareLink;
        if (this.isShowShareLink) {
            setTimeout(() => {
                let el = this.$refs.sharedLink["$refs"].input;
                if (el) {
                    el.focus();
                    if (el.setSelectionRange) {
                        el.setSelectionRange(0, this.shareLink.length);
                    } else if (el.createTextRange) {
                        let range = el.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', this.shareLink.length);
                        range.moveStart('character', 0);
                        range.select();
                    } else if (el.selectionStart) {
                        el.selectionStart = 0;
                        el.selectionEnd = this.shareLink.length;
                    }
                }
            }, 0);

        } else {
            window.getSelection().removeAllRanges();
        }
    }

    setSharedLink(path) {
        this.shareLink = window.location.origin + path;
    }

    copyLink() {
        this.$copyText(this.shareLink).then((e) => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(e);
            }
            this.handleCopyStatus(true);

            let t = setTimeout(
                this.handleCopyStatus
                , 2000);
        }, (e) => {
            if (process.env.NODE_ENV !== 'production') {
                console.log(e);
            }
            this.handleCopyStatus(false);
        });

        this.$refs.sharedLink["$refs"].input.select();
    }

    handleCopyStatus(status) {
        this.copySucceeded = status;
    }

    getRandomNumber(num: number): number {
        return (Math.ceil(Math.random() * num));
    };

    getRandomFromArray(arr: number[]): number {
        return arr[Math.floor(Math.random() * (arr.length))];
    };

    merge(obj1: object, obj2: object): object {
        let result = {};
        let i;
        for (i in obj1) {
            if (obj1.hasOwnProperty(i)) {
                result[i] = obj1[i];
                if (obj2.hasOwnProperty(i) && typeof obj1[i] === typeof obj2[i]) {
                    result[i] = obj2[i];
                }
                if ((i in obj2) && (typeof obj1[i] === "object") && (i !== null)) {
                    obj1[i] = this.merge(obj1[i], obj2[i]);
                }
            }
        }

        return result;
    };
}
