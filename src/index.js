/**
 * Webpack will look for this file to build the code for your game.
 * Overwite the contents of this file and run `npm run build` in the terminal to see your changes.
 */

import FrostFlake from './FrostFlake';
import View from './Views/View';
import AnimationDemo from '../demos/AnimationDemo';
import CollisionDemo from '../demos/CollisionDemo';
import InputDemo from '../demos/InputDemo';
import ManySpritesDemo from '../demos/ManySpritesDemo';
import ParentChildDemo from '../demos/ParentChildDemo';
import RenderTargetDemo from '../demos/RenderTargetDemo';

const canvas = document.getElementById('frostFlake');
const ff = new FrostFlake(canvas, 60);
ff.showDebug = false;
ff.start();

const buttons = document.getElementsByTagName('button');
for (let i = 0; i < buttons.length; i++) {
    let view = buttons[i].id;
    buttons[i].addEventListener('click', evt => {
        console.clear();
        ff.camera.reset();
        if (view == "Empty") {
            ff.view = new View();
        }
        else {
            ff.view = eval(`new ${view}`);
        }
    });
}

window.ff = ff;
window.AnimationDemo = AnimationDemo;
window.CollisionDemo = CollisionDemo;
window.InputDemo = InputDemo;
window.ManySpritesDemo = ManySpritesDemo;
window.ParentChildDemo = ParentChildDemo;
window.RenderTargetDemo = RenderTargetDemo;