export default class Variator {
    private min;
    private max;
    private speed;
    value: number;
    private sens;
    constructor(min: number, max: number, speed: number);
    step(): number;
}
