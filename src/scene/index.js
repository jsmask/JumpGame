import { common } from '@utils/common'
import camera from './camera';
import light from './light';


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
        // this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.setSize(width, height);


        this.instance = new THREE.Scene();

        this.camera = camera;
        this.camera.init();

        this.light = light;
        this.light.init();

        this.axesHelper = new THREE.AxesHelper(100);
        this.lightHelper = new THREE.DirectionalLightHelper( this.light.instances["directional_light"], 15);
        this.instance.add(this.axesHelper);
        this.instance.add(this.lightHelper);

        this.instance.add(this.camera.instance);

        for (const key in this.light.instances) {
            if (this.light.instances.hasOwnProperty(key)) {
                this.instance.add(this.light.instances[key]);
            }
        }
    }

    render() {
        this.renderer.render(this.instance, this.camera.instance);
    }

}

export default new Scene();