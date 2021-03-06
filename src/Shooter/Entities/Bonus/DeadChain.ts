import Bonus from "../Bonus"
import { Passive } from "../../../interfaces"
import p5 from "p5"

export default class DeadChain extends Bonus implements Passive {
  public level = 1 // 100
  public levelMax = 4 // 175
  public id = "deadChain"
  public displayName = "Dead Chain"
  public description = "Explosion {value}px"

  applyEffect(): void {
    this.party.player.addPassive(this)
  }

  shape(p: p5, x: number, y: number, w: number, h: number): void {
    // TODO: look for a good shape
    this.p.textSize(h * 0.5)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.text("DC", x + w * 0.5, y + h * 0.5)
  }

  get value(): number {
    return 75 + this.level * 25
  }
}
