import BaseBlock from './base';
import { BLOCKTYPE, COLOR } from '@utils/common';

import img_stool from '@images/stool.png';

export default class CuboidBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, type, size) {
        super(BLOCKTYPE.CUBOID);
        this.name = "block";
        
        this.instance = null;
        this.size = size || this.width;
        const geometry = new THREE.BoxGeometry(this.size, this.height, this.size);

        this.texture = new THREE.TextureLoader().load(img_stool);
        const material = new THREE.MeshPhongMaterial({ color: ~~COLOR[~~(COLOR.length*Math.random())] });
        this.instance = new THREE.Mesh(geometry, material);
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
