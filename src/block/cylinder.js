import BaseBlock from './base';
import { BLOCKTYPE, COLOR } from '@utils/common';

// import img_stool from '@images/stool.png'


export default class CylinderBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, type, size) {
        super(BLOCKTYPE.CYLINDER);
        this.name = "block";
        this.instance = null;
        this.size = size || this.width;

        // const geometry = new THREE.CylinderGeometry(this.size / 2, this.size / 2, this.height, 100);

        // this.texture = new THREE.TextureLoader().load(img_stool);

        // const material = new THREE.MeshPhongMaterial({ color: ~~COLOR[~~(COLOR.length*Math.random())] });

        const main_material = new THREE.MeshPhongMaterial({ color: ~~COLOR[~~(COLOR.length * Math.random())] });
        const while_material = new THREE.MeshPhongMaterial({ color: 0xf5f5f5 });
        const while_box_height = 2.2;
        const main_box_height = (this.height - while_box_height) / 2;

        const main_geometry = new THREE.CylinderGeometry(this.size / 2, this.size / 2, main_box_height, 100);
        const while_geometry = new THREE.CylinderGeometry(this.size / 2, this.size / 2, while_box_height, 100);

        const total_mesh = new THREE.Object3D();
        const top_mesh = new THREE.Mesh(main_geometry, main_material);
        const middle_mesh = new THREE.Mesh(while_geometry, while_material);
        const bottom_mesh = new THREE.Mesh(main_geometry, main_material);

        top_mesh.position.y = (while_box_height + main_box_height) / 2;
        middle_mesh.position.y = 0;
        bottom_mesh.position.y = -top_mesh.position.y;

        top_mesh.castShadow = middle_mesh.castShadow = bottom_mesh.castShadow = true;
        top_mesh.receiveShadow = middle_mesh.receiveShadow = bottom_mesh.receiveShadow = true;


        total_mesh.add(top_mesh, middle_mesh, bottom_mesh);

        this.instance = total_mesh;
        this.instance.receiveShadow = true;
        this.instance.castShadow = true;
        this.instance.name = this.name;
        this.x = this.instance.position.x = x;
        this.y = this.instance.position.y = y;
        this.z = this.instance.position.z = z;

        if (type === 'popup') {
            this.popup()
        } else if (type === 'show') {
            this.instance.position.x = this.x
            this.instance.position.y = this.y
            this.instance.position.z = this.z
        }

    }
}
