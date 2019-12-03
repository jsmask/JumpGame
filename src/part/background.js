
import camera from '@scene/camera';
import { common } from '@utils/common';

class Background {
    constructor() {
        this.instance = null;
        this.frustumSize = camera.frustumSize;
    }
    init() {
        const { width, height } = common;
        const geometry = new THREE.PlaneGeometry(this.frustumSize * 2, this.frustumSize * 2 * height / width);
        const material = new THREE.MeshBasicMaterial({
            color: 0xf5f5f5,
            opacity: 1,
            transparent: true
        })
        const mesh = new THREE.Mesh(geometry, material);
        this.instance = mesh;
    }
}

export default new Background();