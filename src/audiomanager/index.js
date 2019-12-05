
import audio_scale_intro from "@audio/scale_intro.mp3"
import audio_scale_loop from "@audio/scale_loop.mp3"
import audio_start from "@audio/start.mp3"
import audio_fall_1 from "@audio/fall_1.mp3"
import audio_fall_2 from "@audio/fall_2.mp3"

import bottle from "@part/bottle";
import { STATUS } from "@utils/common";

const audioList = [{
    key: "scaleIntro",
    source: audio_scale_intro
}, {
    key: "scaleLoop",
    source: audio_scale_loop
}, {
    key: "audioStart",
    source: audio_start
},{
    key: "audioFall1",
    source: audio_fall_1
},{
    key: "audioFall2",
    source:  audio_fall_2
}]

class AudioManager {
    constructor() {
        this.scaleLoopBuffer = "";
        this.scaleIntroBuffer = "";
        this.audioComboBuffer = "";
        this.num = 0;
    }
    init() {
        this.listener = new THREE.AudioListener();
        this.sound = new THREE.Audio(this.listener);
        this.sound.setVolume(.8);
        this.sound.onEnded = () => {
            this.sound.stop();
            if (bottle.status === STATUS.SKRINK) {
                this.sound.setBuffer(this.scaleLoopBuffer);
                this.sound.setLoop(true);
                this.sound.play();
            }
        }
        return new Promise((resolve, reject) => {
            audioList.map(item => {
                const { key, source } = item;
                let loader = new THREE.AudioLoader();
                loader.load(source, buffer => {
                    this[`${key}Buffer`] = buffer;
                    this.num++;
                    if(this.num>=audioList.length-1){
                        resolve();
                    }
                })

            })
        })
    }
    shrinkPlay() {
        this.sound.stop();
        this.sound.setBuffer(this.scaleIntroBuffer);   
        this.sound.setLoop(false);
        this.sound.play();
    }
    shrinkStop() {
        this.sound.stop();
    }
    startPlay() {
        this.sound.setBuffer(this.audioStartBuffer);
        this.sound.setLoop(false);
        this.sound.play();
    }
    fallBlockPlay(){
        this.sound.stop();
        this.sound.setBuffer(this.audioFall2Buffer);
        this.sound.setLoop(false);
        this.sound.play();
    }
    fallPlanePlay(){
        this.sound.stop();
        this.sound.setBuffer(this.audioFall1Buffer);
        this.sound.setLoop(false);
        this.sound.play();
    }
}

export default new AudioManager();