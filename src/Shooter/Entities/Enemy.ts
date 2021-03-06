import App from "../App"
import Shot from "./Shot"
import { Vector2D } from "../../interfaces"
import Party from "./Scenes/Party"
import explosion from "../Animations/explosion"
import textFadeOut from "../Animations/textFadeOut"
import { constrain } from "../../utils"
import Dirigible from "./Dirigible"
import p5 from "p5"

export default abstract class Enemy extends Dirigible {
  protected readonly MIN_DIAMETER = 15
  public baseGain: number
  public baseLife: number
  public baseSpeed: number
  public baseDamages: number
  public abstract gain: number
  public abstract life: number
  public abstract speed: number
  public abstract damages: number
  public abstract immune: boolean
  public abstract id: string
  public abstract pattern(): void
  public abstract onPlayerContact(): void
  public shotFilter?: (shoot: Shot) => boolean
  public onDraw?: () => void
  public overDraw?: () => void
  public app: App

  private lastDeadChain = 0
  protected image: p5.Image

  protected constructor(public party: Party) {
    super(party.p)
    this.app = party.app
    this.image = this.app.images.enemy
    this.reset()
  }

  public step() {
    if (!this.immune)
      for (const shot of this.party.player.shots)
        if (this.calculatedTouch(shot))
          if ((this.shotFilter && this.shotFilter(shot)) || !this.immune)
            if (shot.handleShoot(this)) this.inflictDamages(shot.damage, true)

    if (this.calculatedTouch(this.party.player)) this.onPlayerContact()

    if (!this.isOutOfLimits()) this.pattern()
  }

  public draw() {
    if (this.overDraw) this.overDraw()
    this.p.push()
    if (this.onDraw) this.onDraw()
    else
      this.drawImage(this.image, {
        diameter: this.onScreenBasedDiameter,
        position: this.constrain(),
      })
    this.p.pop()
  }

  public kill(addToScore: boolean = false): void {
    const position: Vector2D = { x: this.x, y: this.y }

    if (addToScore) this.party.player.kills++

    const deadChain = this.party.player.getPassive("deadChain")
    if (addToScore && deadChain) {
      setTimeout(() => {
        for (const enemy of this.party.enemies)
          if (
            enemy !== this &&
            this.party.time > enemy.lastDeadChain + 1000 &&
            enemy.life > 0 &&
            !enemy.immune &&
            enemy.rawDist(position) < deadChain.value
          ) {
            enemy.inflictDamages(this.baseLife * 0.5, true)
            enemy.lastDeadChain = this.party.time
          }
      }, 200)
    }

    this.party.setAnimation(
      explosion({
        position,
        className: "low",
        duration: 200,
        value: addToScore && deadChain ? deadChain.value * 2 : this.diameter,
      })
    )
    if (addToScore)
      this.party.setAnimation(
        textFadeOut({
          position,
          className: "high",
          attach: true,
          duration: 500,
          value: {
            text: `+ ${this.gain} pts`,
            color: this.p.color(this.app.white),
          },
        })
      )

    if (addToScore) this.party.player.addScore(this.gain)
    this.reset()
  }

  public inflictDamages(damages: number, addToScore: boolean = false): void {
    if (this.immune) return
    this.party.setAnimation(
      textFadeOut({
        className: "high",
        attach: true,
        position: this,
        duration: 300,
        value: {
          text: `- ${damages}`,
          color: this.p.color(255, 20, 20),
        },
      })
    )
    this.life -= damages
    if (this.life <= 0) {
      this.kill(addToScore)
    }
  }

  public reset(): void {
    if (this.baseGain && this.baseLife && this.baseSpeed && this.baseDamages) {
      this.gain = this.baseGain
      this.life = this.baseLife
      this.speed = this.baseSpeed
      this.damages = this.baseDamages
    }
    this.placeOutOfViewport()
  }

  public get lifeBasedDiameter(): number {
    return constrain(
      this.p.map(this.life, 0, this.baseLife, 0, this._diameter),
      this.MIN_DIAMETER,
      this._diameter
    )
  }

  public get onScreenBasedDiameter(): number {
    return this.isOnScreen() ? this.diameter : 15
  }

  public checkShield(killSelf: boolean = true): void {
    const shield = this.party.player.getPassive("shield")
    let notProtected = !shield || shield.level < this.damages
    if (notProtected) {
      this.party.player.removePassive("shield")
      this.party.player.inflictDamages(this.damages)
    }
    if (killSelf && !this.immune) this.kill(!notProtected)
  }
}
