
// import * as THREE from 'three/build/three.min';
import * as THREE from 'three';
import GameController from './controller';
import { common } from '@utils/common';

window.THREE = THREE;

let app = document.getElementById("app");
let canvas = document.createElement("canvas");

let width = app.clientWidth, height = app.clientHeight;
const aspect = width / height;
// window.addEventListener("resize", () => {
//     canvas.width = app.clientWidth;
//     canvas.height = app.clientHeight;
// })
canvas.width = width;
canvas.height = height;
app.append(canvas);

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );

common.canvas = canvas;
common.width = width;
common.height = height;
common.aspect = aspect;
common.scene = scene;


class Game {
    constructor(){

    }
    init(){
        GameController.initController();
    }
}

export default new Game();