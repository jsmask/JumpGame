import scene from '@scene';
import CuboidBlock from '@block/cuboid';
import CylinderBlock from '@block/cylinder';
import ground from '@part/ground';
import bottle from '@part/bottle';
import { common, BLOCKCONFIG, BLOCKTYPE } from '@utils/common';
import utils from '@utils'
import ScoreText from '@part/scoreText'
import audiomanager from '../audiomanager';
import { stopAllAnimation } from '@utils/animation';

const HIT_NEXT_BLOCK_NORMAL = 1;
const HIT_BLOCK_CURRENT = 2;
const GAME_OVER_NEXT_BLOCK_FRONT = 3;
const GAME_OVER_CURRENT_BLOCK_BACK = 4;
const GAME_OVER_NEXT_BLOCK_BACK = 5;
const GAME_OVER_BOTH = 6;
const HIT_NEXT_BLOCK_CENTER = 7;

export default class StageGameMain {
    constructor(callback) {
        this.callback = callback;
    }
    init() {
        console.log(`GameMain init`);
        const { canvas } = common;
        this.canvas = canvas;
        this.score = 0;
        this.scene = scene;
        this.ground = ground;
        this.bottle = bottle;
        this.gravity = common.gravity;
        this.scoreText = new ScoreText();


        this.scoreText.init();
        this.scene.init();
        this.ground.init();
        this.bottle.init();

        audiomanager
            .init()
            .then(() => {
                this.addBottle();
            });

        this.addGround();
        this.addInitBlock();

        this.addScore();
        this.render();
    }
    restart() {
        console.log('restart Game');
        this.score = 0;
        this.state = '';
        this.deleteObjectsFromScene();
        this.scene.reset();
        this.bottle.reset();
        this.ground.reset();
        this.updateScore(0);
        this.addInitBlock();
        this.addGround();
        this.addBottle();
    }
    addInitBlock() {
        const scene = this.scene.instance;
        this.currentBlock = new CuboidBlock(-15, 0, 0);
        this.nextBlock = new CylinderBlock(23, 0, 0);

        scene.add(this.currentBlock.instance);
        scene.add(this.nextBlock.instance);

        const initDirection = 0;
        this.targetPosition = this.nextBlock.instance.position;
        this.setDirection(initDirection);
    }
    addScore() {
        this.scene.addScore(this.scoreText.instance)
    }
    updateScore(score) {
        this.scoreText.updateScore(score);
        this.scene.updateScore(this.scoreText.instance);
    }
    addGround() {
        const scene = this.scene.instance;
        scene.add(this.ground.instance);
    }
    addBottle() {
        const scene = this.scene.instance;
        audiomanager.startPlay();
        scene.add(this.bottle.instance);
        this.bottle.show().then(() => {
            this.addTouchEvent();
            this.state = 'stop';
            console.log('show end');
        });
    }
    addTouchEvent() {
        this.canvas.addEventListener("touchstart", this.onTouchStart, false);
        this.canvas.addEventListener("touchend", this.onTouchEnd, false);
    }
    removeTouchEvent() {
        this.canvas.removeEventListener("touchstart", this.onTouchStart, false);
        this.canvas.removeEventListener("touchend", this.onTouchEnd, false);
    }
    onTouchStart = e => {
        console.log('touch start');
        if (this.state !== 'stop') return;
        this.touchStartTime = Date.now();
        audiomanager.shrinkPlay();
        this.bottle.shrink();
        this.currentBlock.shrink();
    }
    onTouchEnd = e => {
        console.log('touch end');
        if (this.state !== 'stop') return;
        if (this.touchStartTime === 0) return;
        audiomanager.shrinkStop();
        this.touchEndTime = Date.now();
        const duration = this.touchEndTime - this.touchStartTime;
        this.touchStartTime = 0;
        this.bottle.velocity.vx = Math.min(duration / 6, 120);
        this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2);
        this.bottle.velocity.vy = Math.min(150 + duration / 30, 300);
        this.bottle.velocity.vy = +this.bottle.velocity.vy.toFixed(2);
        this.state = "jump";
        this.hit = this.getHitStatus(this.bottle, this.currentBlock, this.nextBlock, BLOCKCONFIG.height / 2 - (1 - this.currentBlock.instance.scale.y) * BLOCKCONFIG.height)
        this.checkingHit = true
        this.currentBlock.rebound();
        this.bottle.rotate();
        this.bottle.jump();
    }

    setDirection(direction) {
        const currentPosition = {
            x: this.bottle.instance.position.x,
            z: this.bottle.instance.position.z
        }
        this.axis = new THREE.Vector3(this.targetPosition.x - currentPosition.x, 0, this.targetPosition.z - currentPosition.z);
        this.axis.normalize();
        this.bottle.setDirection(direction, this.axis);
    }


    render() {
        if (this.currentBlock) {
            this.currentBlock.update()
        }
        if (this.visible) {
            this.scene.render();
        }
        this.checkBottleHit();
        if (this.bottle) {
            this.bottle.update();
        }

        requestAnimationFrame(this.render.bind(this))
    }

    show() {
        console.log(`GameMain show`);
        this.visible = true;
    }

    hide() {
        console.log(`GameNain hide`);
        this.visible = false;
    }

    deleteObjectsFromScene() {
        let obj = this.scene.instance.getObjectByName('block')
        while (obj) {
            this.scene.instance.remove(obj)
            if (obj.geometry) {
                obj.geometry.dispose()
            }
            if (obj.material) {
                obj.material.dispose()
            }
            obj = this.scene.instance.getObjectByName('block');
        }
        this.scene.instance.remove(this.bottle.instance)
        this.scene.instance.remove(this.ground.instance)
    }

    checkBottleHit() {
        if (this.checkingHit && this.bottle.instance.position.y <= BLOCKCONFIG.height / 2 + 0.1 && this.bottle.status === 'jump' && this.bottle.flyingTime > 0.3) {
            this.checkingHit = false;

            if (this.hit === HIT_NEXT_BLOCK_NORMAL || this.hit === HIT_NEXT_BLOCK_CENTER) {
                this.state = 'stop';
                this.bottle.stop();
                this.bottle.instance.position.y = BLOCKCONFIG.height / 2;
                this.bottle.instance.position.x = this.bottle.destination[0];
                this.bottle.instance.position.z = this.bottle.destination[1];
                this.updateScore(++this.score);
                this.updateNextBlock();
            } else if (this.hit === HIT_BLOCK_CURRENT) {
                this.state = 'stop';
                this.bottle.stop();
                this.bottle.instance.position.y = BLOCKCONFIG.height / 2;
                this.bottle.instance.position.x = this.bottle.destination[0];
                this.bottle.instance.position.z = this.bottle.destination[1];
            }
            else {
                if (this.hit === GAME_OVER_CURRENT_BLOCK_BACK || this.hit === GAME_OVER_NEXT_BLOCK_BACK) {
                    stopAllAnimation();
                    this.bottle.stop();
                    this.bottle.forerake();
                    audiomanager.fallBlockPlay();
                }
                else if (this.hit === GAME_OVER_NEXT_BLOCK_FRONT) {
                    stopAllAnimation();
                    this.bottle.stop();
                    this.bottle.hypsokinesis();
                    audiomanager.fallBlockPlay();
                } else {
                    stopAllAnimation();
                    this.bottle.stop();
                    this.bottle.fall();
                    audiomanager.fallPlanePlay();
                }
                this.state = 'over';
                this.removeTouchEvent();
                setTimeout(() => {
                    this.callback.showGameOverStage();
                }, 1500);
            }
        }
    }

    getHitStatus(bottle, currentBlock, nextBlock, initY) {
        let flyingTime = bottle.velocity.vy / this.gravity * 2;
        initY = initY || +bottle.instance.position.y.toFixed(2);
        let destinationY = BLOCKCONFIG.height / 2;
        let differenceY = destinationY;
        let time = +((-bottle.velocity.vy + Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * this.gravity * differenceY)) / -this.gravity).toFixed(2);
        flyingTime -= time;
        flyingTime = +flyingTime.toFixed(2);
        let destination = [];
        let bottlePosition = new THREE.Vector2(bottle.instance.position.x, bottle.instance.position.z);
        let translate = new THREE.Vector2(this.axis.x, this.axis.z).setLength(bottle.velocity.vx * flyingTime);
        bottlePosition.add(translate);
        bottle.destination = [+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2)];
        destination.push(+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2));
        let result1, result2;
        if (nextBlock) {
            let nextDiff = Math.pow(destination[0] - nextBlock.instance.position.x, 2) + Math.pow(destination[1] - nextBlock.instance.position.z, 2);
            let nextPolygon = nextBlock.getVertices();
            if (utils.pointInPolygon(destination, nextPolygon)) {
                if (Math.abs(nextDiff) < 5) {
                    return HIT_NEXT_BLOCK_NORMAL;
                } else {
                    return HIT_NEXT_BLOCK_CENTER;
                }
            } else if (utils.pointInPolygon([destination[0] - this.bottle.width, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] + this.bottle.depth / 2], nextPolygon)) {
                result1 = GAME_OVER_NEXT_BLOCK_BACK;
            } else if (utils.pointInPolygon([destination[0], destination[1] - this.bottle.depth / 2], nextPolygon) || utils.pointInPolygon([destination[0] + this.bottle.depth / 2, destination[1]], nextPolygon)) {
                result1 = GAME_OVER_NEXT_BLOCK_FRONT;
            }
        }

        let currentPolygon = currentBlock.getVertices();
        if (utils.pointInPolygon(destination, currentPolygon)) {
            return HIT_BLOCK_CURRENT;
        } else if (utils.pointInPolygon([destination[0], destination[1] + this.bottle.depth], currentPolygon) || utils.pointInPolygon([destination[0] - this.bottle.width / 2, destination[1]], currentPolygon)) {
            if (result1) return GAME_OVER_BOTH;
            return GAME_OVER_CURRENT_BLOCK_BACK;
        }
        return result1 || result2 || 0;
    }

    updateNextBlock() {
        const seed = Math.round(Math.random());
        const type = seed ? 'cuboid' : 'cylinder'
        const direction = Math.round(Math.random());
        const width = Math.round(Math.random() * 6) + 10;
        const distance = Math.round(Math.random() * 25) + 20;
        this.currentBlock = this.nextBlock
        const targetPosition = this.targetPosition = {}
        if (direction === 0) {
            targetPosition.x = this.currentBlock.instance.position.x + distance;
            targetPosition.y = this.currentBlock.instance.position.y;
            targetPosition.z = this.currentBlock.instance.position.z;
        }
        if (direction === 1) {
            targetPosition.x = this.currentBlock.instance.position.x;
            targetPosition.y = this.currentBlock.instance.position.y;
            targetPosition.z = this.currentBlock.instance.position.z - distance;
        }
        this.setDirection(direction)
        if (type === BLOCKTYPE.CUBOID) {
            this.nextBlock = new CuboidBlock(targetPosition.x, targetPosition.y, targetPosition.z, 'popup', width);
        } else if (type === BLOCKTYPE.CYLINDER) {
            this.nextBlock = new CylinderBlock(targetPosition.x, targetPosition.y, targetPosition.z, 'popup', width);
        }
        this.scene.instance.add(this.nextBlock.instance);
        const cameraTargetPosition = {
            x: (this.currentBlock.instance.position.x + this.nextBlock.instance.position.x) / 2,
            y: (this.currentBlock.instance.position.y + this.nextBlock.instance.position.y) / 2,
            z: (this.currentBlock.instance.position.z + this.nextBlock.instance.position.z) / 2,
        }
        this.scene.updateCameraPosition(cameraTargetPosition);
        this.ground.updatePosition(cameraTargetPosition);
    }
}