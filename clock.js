//////////////////////////////////////////////////////////////////////
// Clock
//

/**
 * Builds a new clockreact-object.
 *
 * @param time time until the specified action will be triggered
 * @param react the action that should be performed once the time is up
 * @param repeat determines whether the counter will cycle.
 * @constructor
 */
function CummulativeClockReact(time, react, repeat){
    this.time = time;       // time until the action should be triggered
    this.bygone = 0;        // time passed, since the react started
    this.react = react;     // executed, if the specified time has run out
    this.repeat = repeat;   // start over or terminate
    this.disabled = false;  // if true, the react will automatically terminate on the next call
}

/**
 * Updates the clockreact-object. If the passed time is
 * beyond @c{this.time}, an action will be triggered.
 * returns true if the object is still active, else false
 *
 * @param dt the time passed since the last call
 * @returns true, if the object is still alive
 */
CummulativeClockReact.prototype.update = function(dt){
    if(this.disabled)
        return false;

    this.bygone += dt;

    if(this.bygone >= time)
    {
        this.react();
        this.bygone = 0;

        return this.repeat;
    }

    return true;
}

/**
 * Terminates the clockreact-object. It will be removed from the list of active
 * react-objects on the next tick()
 */
CumulativeClockReact.prototype.terminate = function(){
    this.disabled = true;
}

/* Time at which the last frame started rendering */
var old_time = 0;

/* Time since last tick. Updated by tick() */
var delta_time = 0;

/* True if the clock is currently not enabled. A disabled
 * clock means that animations will remain static. */
var clock_stopped = true;

/* Holds a list of currently active clock-reacts. */
var clockreact_list = [];

/** should be called before animating a frame.
 * Updates the time-difference between two frames,
 * if the clock is enabled. Otherwise it remains 0 */
function tick()
{
    new_time = new Date().getTime();

    if(old_time == 0)
        old_time = new_time;

    delta_time = new_time - old_time;
    old_time = new_time;

    clockreact_list = clockreact_list.filter(react => react.update(delta_time));
}

/** Returns the time since the last frame was rendered.
 * Updated on each call of tick()
 *
 * @return the time passed since the last tick in ms, or 0 if the clock is disabled.
 */
function get_delta()
{
    return delta_time;
}

/** Starts the clock, if it previously was stopped.
 * In it's initial state the clock is disabled */
function start_clock()
{
    if(!clock_stopped)
        return;

    old_time = new Date().getTime();
    clock_stopped = false;
}

/** Stops the clock. If the clock is stopped, calls to tick() will be ignored,
 * thus effectively stalling any timedependant animations */
function stop_clock()
{
    if(clock_stopped)
        return;

    delta_time = 0;
}

/**
 * Adds the specified clockreact-object to the list of active
 * react-objects.
 *
 * @param time time after which the action should be trigger (in ms)
 * @param react action to trigger
 * @param repeat true if the action should be repeated.
 * @return the CummulativeClockReact associated with this action.
 */
function addClockReaction(time, react, repeat)
{
    var r = new CummulativeClockReact(time, react, repeat)
    clockreact_list.push(r);
    return r;
}