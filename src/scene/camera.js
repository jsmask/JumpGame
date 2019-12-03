import { common } from '@utils/common';


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
        this.instance.position.set(-10,10,10);
        this.target = new THREE.Vector3(0, 0, 0);
    }
}

export default new Camera();