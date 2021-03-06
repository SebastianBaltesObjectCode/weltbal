import "./style/index.scss";
import "aframe";
import "./commons/three.toString";

import "aframe-sun-sky";
import "aframe-environment-component";
import "aframe-log-component";
import "aframe-text-geometry-component";
import "aframe-look-at-component";
import "aframe-stereo-component";

import "./components/aframe-animation-component-fork";
import './components/celestial-system';
import "./components/spherical-coords";
import "./components/spherical-grid";
import "./components/copy-position";
import "./components/healpix-sphere/index";
import "./components/renderer-parameter-patch";
import "./components/celestial-coordinate-transformation";
import "./components/device-location-and-time";
import './components/spherical-rotation';
import './components/group-opacity';
import './components/celestial-body';
import './components/celestial-particles';
import './components/celestial-location';
import './components/celestial-home';
import './components/celestial-location-test';
import './components/axis-helper';
import './components/world-quaternion-from';
import './components/world-position-from';
import './components/move-me-so-that';
import './components/polar-grid-helper';
import './components/celestial-test';
import './components/logg';
import './components/stars';
import './components/foreward';
import './components/remove';
import './components/change-attribute';
import './components/sun';
import './materials/phong';

import _ from 'lodash';
import CoordinateParser from './commons/CoordinateParser.js';

let gridId = 0;
const coordinateGrid = ({id='grid'+(gridId++),longitudeUnit='°', longitudeClockwise=false, color='#aaa',opacity=0.1,radius=100,fontWidth=50}) => {
    const maxLongitude = longitudeUnit=='°' ? 360 : 24;
    const stepLongitude = longitudeUnit=='°' ? 10 : 360/24;
    // const textSettings = `align: center; width: ${fontWidth}; color: ${color}; transparent: true; opacity: ${Math.min(1,opacity+0.5)};`;
//  curveSegments: 6;
    const fontScale = radius*1/40;
    const textSettings = `size:${fontScale}; height: ${fontScale/10};`;
    const fontUnitChar = unit => unit == '°' ? '.' : 'M';
    const text = (text,longitude,latitude) =>
        `<a-entity spherical-coords="longitude: ${longitude}; latitude: ${latitude}; radius: ${radius}; longitudeClockwise: ${longitudeClockwise};">
           <a-entity text-geometry="value: ${text}; ${textSettings}" 
                     material="shader: flat; color: ${color}; opacity: ${opacity*2}; transparent: true;" mixin="FontGeom" 
                     rotation="0 0 0" position="${fontScale}  ${-fontScale/2} 0">
           </a-entity>
        </a-entity>
        `;
        // <a-entity axis-helper="size:${radius*1.5}"></a-entity>
    return `
        <a-entity id="${id}">
            <a-entity spherical-grid="radius: ${radius}; direction: longitude; from: 0; to: 359.999; step: ${stepLongitude}; color: ${color}; opacity: ${opacity}"></a-entity>
            ${_.range(0,359.999,stepLongitude).map(v=>text((v*maxLongitude/360)+fontUnitChar(longitudeUnit),v,0)).join('')}
            <a-entity spherical-grid="radius: ${radius}; direction: latitude; from: -80; to: 80; step: 10; color: ${color}; opacity: ${opacity}"></a-entity>
            ${_.without(_.range(-80,80.001,10),0).map(v=>text(v+fontUnitChar('°'),0,v)).join('')}
        </a-entity>
    `;
};

