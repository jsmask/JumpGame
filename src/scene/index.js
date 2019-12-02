import { common } from '@utils/common'
import camera from './camera';


class Scene {

    constructor() {
        this.instance = null;
    }

    init() {
        const { width, height, canvas } = common;
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.setSize(width, height);


        this.instance = new THREE.Scene();

        this.camera = camera;
        this.camera.init();

        this.axesHelper = new THREE.AxesHelper(100);
        this.instance.add(this.axesHelper);

        this.instance.add(this.camera.instance);
    }

    render() {
        this.renderer.render(this.instance, this.camera.instance);
    }

}

export default new Scene();