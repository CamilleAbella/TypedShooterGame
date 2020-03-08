import p5 from 'p5';

export default class Positionable {

    constructor(
        public p:p5,
        public x:number = 0,
        public y:number = 0,
        public z:number = 0
    ){}

    public get radius(){ return this.z }
    public set radius( z ){ this.z = z }

    public move( x:number, y:number, z:number = 0 ){
        this.x += x
        this.y += y
        this.z += z
    }

    public place( x:number, y:number, z:number = this.z ){
        this.x = x
        this.y = y
        this.z = z
    }

    public follow( positionable:Positionable, speed:number ){
        const angle = this.p.degrees(
            this.p.atan2(
                positionable.y - this.y,
                positionable.x - this.x
            ) + this.p.PI
        )
        const speedX = speed * this.p.cos(this.p.radians(angle))
        const speedY = speed * this.p.sin(this.p.radians(angle))
        this.move(
            speedX * -2,
            speedY * -2
        )
    }

    public placeOutOfLimits(){
        this.x = this.p.width * 10
        this.y = this.p.height * 10
    }

    public isOutOfLimits(){
        return (
            this.x > this.p.width * 4 ||
            this.x < this.p.width * -4 ||
            this.y > this.p.height * 4 ||
            this.y < this.p.height * -4
        )
    }

    public isOnScreen( ignoreRadius:boolean = false ){
        const radius = ignoreRadius ? 0 : this.radius
        return (
            this.x + radius > this.p.width * -.5 &&
            this.x - radius < this.p.width * .5 &&
            this.y + radius > this.p.height * -.5 &&
            this.y - radius < this.p.height * .5
        )
    }

    public dist( positionable:Positionable ): number {
        return this.p.dist(
            positionable.x, positionable.y,
            this.x, this.y
        )
    }

}
