import { common } from '@utils/common';
import { custom } from '@utils/animation';


class Camera {
    constructor() {
        this.instance = null;
        this.frustumSize = 30;
    }
    init() {
        const { aspect } = common;
        let frustumSize = this.frustumSize;
        this.instance = new THREE.OrthographicCamera(-frustumSize, frustumSize, frustumSize * aspect, -frustumSize * aspect, -100, 85);
        this.reset();
        this.instance.lookAt(this.target);
    }
    reset() {
        //-10,10,10
        this.instance.position.set(-10, 10, 10);
        this.target = new THREE.Vector3(0, 0, 0);
    }
    updatePosition(newTargetPosition) {
        custom.to(this.instance.position, 0.5, { x: newTargetPosition.x - 10, y: newTargetPosition.y + 10, z: newTargetPosition.z + 10 })
        custom.to(this.target, 0.5, { x: newTargetPosition.x, y: newTargetPosition.y, z: newTargetPosition.z })
    }
}

export default new Camera();