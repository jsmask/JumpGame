import { BLOCKCONFIG } from "@utils/common";


export default class BaseBlock {
    constructor(type) {
        this.type = type;
        this.width = BLOCKCONFIG.width;
        this.height = BLOCKCONFIG.height;
    }
}
