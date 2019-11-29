const { common } = require('@utils/common');
import img_stool from '@images/stool.png';

export default class StageGameMain {
    constructor(callback) {
        this.callback = callback;
    }
    init() {
        console.log(`GameMain init`);
        this.render();
    }
    restart() {

    }
    render() {
        const { width, height, canvas, scene } = common;
        let renderer = common.renderer = new THREE.WebGLRenderer({
            canvas
        })

        let camera = common.camera = new THREE.OrthographicCamera(width / 2, -width / 2, height / 2, -height / 2, -1000, 1000);

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 0;

        camera.lookAt(new THREE.Vector3(0, 0, 1));

        this.texture = new THREE.TextureLoader().load(img_stool);

        renderer.setClearColor(new THREE.Color(0xffffff));
        renderer.setSize(width, height);

        let geometry1 = new THREE.TorusBufferGeometry(150, 25, 50, 100);
        let material1 = new THREE.MeshBasicMaterial({
            map: this.texture,
            color: 0xfdcdcd
        });
        this.torus = new THREE.Mesh(geometry1, material1);

        this.torus.position.x = 0;
        this.torus.position.y = 0;
        this.torus.position.z = 200;

        this.torus.visible = false;

        scene.add(this.torus);

        renderer.render(scene, camera);

        let animate = (dt) => {
            requestAnimationFrame(animate);

            this.torus.rotation.x += 0.01;
            this.torus.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();
    }

    show() {
        console.log(`GameMain show`);
        this.torus.visible = true;
    }

    hide() {
        console.log(`GameNain hide`);
        this.torus.visible = false;
    }

    restart() {

    }
}