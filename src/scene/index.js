import { common } from '@utils/common'
import camera from './camera';
import light from './light';
import background from '@part/background';


class Scene {

    constructor() {
        this.instance = null;

    }

    init() {
        const { width, height, canvas } = common;
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            preserveDrawingBuffer: true,

        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        // this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.setSize(width, height);


        this.instance = new THREE.Scene();

        this.camera = camera;
        this.camera.init();

        this.light = light;
        this.light.init();

        this.axesHelper = new THREE.AxesHelper(100);
        // this.instance.add(this.axesHelper);

        this.instance.add(this.camera.instance);

        for (const key in this.light.instances) {
            if (this.light.instances.hasOwnProperty(key)) {
                this.instance.add(this.light.instances[key]);
            }
        }

        this.background = background;
        this.background.init();
        this.background.instance.position.z = -84;
        this.camera.instance.add(this.background.instance);
    }

    render() {
        this.renderer.render(this.instance, this.camera.instance);
    }

    updateCameraPosition(targetPosition) {
        this.camera.updatePosition(targetPosition);
        this.light.updatePosition(targetPosition);
    }


    reset() {
        this.camera.reset()
        this.light.reset()
    }

    addScore (scoreInstance) {
        this.currentScore = scoreInstance;
        this.camera.instance.add(scoreInstance);
        scoreInstance.position.x = -24;
        scoreInstance.position.y = 42;
      }
    
      updateScore (scoreInstance) {
        this.camera.instance.remove(this.currentScore);
        this.currentScore = scoreInstance;
        this.camera.instance.add(scoreInstance);
        scoreInstance.position.x = -24;
        scoreInstance.position.y = 42;
      }

}

export default new Scene();