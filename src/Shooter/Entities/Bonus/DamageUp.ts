import Bonus from "../Bonus"
import { Passive } from "../../../interfaces"
import p5 from "p5"

export default class DamageUp extends Bonus implements Passive {
  public level = 1 // 1.5
  public levelMax = 4 // 3
  public id = "damageUp"
  public displayName = "Damage Up"
  public description = "{value} damages"

  applyEffect(): void {
    this.party.player.addPassive(this)
  }

  shape(p: p5, x: number, y: number, w: number, h: number): void {
    // TODO: look for a good shape
    this.p.textSize(h * 0.5)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.text("D", x + w * 0.5, y + h * 0.5)
  }

  get value(): number {
    return (
      this.party.player.baseShotDamage +
      this.level * (this.party.player.baseShotDamage * 0.5)
    )
  }
}
