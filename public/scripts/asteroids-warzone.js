var warpdrive = new WarpdriveJS('game', window.innerWidth-4, window.innerHeight-4, '#555');
var socket = io.connect();

socket.on('drawObjects', function(data){
    warpdrive.query.setCurrentChanges(JSON.parse(data));
});

function OverwrittenQuery() {
    var self = warpdrive.query;

    var parentalUpdate = self.update;
    self.update = function () {
        checkKeyPressed();
        parentalUpdate();
    };
    return self;
}

warpdrive.query = new OverwrittenQuery();

var keys = [];
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    //I need my damn ctrl r
    if(e.keyCode < 90 && e.keyCode !== 82) {
        e.preventDefault();
    }
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
    e.preventDefault();
});

//TODO: send stuff to server
function checkKeyPressed() {
    //a
    if(keys[65]){
        //warpdrive.getObjectById(playerShip).thrust('left');
    }

    //d
    if(keys[68]){
        //warpdrive.getObjectById(playerShip).thrust('right');
    }

    //s
    if(keys[83]) {
        //warpdrive.getObjectById(playerShip).thrust('backwards')
    }

    //w
    if(keys[87]) {
        //warpdrive.getObjectById(playerShip).thrust('forward');
    }

    //e
    if(keys[69]) {
        //warpdrive.getObjectById(playerShip).turn(1);
    }

    //q
    if(keys[81]) {
        //warpdrive.getObjectById(playerShip).turn(-1);
    }

    //space
    if(keys[32]) {
        warpdrive.getObjectById(playerShip).shoot();
    }
}