import axios from 'axios';
import { Vue, Options } from 'vue-class-component';
import { FORM_ACTION } from '@/config';
import SvgIconComponent from '@/ui/svgicon';

class Errors {
    errors: any;

    constructor() {
        this.errors = {};
    }

    get(field: string) {
        if (this.errors && this.errors[field]) {
            return this.errors[field][0];
        }
    }

    has(field: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.errors, field);
    }

    any(): boolean {
        return Object.keys(this.errors).length > 0;
    }

    setup(errors: any): void {
        this.errors = errors;
    }

    clear(field: string): void {
        delete this.errors[field];
    }
}

@Options({
    components: {
        'it-svgicon': SvgIconComponent,
    },
})
export default class ContactFormComponent extends Vue {
    contact = {};
    formErrors = new Errors();
    is_busy = false;
    is_fail = false;
    is_success = false;
    is_form_errors = false;

    onSubmit(): void {
        axios
            .post(FORM_ACTION, { ...this.contact, ...{ ajax: true } })
            .then((response) => {
                if (response.data && response.data.errors) {
                    if (this.formErrors.has('mailer')) {
                        this.is_fail = true;
                    } else {
                        this.formErrors.setup(response.data.errors);
                        this.is_form_errors = true;
                    }
                    this.is_success = false;
                } else {
                    this.is_success = true;
                }

                if (process.env.NODE_ENV === 'development') {
                    if (this.is_success) console.log('from submit success');
                    else console.log('form submit fail');
                }

                this.is_busy = false;
            })
            .catch((error) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log('form submit fail', error);
                }
                this.is_fail = true;
                this.is_busy = false;
            });

        if (process.env.NODE_ENV === 'development') {
            console.log('form submit');
        }
    }

    onFormChange(): void {
        if (process.env.NODE_ENV === 'development') {
            console.log('form change');
        }

        this.is_fail = false;
        this.is_success = false;
        this.is_form_errors = false;
    }
}
