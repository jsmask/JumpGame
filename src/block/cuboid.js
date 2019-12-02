import BaseBlock from './base';
import { BLOCKTYPE } from '@utils/common';

import img_stool from '@images/stool.png'

export default class CuboidBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, size) {
        super(BLOCKTYPE.CUBOID);
        this.name = this.type;
        this.instance = null;
        this.size = size || this.width;
        const geometry = new THREE.BoxGeometry(this.size, this.height, this.size);

        this.texture = new THREE.TextureLoader().load(img_stool);

        const material = new THREE.MeshPhongMaterial({ map: this.texture, color: 0xffffff });
        this.instance = new THREE.Mesh(geometry, material);

        this.x = this.instance.position.x = x;
        this.y = this.instance.position.y = y;
        this.z = this.instance.position.z = z;


    }
}
