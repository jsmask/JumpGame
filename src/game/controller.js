import GameModel from './model'
import GameStage from './stage'


class GameController {
    constructor() {
        this.game_model = GameModel;
        this.game_stage = GameStage;
        this.game_model.changeStage.attach((sender, args) => {

            switch (args.stage) {
                case "game-over":
                    this.game_stage.showGameOverStage();
                    break;
                case "game-main":
                    this.game_stage.showGameMainStage();
                    break;
                default:
                    break;
            }
        })
    }

    initController() {

        this.game_stage.initMainStage({
           showGameOverStage:()=> this.game_model.setStage("game-over")
        });

        this.game_stage.initOverStage({
            showGameMainStage:()=> this.game_model.setStage("game-main")
        });

        this.game_model.setStage("game-main");

        

    }
}

export default new GameController()