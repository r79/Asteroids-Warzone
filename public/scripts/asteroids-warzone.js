var warpdrive = new WarpdriveJS('game', window.innerWidth-4, window.innerHeight-4, '#555');

function OverwrittenQuery() {
    var self = warpdrive.query;
    self.lastUpdate = Date.now();

    var parentalUpdate = self.update;
    self.update = function () {
        checkKeyPressed();
        for (var warpdriveObjectName in warpdrive.objects) {
            var warpdriveObject = warpdrive.objects[warpdriveObjectName];
            if(warpdriveObject.checkMovement) {
                warpdriveObject.checkMovement(self.lastUpdate);
            }
        }
        parentalUpdate();
        self.lastUpdate = Date.now();
    };
    return self;
}

warpdrive.query = new OverwrittenQuery();

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
        self.isTurning = 0;
        self.turnSpeed = self.turnSpeed || options.turnSpeed || 2;
    };

    function applyThrust(radians, syncMultiplier) {
        self.velocity.x += Math.cos(radians) * self.thrustValue * syncMultiplier;
        self.velocity.y += Math.sin(radians) * self.thrustValue * syncMultiplier;
    }

    function relativeRadians(degrees) {
        return (self.radians / Math.PI * 180 + degrees) * Math.PI / 180;
    }

    self.checkMovement = function (lastUpdate) {
        var syncMultiplier = Number(Date.now() - lastUpdate) / (1000 / 60);
        if(self.isThrusting.forward){
            applyThrust(self.radians, syncMultiplier);
            self.isThrusting.forward = false;
        }
        if(self.isThrusting.backwards) {
            applyThrust(relativeRadians(180), syncMultiplier);
            self.isThrusting.backwards = false;
        }
        if(self.isThrusting.left) {
            applyThrust(relativeRadians(-90), syncMultiplier);
            self.isThrusting.left = false;
        }
        if(self.isThrusting.right) {
            applyThrust(relativeRadians(90), syncMultiplier);
            self.isThrusting.right = false;
        }

        if(self.isTurning) {
            self.changeRotation(self.turnSpeed * syncMultiplier * self.isTurning);
            self.isTurning = 0;
        }

        if(self.velocity.x || self.velocity.y) {

            self.velocity.x *= self.friction;
            self.velocity.y *= self.friction;

            self.moveDistance(-self.velocity.x * syncMultiplier, -self.velocity.y*syncMultiplier);
        }
    };

    self.thrust = function (direction) {
        self.isThrusting[direction] = true;
    };

    self.turn = function(direction) {
        self.isTurning = direction;
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

    self.handleCollision = function(sibling) {
        switch(sibling.type) {
            default:
                self.destroy();
                alert('you died');
                return true;
        }
    };

    return self;
}
warpdrive.registerObject('Spaceship', Spaceship);

function Asteroid() {
    var self = warpdrive.instantiateObject('Rectangle');

    self.handleCollision = function(sibling) {
        return false;
    };

    return self;
}
warpdrive.registerObject('Asteroid', Asteroid);

var spaceship = warpdrive.create({
    type: 'Spaceship',
    offsetX: window.innerWidth / 2,
    offsetY: window.innerHeight / 2,
    height: 50,
    width: 100
});

var bigBadAsteroid = warpdrive.create({
    type: 'Asteroid',
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
        warpdrive.getObjectById(spaceship).thrust('left');
    }

    //d
    if(keys[68]){
        warpdrive.getObjectById(spaceship).thrust('right');
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
        warpdrive.getObjectById(spaceship).turn(1);
    }

    //q
    if(keys[81]) {
        warpdrive.getObjectById(spaceship).turn(-1);
    }
}