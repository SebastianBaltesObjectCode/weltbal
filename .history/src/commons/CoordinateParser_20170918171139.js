export default class CoordinateParser {

    static parse(input) {
        input = input.replace(/\s/g, '').replace(/,/g, '.').toLowerCase();
        const unitFactor = { 
            "h": 360/24, 
            "m": 360/(24*60), 
            "s": 360/(24*60*60),
            "°": 1, 
            "'": 1/60, 
            "''": 1/(60*60) 
        };
        const directionFactor = { 
            "n": 1, 
            "s": -1, 
            "w": 1, 
            "o": -1, 
            "e": -1, 
        };
        const regex = /([+-]?\d+\.?\d*)(h|m|s|°|'|'')([noesw])/g;
        let matches;
        let result = 0;
        while (matches = regex.exec(input)) {
            const [full, decimal, unit, direction] = matches;
            const v = parseFloat(decimal);
            result += v * (unitFactor[unit] || 1) * (directionFactor[direction] || 1);
        }
        return result;
    }

    static format(value,unit) {
        return value.toFixed(5)+unit;
    }

}