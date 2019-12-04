import scene from '@scene';
import CuboidBlock from '@block/cuboid';
import CylinderBlock from '@block/cylinder';
import ground from '@part/ground';
import bottle from '@part/bottle';
import { common, BLOCKCONFIG, BLOCKTYPE } from '@utils/common';
import utils from '@utils'



export default class StageGameMain {
    constructor(callback) {
        this.callback = callback;
    }
    init() {
        console.log(`GameMain init`);
        this.scene = scene;
        this.ground = ground;
        this.bottle = bottle;
        this.gravity = common.gravity;

        this.scene.init();
        this.ground.init();
        this.bottle.init();

        this.addGround();
        this.addInitBlock();
        this.addBottle();

        this.render();
    }
    restart() {
        console.log('restart Game')
        this.deleteObjectsFromScene()
        this.scene.reset()
        this.bottle.reset()
        this.ground.reset();
        // this.updateScore(0)
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
    addGround() {
        const scene = this.scene.instance;
        scene.add(this.ground.instance);
    }
    addBottle() {
        const scene = this.scene.instance;
        scene.add(this.bottle.instance);
        this.bottle.show().then(() => {
            this.addTouchEvent();
            this.state = 'stop';
            console.log('show end')
        });
    }
    addTouchEvent() {
        const { canvas } = common;
        canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
        canvas.addEventListener("touchend", this.onTouchEnd.bind(this));
    }
    removeTouchEvent() {
        const { canvas } = common;
        canvas.removeEventListener("touchstart", this.onTouchStart.bind(this));
        canvas.removeEventListener("touchend", this.onTouchEnd.bind(this));
    }
    onTouchStart() {
        if (this.state !== 'stop') return;
        console.log('touch start');
        this.touchStartTime = Date.now();
        this.bottle.shrink();
        this.currentBlock.shrink();
    }
    onTouchEnd() {
        if (this.state !== 'stop') return;
        console.log("touch end");
        this.touchEndTime = Date.now();
        const duration = this.touchEndTime - this.touchStartTime;
        this.bottle.velocity.vx = Math.min(duration / 6, 400);
        this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2);
        this.bottle.velocity.vy = Math.min(150 + duration / 20, 400);
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
            
            if (this.hit === 1 || this.hit === 7 || this.hit === 2) {
                this.state = 'stop';
                this.bottle.stop();
                this.bottle.instance.position.y = BLOCKCONFIG.height / 2;
                this.bottle.instance.position.x = this.bottle.destination[0];
                this.bottle.instance.position.z = this.bottle.destination[1];
                if(this.hit!==2){
                    //this.updateScore(++this.score)
                    this.updateNextBlock()
                }     
            } else {
                this.state = 'over';
                this.removeTouchEvent();
                this.callback.showGameOverStage();
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
                    return 1;
                } else {
                    return 7;
                }
            } else if (utils.pointInPolygon([destination[0] - this.bottle.width / 2, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] + this.bottle.depth], nextPolygon)) {
                result1 = 5;
            } else if (utils.pointInPolygon([destination[0], destination[1] - this.bottle.depth], nextPolygon) || utils.pointInPolygon([destination[0] + this.bottle.depth, destination[1]], nextPolygon)) {
                result1 = 3;
            }
        }

        let currentPolygon = currentBlock.getVertices();
        if (utils.pointInPolygon(destination, currentPolygon)) {
            return 2;
        } else if (utils.pointInPolygon([destination[0], destination[1] + this.bottle.depth], currentPolygon) || utils.pointInPolygon([destination[0] - this.bottle.width / 2, destination[1]], currentPolygon)) {
            if (result1) return 6;
            return 4;
        }
        return result1 || result2 || 0;
    }

    updateNextBlock() {
        const seed = Math.round(Math.random())
        const type = seed ? 'cuboid' : 'cylinder'
        const direction = Math.round(Math.random()) // 0 -> x 1 -> z
        const width = Math.round(Math.random() * 6) + 10;
        const distance = Math.round(Math.random() * 20) + 25;
        this.currentBlock = this.nextBlock
        const targetPosition = this.targetPosition = {}
        if (direction == 0) { // x
            targetPosition.x = this.currentBlock.instance.position.x + distance
            targetPosition.y = this.currentBlock.instance.position.y
            targetPosition.z = this.currentBlock.instance.position.z
        } else if (direction == 1) { // z
            targetPosition.x = this.currentBlock.instance.position.x
            targetPosition.y = this.currentBlock.instance.position.y
            targetPosition.z = this.currentBlock.instance.position.z - distance
        }
        this.setDirection(direction)
        if (type === BLOCKTYPE.CUBOID) {
            this.nextBlock = new CuboidBlock(targetPosition.x, targetPosition.y, targetPosition.z, 'popup', width)
        } else if (type === BLOCKTYPE.CYLINDER) {
            this.nextBlock = new CylinderBlock(targetPosition.x, targetPosition.y, targetPosition.z, 'popup', width)
        }
        this.scene.instance.add(this.nextBlock.instance)
        const cameraTargetPosition = {
            x: (this.currentBlock.instance.position.x + this.nextBlock.instance.position.x) / 2,
            y: (this.currentBlock.instance.position.y + this.nextBlock.instance.position.y) / 2,
            z: (this.currentBlock.instance.position.z + this.nextBlock.instance.position.z) / 2,
        }
        this.scene.updateCameraPosition(cameraTargetPosition)
        this.ground.updatePosition(cameraTargetPosition)
    }
}