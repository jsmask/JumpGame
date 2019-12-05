import font from './font'




export default class Text {
	constructor() {
		this.font = new THREE.Font(font);
		this.size = 5.0;
		this.height = 0.1;
	}

	init(options) {
		this.material = new THREE.MeshBasicMaterial({ color: (options && options.fillStyle) ? options.fillStyle : 0xffffff, transparent: true });
		if (options && options.opacity) this.material.opacity = options.opacity;
		this.options = options || {};
		const geometry = new THREE.TextGeometry('0', { 'font': this.font, 'size': this.size, 'height': this.height });
		this.instance = new THREE.Mesh(geometry, this.material);
		this.instance.name = 'scoreText';
	}

	updateScore(score) {
		const scoreStr = score.toString();
		this.instance = new THREE.Mesh(new THREE.TextGeometry(scoreStr, { 'font': this.font, 'size': this.size, 'height': this.height }), this.material);
	}
}