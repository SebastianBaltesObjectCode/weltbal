
import {Vector3} from 'three';
import {waitUntil} from '../../commons/Utils';

import {KM} from './constants';
import CelestialBody from './CelestialBody';
import {getDateFromJD, getJ2000SecondsFromJD, getJD} from './utils/JD';

import { sun } from './bodies/sun';
import { moon } from './bodies/moon';
import { mercury } from './bodies/mercury';
import { venus } from './bodies/venus';
import { earth } from './bodies/earth';
import { mars } from './bodies/mars';
import { jupiter } from './bodies/jupiter';
import { saturn } from './bodies/saturn';
import { uranus } from './bodies/uranus';
import { neptune } from './bodies/neptune';
import { pluto } from './bodies/pluto';

AFRAME.registerSystem('celestial-system', {

    schema: {
        // bar: {type: 'number'},
        repositionMs: {type: 'number', default: 10000},
        scale: {type: 'number', default: 1},
        scaleTime: {type: 'number', default: 1},
        time: {type: 'string', default: null},
        latitude: {type: 'number', default: 0},
        longitude: {type: 'number', default: 0},
        altitude: {type: 'number', default: 0},
        north: {type: 'number', default: 0},
    },

    init() {
        this.setJD(getJD(new Date()));

        this.startTimeMs = Date.now();

        this.createBodies();
        this.calculateDimensions();
        this.initBodies();
        this.setNextRepositionTime();

        //this.dump();
    },

    getDateFromData() {
        const time = this.data.time;
        if (time==null) {
            return new Date();
        }
        console.log(time,'=>',new Date(time));
        return new Date(time);
    },

    tick(time, timeDelta) {
        const now = Date.now();
        if (now<this.nextRepositionTime) {
            return;
        }
        
        // date richtig setzen!!
        const ms =
        + (now - this.startTimeMs)  * this.data.scaleTime;
        this.setJD(getJD(new Date(ms)));
        //console.log(this.getCurrentDate());

        this.repositionBodies();
        this.setNextRepositionTime();
    },

    dump() {
        console.log('- celestial-system -');
        console.log('size '+this.size);
        this.bodies.forEach(body=>{
            console.log(body.name+' '+body.getPosition()+' '+body.getAbsoluteVelocity());
        });
    },

    setNextRepositionTime() {
        this.nextRepositionTime = Date.now() + this.data.repositionMs;
    },

    createBodies() {
        this.bodies = [
            sun,
            mercury,
            venus,
            earth,
            moon,
            mars,
            jupiter,
            saturn,
            uranus,
            neptune,
            pluto,
        ].map(config => {
            const body = Object.create(CelestialBody);
            Object.assign(body, config);
            return body;
        });

        this.centralBody = this.bodies.reduce((current, candidate) => {
            return current && current.mass > candidate.mass ? current : candidate;
        }, null);

        this.bodiesByName = this.bodies.reduce((byName, body) => {
            byName[body.name] = body;
            return byName;
        }, {});

        this.bodies.sort((a, b) => {
            return ((a.relativeTo || 0) && 1) - ((b.relativeTo || 0) && 1);
        });

        this.centralBody.isCentral = true;
    },

    initBodies() {
        this.bodies.forEach(body => {
            // if (!body.isCentral) {
            //     body.mass = 1;
            // }
            body.init(this);
            body.setPositionFromJD(this.currentJD);
        });
        this.bodies.forEach(body => {
            body.afterInitialized(true);
            body.setQuaternion();
        });
    },

    repositionBodies() {
        this.bodies.forEach(body => {
            body.reset();
            body.setPositionFromJD(this.currentJD);
        });
        //adjust position depending on other bodies' position (for example a satellite is relative to its main body)
        this.bodies.forEach(body => {
            body.afterInitialized(true);
            body.setQuaternion();
        });
    },

    getBody(name) {
        if (name === 'central' || !name) {
            return this.centralBody;
        }
        return this.bodiesByName[name];
    },

    calculateDimensions() {
        const centralBodyName = this.getBody().name;

        //find the largest radius in km among all bodies
        let largestRadius = this.bodies.reduce((memo, body) => {
            return memo < body.radius ? body.radius : memo;
        }, 0);

        //find the largest semi major axis in km among all bodies

        let largestSMA = this.bodies.reduce((memo, body) => {
            return (!body.isCentral && body.orbit && body.orbit.base.a > memo) ? body.orbit.base.a : memo;
        }, 0);
        let smallestSMA = this.bodies.reduce((memo, body) => {
            return (!body.isCentral && body.orbit && (!body.relativeTo || body.relativeTo === centralBodyName) && (!memo || body.orbit.base.a < memo)) ? body.orbit.base.a : memo;
        }, 0);

        smallestSMA *= KM;
        largestSMA *= KM;
        largestRadius *= KM;

        this.size = this.largestSMA = largestSMA;
        this.smallestSMA = smallestSMA;
        this.largestRadius = largestRadius;
    },

    setJD(jd) {
        this.currentJD = jd;
        this.currentDate = getDateFromJD(this.currentJD);
        this.currentJ2000Time = getJ2000SecondsFromJD(this.currentJD);
    },

    getCurrentJ2000Time() {
        return this.currentJ2000Time;
    },

    getCurrentJD() {
        return this.currentJD;
    },

    getCurrentDate() {
        return this.currentDate;
    },

});

export default {
    injectWhenReady(instance) {
        const celestialSystem = ()=>document.querySelector('a-scene').systems['celestial-system'];
        waitUntil(() => {
            instance.celestialSystem = celestialSystem(); 
        }, celestialSystem);
    }
}