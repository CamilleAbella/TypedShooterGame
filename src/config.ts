import {KeyMode} from './interfaces';

export const LIMITS = 3000
export const VIEWPORT = 1000
export const SECURITY = 1000
export const baseURL = 'https://shooter-api.tk'
export const keyModes:KeyMode[] = [
    {
        name: 'Right handed AZERTY',
        shoot: { up: ['z','Z'], down: ['s','S'], left: ['q','Q'], right: ['d','D'] },
        move: { down: ['ArrowDown'], up: ['ArrowUp'], left: ['ArrowLeft'], right: ['ArrowRight'] },
        numeric: [['&','1'],['é','2'],['"','3'],["'",'4'],['(','5'],['-','6'],['è','7']]
    },
    {
        name: 'Left handed AZERTY',
        shoot: { down: ['ArrowDown'], up: ['ArrowUp'], left: ['ArrowLeft'], right: ['ArrowRight'] },
        move: { up: ['z','Z'], down: ['s','S'], left: ['q','Q'], right: ['d','D'] },
        numeric: [['&','1'],['é','2'],['"','3'],["'",'4'],['(','5'],['-','6'],['è','7']]
    },
    {
        name: 'Right handed QWERTY',
        shoot: { up: ['w','W'], down: ['s','S'], left: ['a','A'], right: ['d','D'] },
        move: { down: ['ArrowDown'], up: ['ArrowUp'], left: ['ArrowLeft'], right: ['ArrowRight'] },
        numeric: [['!','1'],['@','2'],['#','3'],['$','4'],['%','5'],['^','6'],['&','7']]
    },
    {
        name: 'Left handed QWERTY',
        shoot: { down: ['ArrowDown'], up: ['ArrowUp'], left: ['ArrowLeft'], right: ['ArrowRight'] },
        move: { up: ['w','W'], down: ['s','S'], left: ['a','A'], right: ['d','D'] },
        numeric: [['!','1'],['@','2'],['#','3'],['$','4'],['%','5'],['^','6'],['&','7']]
    }
]