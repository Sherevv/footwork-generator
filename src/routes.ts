const AboutComponent = () => import(
    /* webpackChunkName: "about" */  './components/about'
    ).then(m => m.AboutComponent);
const GeneratorComponent = () => import(
    /* webpackChunkName: "generator" */  './components/generator'
    ).then(m => m.GeneratorComponent);
const DescriptionComponent = () => import(
    /* webpackChunkName: "description" */  './components/description'
    ).then(m => m.DescriptionComponent);
const ExercisesComponent = () => import(
    /* webpackChunkName: "exercises" */  './components/exercises'
    ).then(m => m.ExercisesComponent);
const ChangesComponent = () => import(
    /* webpackChunkName: "changes" */  './components/changes'
    ).then(m => m.ChangesComponent);


const routes = [
    {path: '*', redirect: {name: 'Generator'}},
    {path: '/', redirect: {name: 'Generator'}},
    {
        name: 'Generator',
        path: '/:lang?/generator',
        component: GeneratorComponent,
        props: (route) => ({b: route.query.b, n: route.query.n})
    },
    {name: 'Description', path: '/:lang?/description', component: DescriptionComponent},
    {name: 'Exercises', path: '/:lang?/exercises', component: ExercisesComponent},
    {name: 'About', path: '/:lang?/about', component: AboutComponent},
];

export default routes;