import { BOTTLECONFIG } from "@utils/common";
import img_head from '@images/head.png';
import img_bottom from '@images/bottom.png';
import img_top from '@images/top.png';
import { BLOCKCONFIG } from "@utils/common";

class Bottle {
    constructor() {
        const { x, y, z } = BOTTLECONFIG;
        this.x = x;
        this.y = y;
        this.z = z;
        this.instance = null;
        this.name = "bottle";
        this.radius = 1.78;
        this.blockHeight = BLOCKCONFIG.height;
    }
    init() {

        this.instance = new THREE.Object3D();
        this.instance.name = this.name;
        this.instance.position.set(this.x, this.y + this.blockHeight / 2, this.z);

        this.instance.castShadow = true;
        this.instance.receiveShadow = true;


        this.head = this.createHead();
        this.head.position.y = 10.24;
        this.head.receiveShadow = true;
        this.head.castShadow = true;

        this.body = new THREE.Object3D();


        const bottom = this.createBottom();
        bottom.receiveShadow = true;
        bottom.castShadow = true;

        const middle = this.createMiddle();
        middle.receiveShadow = true;
        middle.castShadow = true;
        middle.position.y = 3.06;

        const top = this.createTop();
        top.receiveShadow = true;
        top.castShadow = true;
        top.position.y = 3.86;


        this.body.add(top);
        this.body.add(middle);
        this.body.add(bottom);

        this.body.position.y = 1.8;

        this.instance.add(this.head);
        this.instance.add(this.body);
    }

    createHead() {
        const geometry = new THREE.IcosahedronGeometry(this.radius, 3);
        const texture = new THREE.TextureLoader().load(img_head);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    createBottom() {
        const geometry = new THREE.CylinderGeometry(this.radius * 0.78, this.radius * 1.17, this.radius * 2.1, 20);
        const texture = new THREE.TextureLoader().load(img_bottom);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    createMiddle() {
        const geometry = new THREE.CylinderGeometry(this.radius * 0.955, this.radius * 0.78, this.radius * 1.41, 20);
        const texture = new THREE.TextureLoader().load(img_bottom);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    createTop() {
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32, 0, 6.4, 0, 1.3);
        const texture = new THREE.TextureLoader().load(img_top);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    update() {
        // this.head.rotation.y += 0.1;
    }
}

export default new Bottle();