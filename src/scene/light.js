

class Light {
    constructor() {
        this.instances = {};
    }
    init() {
        const ambient_light = new THREE.AmbientLight(0xffffff, 0.8);
        const directional_light = new THREE.DirectionalLight(0xffffff, 0.3);

        const shadow_geometry = new THREE.PlaneBufferGeometry(0.1, 0.1);
        const shadow_material = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        const shadow_tagret = new THREE.Mesh(shadow_geometry, shadow_material);
        shadow_tagret.visible = false;
        shadow_tagret.name = "shadowTarget";


        directional_light.position.set(10, 30, 20);
        directional_light.target = shadow_tagret;
        directional_light.castShadow = true;

        directional_light.shadow.camera.near = 0.5;
        directional_light.shadow.camera.far = 500;
        directional_light.shadow.camera.left = -100;
        directional_light.shadow.camera.right = 100;
        directional_light.shadow.camera.bottom = -100;
        directional_light.shadow.camera.top = 100;
        directional_light.shadow.mapSize.width = 1024;
        directional_light.shadow.mapSize.height = 1024;

        this.instances.ambient_light = ambient_light;
        this.instances.directional_light = directional_light;
    }
}

export default new Light();