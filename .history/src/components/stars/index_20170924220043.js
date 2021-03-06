import * as THREE from 'three';
import starsFsh from '../../shader/stars.fsh';
import starsVsh from '../../shader/stars.vsh';

//keys of the loaded array
const NAME = 0;
const X = 1;
const Y = 2;
const Z = 3;
const MAG = 4;
const SPECT = 5;

const MIN_MAG = -1.44;

const spectralColors = [
	0xfbf8ff,
	0xc8d5ff,
	0xd8e2ff,
	0xe6ecfc,
	0xfbf8ff,
	0xfff4e8,
	0xffeeda,
	0xfeead3,
	0xfccecb,
	0xebd3da,
	0xe7dbf3,
];

const namedStars = {};

const pxRatio = (window.devicePixelRatio || 1);

function lightenDarkenColor(hex, amount) {
	let col = [hex >> 16, (hex >> 8) & 0x00FF, hex & 0x0000FF];
	col = col.map(part => {
		const partTrans = part * amount;
		return partTrans < 0 ? 0 : (partTrans > 255 ? 255 : partTrans);
	});
	return (col[0] | (col[1] << 8) | (col[2] << 16));
}

AFRAME.registerComponent('stars', {
    schema: {
        radius: { type:'number', default: 10000000 },
        src: { type: 'asset' },
        texture: { type: 'asset' },
    },

    init()  {
        const data = this.data;
        const object = this.el.object3D;
        
        const geometry = new THREE.BufferGeometry();
        const stars = data.src;
        const count = stars.length;
    
        let star;
        let starVect;
        let mag;
        let name;
        let spectralType;
        let starColor;
        let color;
    
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0, i3 = 0; i < count; i++, i3 += 3) {
            star = stars[i];
    
            starVect = new THREE.Vector3(star[X], star[Y], star[Z]);
            if (starVect.x === 0) continue;//dont add the sun
            starVect.normalize().multiplyScalar(data.radius);
    
            mag = (star[MAG] - MIN_MAG) + 1;
            name = star[NAME];
            spectralType = String(star[SPECT]).toUpperCase();
            starColor = spectralColors[spectralType] || spectralColors[10];
            if (name) namedStars[name] = starVect;
    
            if (mag < 7) {
                //starVect.size = 2 + Math.pow((2 / starVect.mag), 1.2);
                starColor = lightenDarkenColor(starColor, ((1 / mag) ** 0.3));
            } else {
                //starVect.size = 2;
                // starColor = lightenDarkenColor(starColor, ((1 / mag) ** 0.8));
                starColor = lightenDarkenColor(starColor, ((1 / mag) ** 0.9));
            }			
            /**/
    
            positions[i3 + 0] = starVect.x;
            positions[i3 + 1] = starVect.y;
            positions[i3 + 2] = starVect.z;
    
            color = new THREE.Color(starColor);
            colors[i3 + 0] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
    
            sizes[i] = pxRatio * (1.5 + Math.floor(10 * (1 / mag)) / 10);
    
        }
    
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
        // console.warn('voir exemple: view-source:https://threejs.org/examples/webgl_buffergeometry_custom_attributes_particles.html');
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { type: 'c', value: new THREE.Color(0xffffff) },
                starTexture: { type: 't', value: data.texture },
            },
            vertexShader: starsVsh,
            fragmentShader: starsFsh,
            blending: THREE.AdditiveBlending,
            transparent: false,
        });
    
        const particleSystem = new THREE.Points(geometry, shaderMaterial);
        
        object.add(particleSystem);
    },
    
});
