// https://github.com/CoryG89/MoonDemo
// The MIT License (MIT)
// Copyright (c) 2013 Cory Gross

import vertexShader from '../shader/moon.vsh';
import fragmentShader from '../shader/moon.fsh';

import * as THREE from 'three';

AFRAME.registerComponent('moon', {

    schema: {
        sunLight: { type: 'selector' },
        segments:  { type: 'number', default: 50 },
        radius:  { type: 'number', default: 1 },
        textureMap:  { type: 'asset' },
        normalMap:  { type: 'asset' },
    },

    init()  {
        const {radius,segments,sunLight,textureMap,normalMap} = this.data;

        const geo = new THREE.SphereGeometry(radius, segments, segments);

        const textureLoader = new THREE.TextureLoader();
        
        const textureTex = textureLoader.load( textureMap );
        const normalTex = textureLoader.load( normalMap );
    
        let mat = new THREE.ShaderMaterial({
            uniforms: {
                lightPosition: {
                    type: 'v3',
                    value: sunLight.object3D.position
                },
                textureMap: {
                    type: 't',
                    value: textureTex
                },
                normalMap: {
                    type: 't',
                    value: normalTex
                },
                uvScale: {
                    type: 'v2',
                    value: new THREE.Vector2(1.0, 1.0)
                }
            },
            vertexShader,
            fragmentShader,
        });
    
        const mesh = new THREE.Mesh(geo, mat);
        mesh.geometry.computeTangents();

        this.el.object3D.add(mesh);
    },

});
