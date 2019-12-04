import GameModel from './model'
import GameStage from './stage'
import { STAGEGROUP } from '@utils/common';


class GameController {
    constructor() {
        this.game_model = GameModel;
        this.game_stage = GameStage;
        this.game_model.changeStage.attach((sender, args) => {
            switch (args.stage) {
                case STAGEGROUP.GAMEOVER:
                    this.game_stage.showGameOverStage();
                    break;
                case STAGEGROUP.GAMEMAIN:
                    this.game_stage.showGameMainStage();
                    break;
                default:
                    break;
            }
        })
    }

    initController() {

        this.game_stage.initMainStage({
            showGameOverStage: () => this.game_model.setStage(STAGEGROUP.GAMEOVER)
        });

        this.game_stage.initOverStage({
            restartGame: () => this.game_stage.restartGame()
        });

        this.game_model.setStage(STAGEGROUP.GAMEMAIN);

        // setTimeout(()=>{
        //     this.game_model.setStage(STAGEGROUP.GAMEOVER)
        // },3000)

    }
}

export default new GameController();