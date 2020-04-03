
import Enemy from '../Enemy';
import Party from '../Scenes/Party'
import Shot from "../Shot";
import {Vector2D} from "../../../interfaces";
import { arc } from '../../Shapes/arc';
import {isOnArc, random} from '../../../utils';

export default class Tesla extends Enemy {

    public immune: boolean = false
    public speed: number = 3
    public damages: number = 2
    public gain: number = 1
    public life: number = 2
    public arcInterval: number = 500
    public id = 'tesla'
    public arcSize:number
    public arcWeight:number
    public arcTime:number
    public cardinalIndex:number
    public connections:Tesla[] = []

    constructor( party:Party ) {
        super( party )
        const factor = this.p.random(30,50)
        this.diameter = factor
        if(this.app.hardcore){
            this.life += 2
            this.speed ++
            this.arcInterval = 250
        }
        this.arcTime = party.time
        this.arcSize = factor * 10
        this.arcWeight = 15
        this.cardinalIndex = Math.floor(Math.random() * 8)
        this.baseSpeed = this.speed
        this.baseGain = this.gain
        this.baseLife = this.life
        this.baseDamages = this.damages
    }

    public pattern(): void {

        this.connections = this.connections.filter( tesla => {
            return this.rawDist(tesla) > this.arcSize && !this.calculatedTouch(tesla)
        })

        for(const enemy of this.party.enemies){
            if(
                enemy.id === 'tesla' &&
                (enemy.isOnScreen() || this.isOnScreen()) &&
                this.rawDist(enemy) < this.arcSize &&
                !(enemy as Tesla).connections.includes(this) &&
                !this.connections.includes(enemy as Tesla)
            ) this.connections.push(enemy as Tesla)
        }

        if(this.party.time > this.arcTime)
            for(const tesla of this.connections)
                if(isOnArc(this,tesla,this.party.player,(this.arcWeight + tesla.arcWeight) * .5)){
                    this.arcTime = this.party.time + this.arcInterval
                    this.party.player.inflictDamages(1)
                }

        let target:Vector2D = [
            { x: this.arcSize * -.4, y: 0 },
            { x: this.arcSize * .4, y: 0 },
            { x: 0, y: this.arcSize * -.4 },
            { x: 0, y: this.arcSize * .4 },
            { x: this.arcSize * -.4, y: this.arcSize * -.4 },
            { x: this.arcSize * -.4, y: this.arcSize * .4 },
            { x: this.arcSize * .4, y: this.arcSize * -.4 },
            { x: this.arcSize * .4, y: this.arcSize * .4 }
        ][this.cardinalIndex]

        this.follow(target, this.speed, 10)

    }

    onPlayerContact(): void {
        this.checkShield()
    }

    kill( addToScore:boolean = false ){
        this.connections = []
        this.party.enemies.forEach( enemy => {
            if(enemy.id === 'tesla')
                (enemy as Tesla).connections = (enemy as Tesla).connections.filter(tesla => tesla !== this )
        })
        super.kill(addToScore)
    }

    overDraw(): void {
        for(const tesla of this.connections){
            if(isOnArc(this,tesla,this.party.player,(tesla.arcWeight + this.arcWeight) * .5)) {
                arc( this.app, this.party.player, tesla, tesla.arcWeight)
                arc( this.app, this.party.player, this, this.arcWeight )
            } else this.arc(tesla)
        }
    }

    onDraw(): void {
        this.p.strokeWeight(random(2,5))
        this.p.stroke(this.app.red(random(.1,.5)))
        this.p.fill(this.app.blue(.4))
        const pos = this.constrain()
        this.p.ellipse(
            pos.x,
            pos.y,
            this.onScreenBasedDiameter
        )
    }

    arc( tesla:Tesla ): void {
        arc( this.app, this, tesla, (this.arcWeight + tesla.arcWeight) * .5)
    }

    public get currentDiameter(){
        return this.lifeBasedDiameter
    }

}
