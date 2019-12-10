
class Ground {
    constructor() {
        this.instance = null;
    }

    init() {
        const geometry = new THREE.PlaneGeometry(200, 200);
        const material = new THREE.ShadowMaterial({
            transparent: true,
            color: 0x000000,
            opacity: 0.2
        });

        this.instance = new THREE.Mesh(geometry, material);
        this.instance.rotation.x = -Math.PI / 2;
        this.instance.position.y = - 6;
        this.instance.receiveShadow = true;
    }

    reset(){
        this.instance.rotation.x = -Math.PI / 2;
        this.instance.position.y = - 6;
        this.instance.position.x = 0;
        this.instance.position.z = 0;
    }

    updatePosition(targetPosition) {
        this.instance.position.x = targetPosition.x
        this.instance.position.z = targetPosition.z
    }
}

export default new Ground();
