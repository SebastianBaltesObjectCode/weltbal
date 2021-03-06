AFRAME.registerComponent('world-position-from', {
    schema: { type: 'selector' },
    tick() {
        const object = this.el.object3D;
        const targetPosition = this.data.object3D.getWorldPosition();

        const parentMatrixWorld = object.parent.matrixWorld;
        const parentMatrixInverse = new THREE.Matrix4().getInverse(parentMatrixWorld, true);

        targetPosition.applyMatrix(parentMatrixInverse);

        object.position.copy(targetPosition);
    },
});
