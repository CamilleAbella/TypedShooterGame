import Scene from "../Scene"
import Enemy from "../Enemy"
import Bonus from "../Bonus"
import Particles from "../Particles"
import Player from "../Player"
import { map, pickBonus, pickEnemy } from "../../../utils"
import App from "../../App"
import Rate from "../Rate"

export default class Party extends Scene {
  private readonly maxEnemyCount = 60
  private readonly minEnemyCount = 10
  private readonly baseBonusState = 5

  public background: Particles
  public foreground: Particles
  public nextBonusState: number
  public lastBonusState: number
  public enemies: Enemy[]
  public bonus: Bonus[]
  public player: Player

  constructor(app: App) {
    super(app)
    this.showParticles = false
    this.background = new Particles(this.app, 30, 0, 1)
    this.foreground = new Particles(this.app, 10, 1, 2)
    this.reset()
  }

  private newBonusState() {
    this.lastBonusState = this.nextBonusState
    this.nextBonusState += Math.max(5, map(this.player.score, 0, 1000, 10, 200))
  }

  reset() {
    this.time = 0
    this.rate = new Rate(25)
    this.lastBonusState = 0
    this.nextBonusState = this.baseBonusState
    this.player = new Player(this)
    this.enemies = []
    this.bonus = []
    this.animations = {}
    for (let i = 0; i < this.enemyCount; i++) {
      this.enemies.push(pickEnemy(this))
    }
  }

  draw() {
    this.background.draw()
    this.drawAnimations("low")
    this.enemies.forEach((enemy) => enemy.draw())
    this.bonus.forEach((bonus) => bonus.draw())
    this.player.draw()
    this.drawAnimations("high")
    this.foreground.draw()
    const isHigh = this.player.score > this.player.highScore
    this.p.fill(0, 90)
    this.p.noStroke()
    this.p.rect(
      this.p.width * -0.3,
      this.p.height * -0.5 + 50,
      this.p.width * 0.6,
      30,
      2
    )
    if (this.player.score > 0) {
      isHigh ? this.p.noFill() : this.p.fill(this.app.blue(0.6))
      this.p.rect(
        this.p.width * -0.3,
        this.p.height * -0.5 + 50,
        Math.max(
          0,
          Math.min(
            this.p.width * 0.6,
            this.p.map(
              this.player.score,
              0,
              this.player.highScore,
              0,
              this.p.width * 0.6
            )
          )
        ),
        30,
        2
      )
      this.p.fill(this.app.red(0.6))
      this.p.rect(
        this.p.width * -0.3,
        this.p.height * -0.5 + 70,
        Math.max(
          0,
          Math.min(
            this.p.width * 0.6,
            this.p.map(
              this.player.score,
              this.lastBonusState,
              this.nextBonusState,
              0,
              this.p.width * 0.6
            )
          )
        ),
        10,
        5
      )
    }
    this.p.noFill()
    isHigh ? this.p.stroke(255, 215, 0) : this.p.stroke(100)
    this.p.strokeWeight(3)
    this.p.rect(
      this.p.width * -0.3,
      this.p.height * -0.5 + 50,
      this.p.width * 0.6,
      30,
      2
    )
    this.p.noStroke()
    this.p.fill(this.app.white, 200)
    this.p.textAlign(this.p.CENTER, this.p.CENTER)
    this.p.textSize(25)
    if (!isHigh)
      this.p.text(
        `${this.player.score} / ${this.player.highScore} pts`,
        0,
        this.p.height * -0.5 + 65
      )
    else
      this.p.text(
        `${this.player.highScore} + ${
          this.player.score - this.player.highScore
        } pts`,
        0,
        this.p.height * -0.5 + 65
      )
    this.drawButtons()
    this.drawAnimations("popup")
  }

  async step() {
    this.background.step()
    this.foreground.step()
    this.bonus.forEach((bonus) => bonus.step())
    this.bonus = this.bonus.filter((bonus) => !bonus.used)
    this.enemies = this.enemies
      .sort((a: any, b: any) => {
        return (
          (b.currentDiameter || b.diameter) - (a.currentDiameter || a.diameter)
        )
      })
      .filter((enemy) => !enemy.isOutOfLimits())
    while (this.enemies.length < this.enemyCount)
      this.enemies.push(pickEnemy(this))
    this.enemies.forEach((enemy) => enemy.step())
    await this.player.step()
    if (this.player.score >= this.nextBonusState) {
      this.newBonusState()
      const bonus = pickBonus(this)
      this.bonus.push(bonus)
    }
  }

  keyPressed(key: string) {
    if (key === "Escape") this.app.sceneName = "manual"
    else this.player.keyPressed(key)
  }

  public scroll(x: number, y: number) {
    for (const className in this.animations)
      this.animations[className]
        .filter((a) => !a.attach)
        .forEach((a) => a.scroll(x, y))
    this.background.scroll(x, y)
    this.foreground.scroll(x, y)
    this.enemies.forEach((enemy) => enemy.scroll(x, y))
    this.player.shots.forEach((shoot) => {
      shoot.basePosition.scroll(x, y)
      shoot.scroll(x, y)
    })
    this.bonus.forEach((bonus) => bonus.scroll(x, y))
  }

  get enemyCount(): number {
    return Math.max(
      Math.floor(
        Math.min(
          this.p.map(
            this.player.score,
            0,
            150,
            this.minEnemyCount,
            this.maxEnemyCount
          ),
          this.maxEnemyCount
        )
      ),
      this.minEnemyCount
    )
  }

  mousePressed(): any {}
}
