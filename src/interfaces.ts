
import Bonus from './Shooter/Bonus';
import p5 from 'p5';
import App from "./Shooter/App";
import Positionable from "./Shooter/Positionable";
import createSpyObj = jasmine.createSpyObj;

interface BonusExtender extends Bonus {
    shape: ShapeFunction
}

export interface Consumable extends BonusExtender {
    quantity: number
    exec: () => void
}

export interface Passive extends BonusExtender {
    level: number
}

export interface TemporaryEffects {
    [key:string]: TemporaryEffect
}

export interface TemporaryEffect {
    shape: ShapeFunction
    triggerTime: number
    timeout: number
}

export interface GameAnimation {
    draw: ( p:p5, time:number, values:any ) => void
    duration: number
    value: any
}

export interface PuttedAnimation {
    id?: string
    animation: GameAnimation
    startTime: number
    endTime: number
}

export type Vector2D = Positionable | {x:number,y:number}

export type ShapeFunction = (
    p:p5,
    x:number, y:number,
    w:number, h:number
) => void

export interface Keys {
    [key:string]: boolean
}

export interface KeyMode {
    name: string
    shoot: DirectionalKeys
    move: DirectionalKeys
    numeric: string[][]
}

export interface DirectionalKeys {
    up: string[]
    down: string[]
    left: string[]
    right: string[]
}

export const LIMITS = 3000
export const VIEWPORT = 1000
export const SECURITY = 1000
