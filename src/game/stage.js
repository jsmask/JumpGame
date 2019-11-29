
import StageGameMain from '@stage/stage-game-main';
import StageGameOver from '@stage/stage-game-over';

class GameStage {
    constructor() {

    }

    showGameOverStage() {
        this.stage_game_main.hide();
        this.stage_game_over.show();
    }

    showGameMainStage(){
        this.stage_game_main.show();
        this.stage_game_over.hide();
        this.stage_game_main.restart();
    }

    restartGame() {

    }

    initMainStage(callback) {
        this.stage_game_main = new StageGameMain(callback);
        this.stage_game_main.init();
    }

    initOverStage(callback) {
        this.stage_game_over = new StageGameOver(callback);
        this.stage_game_over.init();
    }
}

export default new GameStage()