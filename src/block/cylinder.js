import BaseBlock from './base';
import { BLOCKTYPE } from '@utils/common';

export default class CylinderBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, size) {
        super(BLOCKTYPE.CYLINDER);
        this.name = this.type;
        this.instance = null;
        this.size = size || this.width;
        const geometry = new THREE.CylinderGeometry(this.size / 2, this.size / 2, this.height, 100);
        const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
        this.instance = new THREE.Mesh(geometry, material);

        this.x = this.instance.position.x = x;
        this.y = this.instance.position.y = y;
        this.z = this.instance.position.z = z;

    }
}
