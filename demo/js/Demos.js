import {FrostFlake} from '../../src/FrostFlake';
import AnimationDemo from './AnimationDemo';
import {View} from '../../src/Views/View';

document.addEventListener('DOMContentLoaded', () =>{
    const canvas = document.getElementById('frostFlake'),
        ff = new FrostFlake(canvas, 60),
        demoMap = new Map();

    ff.showDebug = true;
    ff.start();

    demoMap.set('Empty', View);
    demoMap.set('AnimationDemo', AnimationDemo);

    ff.view = new (demoMap.get('AnimationDemo'));
});
