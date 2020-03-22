import p5 from 'p5'
// @ts-ignore
import cursorImage from './images/cursor.png'
import {AnimationOptions, KeyMode, Keys, SceneName, Scenes, Vector2D} from '../interfaces'
import Rate from './Entities/Rate'
import {fade} from '../utils'
import {keyModes} from '../config';
import Party from './Entities/Scenes/Party';
import Manual from './Entities/Scenes/Manual';
import Scene from './Entities/Scene';
import API from './API';
import Profile from './Entities/Scenes/Profile';
import Scores from './Entities/Scenes/Scores';
import Animation from './Entities/Animation';

export default class App {

    private readonly cursorImage:p5.Image
    private readonly baseCursorFadeOut = 1000

    public _sceneName:SceneName
    private readonly scenes:Scenes = {
        party: new Party(this),
        manual: new Manual(this),
        profile: new Profile(this),
        scores: new Scores(this)
    }

    public readonly version = '0.1.4'
    public readonly debug = false

    private fullscreen:boolean
    private cursorFadeOut:number

    public keys:Keys = {}
    public rate:Rate
    public darkModeTransition:number
    public keyModes:KeyMode[] = keyModes
    public animations:Animation[]

    constructor( public p:p5, public api:API ){

        const storage = localStorage.getItem('shooter')
        if( !storage || JSON.parse(storage).version !== this.version )
            localStorage.setItem('shooter', JSON.stringify({
                keyModeIndex: 0,
                darkMode: true,
                version: this.version
            }))

        this.darkModeTransition = this.darkMode ? 0 : 255
        this.cursorImage = p.loadImage(cursorImage)
        this.p.smooth()
        this.p.angleMode(this.p.DEGREES)
        this.reset()
    }

    public reset(): void {
        this.sceneName = 'manual'
        this.rate = new Rate(25)
        this.animations = []
    }

    public async step(){
        if(this.rate.canTrigger(true)){
            this.animations = this.animations.filter( anim => Date.now() < anim.endTime )
            if(this.darkMode){
                if(this.darkModeTransition > 0)
                    this.darkModeTransition -= 25.5
            }else{
                if(this.darkModeTransition < 255)
                    this.darkModeTransition += 25.5
            }
            this.scene.step()
        }
    }

    public async draw(){
        this.p.background(this.dark)
        this.p.translate(
            this.p.width * .5,
            this.p.height * .5
        )
        this.scene.draw()
        this.p.translate(
            this.p.width * -.5,
            this.p.height * -.5
        )
        if(Date.now() < this.cursorFadeOut){
            this.p.noStroke()
            this.p.tint(
                255,
                this.p.map(
                    this.cursorFadeOut - Date.now(),
                    0,
                    this.baseCursorFadeOut,
                    0,
                    255
                )
            )
            this.p.image(this.cursorImage,this.p.mouseX,this.p.mouseY)
        }
    }

    public get scene(): Scene {
        return this.scenes[this.sceneName]
    }
    public get sceneName(): SceneName {
        return this._sceneName
    }
    public set sceneName( name:SceneName ){
        this._sceneName = name
    }

    public get mouse(): Vector2D {
        return {
            x: this.p.mouseX,
            y: this.p.mouseY
        }
    }

    public setAnimation( options:AnimationOptions ): void {
        const animation = new Animation( this, options )
        this.animations.push(animation)
    }
    public setPopup( text:string ): void {
        this.setAnimation({
            class: 'popup',
            value: this.animations.filter( a => a.class === 'popup' ).length - 1,
            duration: 3000,
            draw: (a:Animation) => {
                const shift = a.value * a.p.height * .10
                const { x, y } = a.position
                a.p.noStroke()
                a.p.fill(a.app.light, fade(a.p,30, {
                    value: a.time,
                    valueMax: 3000,
                    overflow: 7
                }))
                a.p.rect(
                    x + a.p.width * -.5,
                    y + a.p.height * -.25 + shift,
                    a.p.width,
                    a.p.height * .1
                )
                a.p.fill(a.app.light, fade(a.p,255, {
                    value: a.time,
                    valueMax: 3000,
                    overflow: 4
                }))
                a.p.textAlign(a.p.CENTER,a.p.CENTER)
                a.p.text(text, 0, a.p.height * -.2 + shift)
            }
        })
    }

    public switchDarkMode(): void {
        this.darkMode = !this.darkMode
    }

    public switchKeyMode(): void {
        this.keyModeIndex ++
        if(this.keyModeIndex >= this.keyModes.length)
            this.keyModeIndex = 0
        this.keys = {}
        this.setPopup('KeyMode changed : ' + this.keyMode.name)
    }

    public get keyMode(): KeyMode {
        return this.keyModes[this.keyModeIndex]
    }

    public keyIsPressed( type:'move'|'shoot', direction:'up'|'down'|'left'|'right' ): boolean {
        for(const key in this.keys)
            if(this.keys[key])
                if(this.keyMode[type][direction].includes(key))
                    return true
        return false
    }

    public get keyModeIndex(): number { return this.api.load('keyModeIndex') }
    public set keyModeIndex( index:number ){ this.api.save('keyModeIndex',index) }
    public get darkMode(): boolean { return this.api.load('darkMode') }
    public set darkMode( isActivate:boolean ){ this.api.save('darkMode',isActivate) }
    public get dark(): number { return this.darkModeTransition  }
    public get light(): number { return 255 - this.darkModeTransition }

    public mouseMoved(): void {
        this.cursorFadeOut = Date.now() + this.baseCursorFadeOut
    }

    public keyReleased(key:string): void { this.keys[key] = false }
    public keyPressed(key:string): void { this.keys[key] = true
        if(this.sceneName !== 'profile'){
            if(key === 'm') this.switchDarkMode()
            else if(key === 'k') this.switchKeyMode()
        } this.scene.keyPressed(key)
    }

    mousePressed(){
        this.scene.mousePressed()
    }

    public moveKeyIsPressed(): boolean { return this.directionalKeyIsPressed('move') }
    public shootKeyIsPressed(): boolean { return this.directionalKeyIsPressed('shoot') }
    private directionalKeyIsPressed( type:'shoot'|'move' ): boolean {
        for(const key in this.keys)
            if(this.keys[key])
                if(
                    this.keyMode[type].up.includes(key) ||
                    this.keyMode[type].down.includes(key) ||
                    this.keyMode[type].left.includes(key) ||
                    this.keyMode[type].right.includes(key)
                ) return true
        return false
    }

    public areOnContact( positionable1:any, positionable2:any ): boolean {
        return (
            this.p.dist(
                positionable1.x, positionable1.y,
                positionable2.x, positionable2.y
            ) < (
                (positionable1.currentRadius || positionable1.radius) +
                (positionable2.currentRadius || positionable2.radius)
            ) / 2
        )
    }

}
