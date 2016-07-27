var WarpdriveJS = function (canvasId, width, height) {
    var self = this;

    //this object holds the highest settings. If you want to delete it, make sure to set the selectorstuff somewhere else and change the reference.
    self.surface = {
        width: width || window.innerWidth,
        height: height || window.innerHeight,
        offsetX: 0,
        offsetY: 0
    };

    //holds all WarpdriveObjects
    self.objects = {};

    self.query = new Query();

    self.canvas = document.getElementById(canvasId);
    self.ctx = self.canvas.getContext('2d');
};

//handles Drawing requests and Redraw
function Query() {
    var self = this;

    self.drawObjects = [];

    // the changequery is used as a two dimensional array.
    // the lower dimension holds objects that need to be redrawed,
    // the upper one provides a deferring draw functionality.
    var changeQuery = [];

    var ticksPerSecond = 0;

    //checks if there are changes in the current tick and draws them, then sets the next tick
    function update() {

        if(self.drawObjects.length) {

        }
        requestAnimationFrame(self.update);
    }
    self.update = update;

    function setCurrentChanges(drawObjects) {
        self.drawObjects = drawObjects;
    }
    self.setCurrentChanges = setCurrentChanges;

    requestAnimationFrame(self.update);

    return self;
}

//exposing the whole Lib to the global namespace for access.
//TODO: improve this
window.document.WarpdriveJS = WarpdriveJS;