const html = `

    <a-scene 
        antialias="true" 
        celestial-system="scale-time: 1; reposition-ms: 1000; 
                          time: 2017-09-28T23:00:00.000-00:00;
                          longitude: 7.8134; latitude: 51.6802; 
                          altitude: 0; body: earth;"
        >

        <a-assets>
            <a-asset-item id="Hyperspace_Font" src="server/font/hyperspace/Hyperspace_Bold.json"></a-asset-item>
            <a-mixin id="FontGeom" text-geometry="font: #Hyperspace_Font; curveSegments: 0;"></a-mixin>
            <a-mixin id="Sphere" segments-width="10" segments-height="10"></a-mixin>
            <a-mixin id="Font" text="font: server/font/KelsonSans.fnt"></a-mixin>
            <a-mixin id="CardinalCoordsSchema" text="align: center; width: 1000; color: red; transparent: true; opacity: 1;" spherical-coords="latitude: 5; radius: 1000;"></a-mixin>
            <a-mixin id="overlay-fade-in" animation="property: opacity; dir: normal; dur: 500; easing: easeOutQuad; from: 0; to: .75; startEvents: clickDown;"></a-mixin>
        </a-assets>

        <a-entity id="ecliptic-reference-frame" >
    
            <a-entity id="horizontal-reference-frame" celestial-location>

                <a-camera near="0.1" far="10000000000000000000" renderer-parameter-patch="logarithmicDepthBuffer: true">
                </a-camera>
                
                <a-entity laser-controls line="color: yellow; opacity: 0.75"></a-entity>

                <a-entity id="CardinalDirections">
                    <a-text value="N" spherical-coords="longitude: 0;" mixin="CardinalCoordsSchema Font"></a-text>
                    <a-text value="W" spherical-coords="longitude: 90;" mixin="CardinalCoordsSchema Font"></a-text>
                    <a-text value="S" spherical-coords="longitude: 180;" mixin="CardinalCoordsSchema Font"></a-text>
                    <a-text value="E" spherical-coords="longitude: 270;" mixin="CardinalCoordsSchema Font"></a-text>
                </a-entity>
            
                <a-entity id="hudMenu">
                </a-entity>
                
            </a-entity>

        
            <a-entity id="equatorial-reference-frame" celestial-location="quaternion:false;" celestial-coordinate-transformation="from:ecliptic;to:equatorial">
            
            <!--
                <a-sphere mixin="Sphere" color="darkblue" material="side:double" radius="10000000000000"></a-sphere>
                
                ${coordinateGrid({longitudeUnit:'°',color:'#fff',longitudeClockwise:false, radius: 1000000000})}
            -->
                
                <a-entity stars="size: -1; mag: 6; src: url(server/data/milkyway.json); texture: url(server/jsorrery/img/star.png);"></a-entity>

                <a-entity id="galactic-reference-frame" celestial-coordinate-transformation="from:equatorial;to:galactic">
                </a-entity>
   
                <a-entity id="universeSphere" healpix-sphere="radius: 1000000000000000000; detail: 5" celestial-coordinate-transformation="from:equatorial;to:galactic"></a-entity>

            </a-entity>
            
            <a-entity id="sun" celestial-body="name:sun">
<!--
                <a-sphere mixin="Sphere" color="yellow" material="side:double" radius="1"></a-sphere>
-->

<a-plane stereo="eye:left" material="shader:flat;src:server/img/helioviewer/2007_04_29_09_54_21_EUVI-A_171_1024.png;side:double;transparent:true;" width="1.86" height="1.86" stereo="eye:both" look-at="[camera]"></a-plane>
<a-plane stereo="eye:right" material="shader:flat;src:server/img/helioviewer/2007_04_29_09_54_21_EUVI-B_171_1024.png;side:double;transparent:true;" width="1.86" height="1.86" stereo="eye:both" look-at="[camera]"></a-plane>

<!--
<a-plane stereo="eye:right"></a-plane>


<a-entity sun="geoSize:1;"></a-entity>
--->

                <a-entity light="type: ambient; color: #aaa; intensity: 0" 
                            foreward="event:celestial-system-ready;from:a-scene;"
                            animation="startEvents: celestial-system-ready; property: light.intensity; dur: 500; easing: easeOutQuad; from: 0; to: 0.2;" >
                </a-entity>
                
                <a-entity id="sunLight" light="type: point; color: #FFF; intensity: 0" position="0 0 0"
                            foreward="event:celestial-system-ready;from:a-scene;"
                            animation="startEvents: celestial-system-ready; property: light.intensity; dur: 500; easing: easeOutQuad; from: 0; to: 1;" >                          
                </a-entity>

            </a-entity>
                       
            <a-entity id="earth" celestial-body="name:earth; perspective: false; ">
                ${coordinateGrid({longitudeUnit:'°',color:'#fff',longitudeClockwise:true, radius: 1})}
            </a-entity>
    
            <a-entity id="moon" celestial-body="name:moon">

                <a-sphere radius="1" 
                          material="shader: phong; shininess: 5; src: url(server/img/moon/moon1024x512.jpg); normalMap: url(server/img/moon/normal1024x512.jpg);">
                </a-sphere>

                ${coordinateGrid({longitudeUnit:'°',color:'#fff',longitudeClockwise:false, radius: 2})}
            
            </a-entity>
    
        </a-entity>

    </a-scene>
        

    
`;


const setHips = (hips) => {
    const universeSphere = $('#universeSphere')[0];
    if (!universeSphere) {
        return;
    }
    universeSphere.setAttribute('healpix-sphere','urlpattern',hips.folder+'/1024/#.jpg');
    universeSphere.setAttribute('celestial-coordinate-transformation','to',hips.properties.hips_frame);
}

const index2Table = (index) => {
    const table = $(`<a-entity>`);
    index.reverse().forEach((hips,i)=>{
        const iside = index.length/2;
        const tr = $(`
                <a-plane propagate="events:clickDown" class="clickable" width="2" height="2" opacity="0.0" 
                         spherical-coords="longitude: ${25*(Math.floor(i%iside)-iside/2)}; latitude: ${28*Math.floor(i/iside)}; radius: 6;" 
                         animation="property: scale; dir: normal; dur: 750; easing: easeOutElastic; from: 1 1 1; to: 1.2 1.2 1.2; startEvents: click;">
                    
                    <a-entity transparent="true" group-opacity="0.0" animation="property: group-opacity; dir: normal; dur: 1500; easing: easeOutQuad; from: 0.0; to: 1; delay: ${i*200+500};">
                  
                        <a-image src="${hips.folder}/512/4.jpg" width="2" height="2"></a-image>
                    
                        <a-text geometry="primitive: plane; height: 0.5; width: 2;" 
                                material="color: #202020; opacity: 0.2" 
                                width="4" position="0 -1.25 0" align="center" line-height="48" 
                                value="${hips.properties.obs_collection}\n${hips.properties.obs_regime}"></a-text>

                    </a-entity> 
    
                </a-plane>
       `);
        tr.click(()=>{
            AFRAME.log('clicked on '+hips.folder);
            setHips(hips);
        });
        table.append(tr);
    });
    return table;
}



$(()=> {
    $('body').html(html);

    $.getJSON('server/img/healpix/index.json',index=>{
        setHips(index[6]);
        const hudMenu = $('#hudMenu');
        // _.delay(()=>hudMenu.append(index2Table(index)),5000);
    });
});