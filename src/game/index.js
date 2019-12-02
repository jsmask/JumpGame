
import GameController from './controller';
import { common } from '@utils/common';


let app = document.getElementById("app");
let canvas = document.createElement("canvas");

let width = app.clientWidth, height = app.clientHeight;
const aspect = height /width;

canvas.width = width;
canvas.height = height;

app.append(canvas);

common.canvas = canvas;
common.width = width;
common.height = height;
common.aspect = aspect;


class Game {
    constructor(){

    }
    init(){
        GameController.initController();
    }
}

export default new Game();