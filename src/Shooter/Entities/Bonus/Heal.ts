import Bonus from '../Bonus';
import {Consumable} from '../../../interfaces';
import p5 from 'p5';
import {ellipseColorFadeOut} from '../../../utils';

export default class Heal extends Bonus implements Consumable {

    public quantity = 1
    public id = 'heal'
    public displayName = 'Heal'
    public description = 'Full health recovery'

    public exec(): void {
        this.party.player.life = this.party.player.baseLife
        this.party.setAnimation({
            attach: true,
            className: 'high',
            duration: 100,
            value: this.p.color(0,255,0),
            draw: ellipseColorFadeOut,
            position: this.party.player
        })
    }

    public shape(p:p5, x:number,y:number,w:number,h:number): void {
        this.p.rect(
            x + w * .4,
            y + h * .2,
            w * .2,
            h * .6,
            2
        )
        this.p.rect(
            x + w * .2,
            y + h * .4,
            w * .6,
            h * .2,
            2
        )
    }

    applyEffect(): void {
        this.party.player.addConsumable(this)
    }

}
