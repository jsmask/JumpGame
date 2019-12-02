
class Light {
    constructor() {
        this.instances = {};
    }
    init() {
        const ambient_light = new THREE.AmbientLight(0xffffff, 0.8);
        const directional_light = new THREE.DirectionalLight(0xffffff, 0.3);
        directional_light.position.set(10, 30, 20);
        
        const shadow_geometry = new THREE.PlaneBufferGeometry(0.1, 0.1);
        const shadow_material = new THREE.MeshBasicMaterial({
            color: 0xf2f2f2
        });
        const shadow_tagret = new THREE.Mesh(shadow_geometry, shadow_material);
        shadow_tagret.visible = false;
        shadow_tagret.name = "shadow_target"

        directional_light.position.set(10, 30, 20);
        directional_light.target = shadow_tagret;

        this.instances.ambient_light = ambient_light;
        this.instances.directional_light = directional_light;
    }
}

export default new Light();