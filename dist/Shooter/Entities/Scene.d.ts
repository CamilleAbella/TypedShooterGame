import App from '../App';
import p5 from 'p5';
import Rate from './Rate';
import Animation from './Animation';
import { AnimationOptions } from '../../interfaces';
export default abstract class Scene {
    app: App;
    abstract rate: Rate;
    abstract time: number;
    abstract animations: Animation[];
    abstract reset(): any;
    abstract draw(): any;
    abstract step(): any;
    abstract keyPressed(key: string): any;
    abstract mousePressed(): any;
    p: p5;
    protected constructor(app: App);
    protected drawAnimations(): void;
    setAnimation(options: AnimationOptions): void;
    setPopup(text: string): void;
}
