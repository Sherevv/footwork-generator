import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';
import './contact-form.scss';
import {SvgIconComponent} from "../../ui/svgicon";
import {FORM_ACTION} from '../../config';

class Errors {
    errors: any;

    constructor() {
        this.errors = {};
    }

    get(field:string) {
        if (this.errors && this.errors[field]) {
            return this.errors[field][0];
        }
    }

    has(field:string) {
        return this.errors.hasOwnProperty(field);
    }

    any() {
        return Object.keys(this.errors).length > 0;
    }

    setup(errors:any) {
        this.errors = errors;
    }

    clear(field:string) {
        delete this.errors[field];
    }
}


@Component({
    template: require('./contact-form.vue'),
    components: {
        'it-svgicon': SvgIconComponent
    },
})
export class ContactFormComponent extends Vue {
    contact = {};
    formErrors:any = new Errors();
    errorFrom:boolean = false;
    successFrom:boolean = false;
    is_bisy:boolean = false;
    is_fail:boolean = false;
    is_success:boolean = false;
    is_form_errors:boolean = false;

    onSubmit() {
        axios.post(FORM_ACTION, this.contact)
            .then(response => {
                if (process.env.NODE_ENV === 'development') {
                    console.log("from submit success");
                }
                this.is_bisy = false;
                this.is_success = true;
                //this.resetForm();
            })
            .catch(error => {
                if (process.env.NODE_ENV === 'development') {
                    console.log("form submit fail");
                }

                if (error.response.data && error.response.data.errors) {
                    this.formErrors.setup(error.response.data.errors);
                    this.is_form_errors = true;
                } else {
                    this.is_fail = true;
                }
                this.is_bisy = false;
            });

        if (process.env.NODE_ENV === 'development') {
            console.log("form submit");
        }

    }

    onFormChange() {
        if (process.env.NODE_ENV === 'development') {
            console.log("form change");
        }

        this.is_fail = false;
        this.is_success = false;
        this.is_form_errors = false;
    }


}
