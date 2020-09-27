import Bonus from "../Bonus"
import { Consumable } from "../../../interfaces"
import { seconds } from "../../../utils"
import p5 from "p5"
import star from "../../Shapes/star"

export default class StarBalls extends Bonus implements Consumable {
  public quantity = 1
  public id = "starBalls"
  public displayName = "Star Balls"
  public description = "Temporary multidirectional shots"

  applyEffect(): void {
    this.party.player.addConsumable(this)
  }

  public exec(): void {
    this.party.player.setTemporary("starBalls", seconds(15), this.shape)
  }

  public shape(p: p5, x: number, y: number, w: number, h: number): void {
    star(p, x + w * 0.5, y + h * 0.5, w * 0.1, w * 0.3, 8)
  }
}
