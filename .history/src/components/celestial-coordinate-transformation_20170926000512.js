import LLSpherical from "../commons/LLSpherical";
import {Vector3,Matrix4,Quaternion,Math,Euler} from 'three';
import {injectCelestialSystem} from './celestial-system';

AFRAME.registerComponent('celestial-coordinate-transformation', {
    schema: {
        from: {type: 'string'},
        to: {type: 'string'},
    },

    init() {
        injectCelestialSystem(this);
        
        const data = this.data;
        const object = this.el.object3D;
        const trans = data.from + '-' + data.to;

        if (trans=='ecliptic-equatorial') {
            this.tick = ()=>{
                if (this.celestialSystem) {
                    object.quaternion.copy(this.celestialSystem.rotationEclipticToEquatorial);
                }
            };
        } else if (trans=='horizontal-equatorial') {
            this.tick = ()=>{
                if (this.celestialSystem) {
                    object.quaternion.copy(this.celestialSystem.rotationHorizonthalToEquatorial);
                }
            };
        } else if (trans=='equatorial-galactic') {
            this.tick = ()=>{
                if (this.celestialSystem) {
                    object.quaternion.copy(this.celestialSystem.rotationEquatorialToGalactic);
                }
            };
        } else {
            throw new Error('unknown celestial transformation '+JSON.stringify(data));
        }
    },

});
