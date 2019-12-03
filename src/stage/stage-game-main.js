import scene from '@scene';
import CuboidBlock from '@block/cuboid';
import CylinderBlock from '@block/cylinder';
import ground from '@part/ground';

export default class StageGameMain {
    constructor(callback) {
        this.callback = callback;
    }
    init() {
        console.log(`GameMain init`);
        this.scene = scene;
        this.ground = ground;
        this.scene.init();
        this.ground.init();
        this.addGrounp();
        this.addInitBlock();
        this.render();
    }
    addInitBlock() {
        const scene = this.scene.instance;
        let cuboid_block = new CuboidBlock(-15, 0, 0);
        let cylinder_block = new CylinderBlock(23, 0, 0);

        scene.add(cuboid_block.instance);
        scene.add(cylinder_block.instance);
    }
    addGrounp() {
        const scene = this.scene.instance;
        scene.add(this.ground.instance);
    }

    restart() {

    }
    render() {
        if (this.visible) {
            this.scene.render();
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

    restart() {

    }
}