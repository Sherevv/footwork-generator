import { RouteRecordRaw } from "vue-router";

const AboutComponent = () => import(
    /* webpackChunkName: "about" */  '../components/about'
    );
const GeneratorComponent = () => import(
    /* webpackChunkName: "generator" */  '../components/generator'
    );
const DescriptionComponent = () => import(
    /* webpackChunkName: "description" */  '../components/description'
    );
const ExercisesComponent = () => import(
    /* webpackChunkName: "exercises" */  '../components/exercises'
    );

const routes: Array<RouteRecordRaw> = [
    {path: '/', redirect: {name: 'Generator'}},
    {
        name: 'Generator',
        path: '/:lang?/generator/',
        component: GeneratorComponent,
        props: (route) => ({b: route.query.b, n: route.query.n})
    },
    {name: 'Description', path: '/:lang?/description/', component: DescriptionComponent},
    {name: 'Exercises', path: '/:lang?/exercises/', component: ExercisesComponent},
    {name: 'About', path: '/:lang?/about/', component: AboutComponent},
    {path: '/:pathMatch(.*)*', redirect: {name: 'Generator'}},
];

export default routes;