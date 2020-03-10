import Positionable from './Positionable';
import App from './App';
export default abstract class Bonus extends Positionable {
    app: App;
    private radiusVariator;
    abstract applyEffect(): void;
    abstract id: string;
    constructor(app: App);
    draw(): void;
    step(): void;
    private setPosition;
}
