//handles Drawing requests and Redraw
function Query(warpdriveInstance) {
    var self = this;

    // the changequery is used as a two dimensional array.
    // the lower dimension holds objects that need to be redrawed,
    // the upper one provides a deferring draw functionality.
    var changeQuery = [];

    var ticksPerSecond = 0;


    var gameCycle;
    //checks if there are changes in the current tick and draws them, then sets the next tick
    function update(onChanges) {
        var currentChanges = changeQuery.shift();
        if(onChanges) {
            onChanges(warpdriveInstance.objects);
        }
        ticksPerSecond++;
        gameCycle = setTimeout(self.update, 0);
    }
    self.update = update;

    function startCycle() {
        gameCycle = setTimeout(self.update, 0);
    }
    self.startCycle = startCycle;

    function stopCycle() {
        clearTimeout(gameCycle);
    }
    self.stopCycle = stopCycle;

    function logTicksPerSec() {
        console.log(ticksPerSecond);
        ticksPerSecond = 0;
    }
    setInterval(logTicksPerSec, 1000);

    //requests a redraw for an object or an array of objects. By adding a tick variable, you can provide when this
    // shall be processed. This currently only gets used by images, which need to be preloaded before they can be drawn.
    // Deferred drawing also provides the fundamental part for animations.
    // the tick variable says in how many ticks this shall be processed
    function queryChange(changeObject, tick) {
        tick = tick || 0;
        if(!Array.isArray(changeObject)) {
            changeObject = [changeObject];
        }
        if(changeQuery[tick]) {
            changeObject.forEach(function(object) {
                if(changeQuery.indexOf(object) < 0) {
                    changeQuery[tick].push(object);
                }
            });
        } else {
            changeQuery[tick] = changeObject;
        }
    }
    self.queryChange = queryChange;

    return self;
}

module.exports = Query;