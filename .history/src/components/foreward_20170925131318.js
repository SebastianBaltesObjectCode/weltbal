
AFRAME.registerComponent('foreward', {

    schema: { 
        from: { type: "selector" },
        event: { type: "string" },
    },

    init() {
        const data = this.data;
        data.from.addEventListener(data.event, event => this.el.emit(data.event,event.detail,false));
    },

});
