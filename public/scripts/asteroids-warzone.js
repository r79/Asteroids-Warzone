var warpdrive = new WarpdriveJS('game', window.innerWidth-4, window.innerHeight-4, '#555');

var parentalQueryUpdate = warpdrive.query.update;
warpdrive.query.update = function() {
    checkKeyPressed();
    for (var warpdriveObjectName in warpdrive.objects) {
        var warpdriveObject = warpdrive.objects[warpdriveObjectName];
        if(warpdriveObject.checkMovement) {
            warpdriveObject.checkMovement();
        }
    }
    parentalQueryUpdate();
};

function MoveableVectorObject() {
    var self = warpdrive.instantiateObject('VectorObject');

    var parentalHandleStyle = self.handleStyle;
    self.handleStyle = function (options, parent) {
        parentalHandleStyle(options, parent);

        self.velocity = self.velocity || options.velocity || {x: 0, y: 0};
        self.thrustValue = self.thrustValue || options.thrustValue || 0.2;
        self.friction = self.friction || options.friction || 0.98;
        self.isThrusting = {
            forward: false,
            backwards: false,
            left: false,
            right: false
        };
        self.turnSpeed = self.turnSpeed || options.turnSpeed || 2;
    };

    function applyThrust(radians) {
        self.velocity.x += Math.cos(radians) * self.thrustValue;
        self.velocity.y += Math.sin(radians) * self.thrustValue;
    }

    function relativeRadians(degrees) {
        return (self.radians / Math.PI * 180 + degrees) * Math.PI / 180;
    }

    self.checkMovement = function () {
        if(self.isThrusting.forward){
            applyThrust(self.radians);
            self.isThrusting.forward = false;
        }
        if(self.isThrusting.backwards) {
            applyThrust(relativeRadians(180));
            self.isThrusting.backwards = false;
        }
        if(self.isThrusting.left) {
            applyThrust(relativeRadians(-90));
            self.isThrusting.left = false;
        }
        if(self.isThrusting.right) {
            applyThrust(relativeRadians(90));
            self.isThrusting.right = false;
        }

        if(self.velocity.x || self.velocity.y) {

            self.velocity.x *= self.friction;
            self.velocity.y *= self.friction;

            self.moveDistance(-self.velocity.x, -self.velocity.y);
        }
    };

    self.thrust = function (direction) {
        self.isThrusting[direction] = true;
    };

    self.turn = function(direction) {
        self.changeRotation(self.turnSpeed * direction);
    };

    return self;
}
warpdrive.registerObject('MoveableVectorObject', MoveableVectorObject);

function Spaceship() {
    var self = warpdrive.instantiateObject('MoveableVectorObject');
    self.points = [
        {
            x: 0,
            y: 50
        },
        {
            x: 100,
            y: 0
        },
        {
            x: 100,
            y: 100
        }
    ];

    return self;
}
warpdrive.registerObject('Spaceship', Spaceship);

var spaceship = warpdrive.create({
    type: 'Spaceship',
    offsetX: window.innerWidth / 2,
    offsetY: window.innerHeight / 2,
    height: 50,
    width: 100
});

var bigBadAsteroid = warpdrive.create({
    type: 'Rectangle',
    offsetX: 100,
    offsetY: 100,
    height: 200,
    width: 200
});

var keys = [];
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
    e.preventDefault();
});

function checkKeyPressed() {
    //a
    if(keys[65]){
        warpdrive.getObjectById(spaceship).turn(-1);
    }

    //d
    if(keys[68]){
        warpdrive.getObjectById(spaceship).turn(1);
    }

    //s
    if(keys[83]) {
        warpdrive.getObjectById(spaceship).thrust('backwards')
    }

    //w
    if(keys[87]) {
        warpdrive.getObjectById(spaceship).thrust('forward');
    }

    //e
    if(keys[69]) {
        warpdrive.getObjectById(spaceship).thrust('right');
    }

    //q
    if(keys[81]) {
        warpdrive.getObjectById(spaceship).thrust('left');
    }
}