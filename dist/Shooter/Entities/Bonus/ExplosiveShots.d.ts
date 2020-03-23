import { Passive } from '../../../interfaces';
import Bonus from '../Bonus';
import p5 from 'p5';
export default class PiercingShots extends Bonus implements Passive {
    level: number;
    levelMax: number;
    id: string;
    displayName: string;
    description: string;
    shape(p: p5, x: number, y: number, w: number, h: number): void;
    applyEffect(): void;
    readonly value: number;
}
