import { Vector3, Euler, Quaternion, Matrix4 } from 'three';

export default class Body {

    constructor() {
        this.name = null;
        this.position = new Vector3();
        this.tilt = new Quaternion();        
        this.rotation = new Quaternion();        
        // this.quaternion = new Quaternion();
        // this.movement = new Vector3();;
    }

    interpolate(a,b,t,dt) {
        this.position.lerpVectors(a.position,b.position,t);
        this.tilt.copy(a.tilt).slerp(b.tilt,t);
        this.rotation.copy(a.rotation).slerp(b.rotation,t);

        // this.quaternion.copy(a.quaternion).slerp(b.quaternion,t);
        // if (deltaT==0) {
        //     this.movement.set(0,0,0);
        // }  else {
        //     this.movement.copy(b.position).sub(a.position).multiplyScalar(1/dt);
        // }
        return this;
    }

    copy(c) {
        this.name = c.name;
        this.position.copy(c.position);
        this.tilt.copy(c.tilt);
        this.rotation.copy(c.rotation);

        // this.quaternion.copy(c.quaternion);
        // this.movement.copy(c.movement);
        return this;
    }

    fromJSON(json) {
        this.name = json.name;
        this.position.fromArray(json.position);
        this.tilt.fromArray(json.tilt);
        this.rotation.fromArray(json.rotation);
        return this;
    }


	// applyTransformationTo(object3D, withScale = true) {
	// 	object3D.position.copy(this.getPosition().multiplyScalar(this.universe.data.scale));
	// 	object3D.quaternion.copy(this.getQuaternion());
	// 	if (withScale) {
	// 		const s = this.universe.data.scale;
	// 		object3D.scale.set(s, s, s);
	// 	}
	// },

	// applyLocationOnBodyTransformation(object3D, longitute, latitude, altitude, north) {

	// 	const scale = this.universe.data.scale;
	// 	const radius = this.radius * KM + altitude;
	// 	const spherical = LLSpherical.create(longitute, latitude, radius);
	// 	const bodyCenterToLocation = spherical.toVector3();
	// 	const y1 = new Vector3(0, 1, 0);
	// 	const locationDirection = bodyCenterToLocation.clone().normalize();
	// 	const rotationToFeedsOnGround = new Quaternion().setFromUnitVectors(y1, locationDirection);
	// 	const orientationInHorizonthPlane = new Quaternion().setFromAxisAngle(y1, -north * RAD_TO_DEG);
	// 	const bodyOrientation = this.getQuaternion();
	// 	const bodyPosition = this.getPosition().multiplyScalar(this.universe.data.scale);

	// 	const m2 = new Matrix4();
	// 	const m1 = new Matrix4();

	// 	m2.multiply(m1.identity().setPosition(bodyPosition));
	// 	m2.multiply(m1.makeRotationFromQuaternion(bodyOrientation));
	// 	m2.multiply(m1.identity().setPosition(bodyCenterToLocation));
	// 	m2.multiply(m1.makeRotationFromQuaternion(rotationToFeedsOnGround));
	// 	m2.multiply(m1.makeRotationFromQuaternion(orientationInHorizonthPlane));

	// 	object3D.matrix.identity();
	// 	object3D.applyMatrix(m2);

	// },

}