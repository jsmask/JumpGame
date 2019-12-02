import scene from '@scene';
import { common } from '@utils/common';

export default class StageGameOver {
    constructor(callback) {
        this.callback = callback;
    }
    init() {
        console.log(`GameOver init`);
        this.render();
    }
    render() {
        const { width, height } = common;
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = 'rgba(0,0,0,.7)';
        this.context.fillRect((width - 200) / 2, (height - 100) / 2, 200, 100);
        this.context.fillStyle = '#eee';
        this.context.font = '20px Georgia';
        this.context.fillText('Game Over', (width - 200) / 2 + 50, (height - 100) / 2 + 55);

        this.texture = new THREE.Texture(this.canvas);

        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            // side: THREE.DoubleSide
        });

        this.geometry = new THREE.PlaneGeometry(width, height);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.z = 20;
        this.mesh.visible = false;

        this.texture.needsUpdate = true;
        scene.instance.add(this.mesh);
    }

    show() {
        console.log(`GameOver show`);
        this.mesh.visible = true;
    }

    hide() {
        console.log(`GameOver hide`);
        this.mesh.visible = false;
    }

}