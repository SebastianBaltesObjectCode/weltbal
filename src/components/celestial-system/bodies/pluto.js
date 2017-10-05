
import { AU } from '../constants';

export const pluto = {
	title: 'Pluto',
	name: 'pluto',
	mass: 1.305e22 + 1.52e21,
	radius: 1153,
	color: '#aaaaaa',
	map: './img/plutomap1k.jpg',
	orbit: {
		base: {
			a: 39.48211675 * AU,
			e: 0.24882730,
			i: 17.14001206,
			l: 238.92903833,
			lp: 224.06891629,
			o: 110.30393684,
		},
		cy: {
			a: -0.00031596 * AU,
			e: 0.00005170,
			i: 0.00004818,
			l: 145.20780515,
			lp: -0.04062942,
			o: -0.01183482,
		},
	},
	"rotation": {
		// In hours
		"period": 153.36,
		// Angle between equatorial plane and orbital plane
		"axialtilt": 119.61,
		// Inclination of orbit plane with respect to ecliptic
		"inclination": 1.767975,
		"ascendingnode": 49.24,
		"meridianangle": 228.66
	},
};
