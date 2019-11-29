
import Event from '@utils/event';

class GameModel {
    constructor() {
        this.stage = "";
        this.changeStage = new Event(this);
    }
    getStage() {
        return this.stage;
    }
    setStage(stage) {
        this.stage = stage;
        this.changeStage.notify({
            stage
        })
    }
}

export default new GameModel()