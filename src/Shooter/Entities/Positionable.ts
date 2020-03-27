import p5 from 'p5'
import {Vector2D} from "../../interfaces"
import {LIMITS,SECURITY,VIEWPORT} from '../../config'
import { dist, map } from '../../utils'

export default class Positionable {

    public currentDiameter?:number

    constructor(
        public p:p5,
        public x:number = 0,
        public y:number = 0,
        public _diameter:number = 0
    ){}

    public get diameter(): number { return this.currentDiameter || this._diameter }
    public set diameter( diameter:number ){ this._diameter = diameter }

    public get radius(): number {
        return this.diameter * .5
    }

    public move( x:number, y:number ): void {
        this.x += x
        this.y += y
    }

    public place( x:number, y:number ): void {
        this.x = x
        this.y = y
    }

    public follow( target:Vector2D, speed:number ): void {
        if(this.rawDist(target) <= speed * 2) return
        this.p.angleMode(this.p.RADIANS)
        const angle = this.p.degrees(
            this.p.atan2(
                target.y - this.y,
                target.x - this.x
            ) + this.p.PI
        )
        const speedX = speed * this.p.cos(this.p.radians(angle))
        const speedY = speed * this.p.sin(this.p.radians(angle))
        this.move(
            speedX * -2,
            speedY * -2
        )
        this.p.angleMode(this.p.DEGREES)
    }

    public target( target:Vector2D, speedFraction:number ): void {
        if(this.rawDist(target) > 5)
            this.move(
                (target.x - this.x) * speedFraction,
                (target.y - this.y) * speedFraction
            )
    }

    public placeOutOfLimits(): void {
        this.x = LIMITS * 2
        this.y = LIMITS * 2
    }

    public placeOutOfViewport( withSecurity:boolean = false ): void {
        while(!this.isOutOfViewPort()){
            if(withSecurity){
                this.x = this.p.random( -LIMITS + SECURITY, LIMITS - SECURITY )
                this.y = this.p.random( -LIMITS + SECURITY, LIMITS - SECURITY )
            }else{
                this.x = this.p.random( -LIMITS, LIMITS )
                this.y = this.p.random( -LIMITS, LIMITS )
            }
        }
    }

    public showIfNotOnScreen(): void {
        if(!this.isOnScreen()){
            this.p.ellipse(
                this.x > this.p.width * .5 ? this.p.width * .5 : this.x < this.p.width * -.5 ? this.p.width * -.5 : this.x,
                this.y > this.p.height * .5 ? this.p.height * .5 : this.y < this.p.height * -.5 ? this.p.height * -.5 : this.y,
                map(this.rawDist(),0,LIMITS,30,0,true)
            )
        }
    }

    public isOutOfLimits(): boolean {
        return this.rawDist() > LIMITS
    }

    public isOutOfViewPort(): boolean {
        return this.rawDist() > VIEWPORT
    }

    public isOnScreen( ignoreRadius:boolean = false ): boolean {
        const radius = ignoreRadius ? 0 : this.radius
        return (
            this.x + radius > this.p.width * -.5 &&
            this.x - radius < this.p.width * .5 &&
            this.y + radius > this.p.height * -.5 &&
            this.y - radius < this.p.height * .5
        )
    }

    public calculatedDist( positionable:Positionable ): number {
        return this.rawDist(positionable) - (this.radius + positionable.radius)
    }

    public calculatedTouch( positionable:Positionable ): boolean {
        return this.calculatedDist(positionable) <= 0
    }

    public rawDist( vector:Vector2D = {x:0,y:0} ): number {
        return dist(vector.x, vector.y, this.x, this.y)
    }

    public rawTouch( vector:Vector2D = {x:0,y:0} ): boolean {
        return this.rawDist(vector) <= this.radius
    }

}
