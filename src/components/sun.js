// https://github.com/CoryG89/MoonDemo
// The MIT License (MIT)
// Copyright (c) 2013 Cory Gross

import vertexShader from '../shader/sun.vsh';
import fragmentShader from '../shader/sun.fsh';

import * as THREE from 'three';

AFRAME.registerComponent('sun', {

    schema: {
        geoSize: { type: 'number' },
    },

    init()  {
        const {geoSize} = this.data;

		const aspect = 1; //camera.aspect;
		
		this.uniforms = {
			aspectRatio: { type: 'f', value: aspect },
			sunPosition: { type: 'v3', value: new THREE.Vector3() },
			sunScreenPos: { type: 'v3', value: new THREE.Vector3() },
			sunSize: { type: 'f', value: 0.0 },
			randAngle: { type: 'f', value: 0.0 },
			camAngle: { type: 'f', value: 0.0 },
		};

		const mat = new THREE.ShaderMaterial({
			fragmentShader,
			vertexShader,
			uniforms: this.uniforms,
			transparent: true,
		});

		const geo = new THREE.PlaneGeometry(geoSize, geoSize, 10, 10);
		this.mesh = new THREE.Mesh(geo, mat);

        this.el.object3D.add(this.mesh);
	},
	
	tick() {
		if (_.get(this,'el.sceneEl.camera')==null) {
			return;
		}
		const camera = this.el.sceneEl.camera;
		const sunPos = this.el.object3D.getWorldPosition();

		const camToSun = camera.getWorldPosition().clone().sub(sunPos);
		
		this.mesh.quaternion.copy(camera.getWorldQuaternion());

		this.mesh.position.copy(camToSun.clone().multiplyScalar(0.1));/**/
		// const scaleRatio = (camToSun.length() / this.stageSize) * 0.8;

		const sunScreenPos = sunPos.clone().project(camera);
		// sceneW = $(window).width();
		// sceneH = $(window).height();
		// this.sky.mesh.scale.set(scaleRatio, scaleRatio, scaleRatio);/**/
		this.uniforms.sunPosition.value.copy(camToSun.multiplyScalar(-1));
		
		const visibleW = Math.tan(THREE.Math.degToRad( camera.fov / 2)) * camToSun.length() * 2;
		const sunScaledSize = this.sunSize * this.scale;
		const sunScreenRatio = sunScaledSize / visibleW;
		// console.log(visibleW, CameraManager.getCamera().fov, camToSun.length(), sunScaledSize);
		this.uniforms.sunSize.value = sunScreenRatio;
		this.uniforms.randAngle.value = (this.uniforms.randAngle.value + 0.001);
		this.uniforms.camAngle.value = camToSun.angleTo(new THREE.Vector3(1, 1, 0));
		this.uniforms.sunScreenPos.value = sunScreenPos;
		
	}

});


