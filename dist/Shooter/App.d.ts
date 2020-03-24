import p5 from 'p5';
import { KeyMode, Keys, SceneName, Scenes, Vector2D } from '../interfaces';
import Rate from './Entities/Rate';
import Scene from './Entities/Scene';
import API from './API';
import Zone from './Entities/Zone';
export default class App {
    p: p5;
    api: API;
    private readonly cursorImage;
    private readonly baseCursorFadeOut;
    _sceneName: SceneName;
    readonly scenes: Scenes;
    readonly version: any;
    readonly debug = false;
    private cursorFadeOut;
    keys: Keys;
    rate: Rate;
    lightModeTransition: number;
    keyModes: KeyMode[];
    constructor(p: p5, api: API);
    reset(): void;
    step(): Promise<void>;
    draw(): Promise<void>;
    readonly scene: Scene;
    sceneName: SceneName;
    readonly mouse: Vector2D;
    readonly mouseFromCenter: Vector2D;
    readonly zone: Zone;
    switchLightMode(): void;
    switchKeyMode(): void;
    readonly keyMode: KeyMode;
    keyIsPressed(type: 'move' | 'shoot', direction: 'up' | 'down' | 'left' | 'right'): boolean;
    keyModeIndex: number;
    lightMode: boolean;
    readonly dark: number;
    readonly light: number;
    lightAt(light: number): number;
    mouseMoved(): void;
    keyReleased(key: string): void;
    keyPressed(key: string): void;
    mousePressed(): void;
    moveKeyIsPressed(): boolean;
    shootKeyIsPressed(): boolean;
    private directionalKeyIsPressed;
    areOnContact(positionable1: any, positionable2: any): boolean;
}
