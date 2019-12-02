import '@css/style.css';
import * as THREE from 'three/build/three.min';
// import * as THREE from 'three';
import Main from '@src/main';
import { common } from '@utils/common';

window.THREE = common.THREE = THREE;

!(function () {
    Main.init();
})()


