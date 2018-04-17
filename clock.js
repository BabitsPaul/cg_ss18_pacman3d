//////////////////////////////////////////////////////////////////////
// Clock
//

/**
 * Builds a new clockreact object that will call a function
 * on every update with the delta_time as parameter.
 *
 * @param callable the function to execute on every update
 * @constructor
 */
function ClockReact(callable){
    this.callable = callable;
    this.disabled = false;
}

/**
 * Called on every update
 *
 * @param dt time since the last update
 */
ClockReact.prototype.update = function(dt)
{
    this.callable(dt);
};

/**
 * Terminates the ClockReact
 */
ClockReact.prototype.terminate = function()
{
    this.disabled = true;
};

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
 * @returns boolean if the object is still alive
 */
CummulativeClockReact.prototype.update = function(dt){
    if(this.disabled)
        return false;

    this.bygone += dt;

    if(this.bygone >= this.time)
    {
        this.react();
        this.bygone = 0;

        return this.repeat;
    }

    return true;
};

/**
 * Terminates the clockreact-object. It will be removed from the list of active
 * react-objects on the next update()
 */
CummulativeClockReact.prototype.terminate = function(){
    this.disabled = true;
};

let clock = {
    /* Time at which the last frame started rendering */
    oldTime: 0,

    /* Time since last update. Updated by update() */
    deltaTime: 0,

    /* True if the clock is currently not enabled. A disabled
    * clock means that animations will remain static. */
    clockStopped: true,


    /* Holds a list of currently active clock-reacts. */
    clockReactList: [],

    /** should be called before animating a frame.
     * Updates the time-difference between two frames,
     * if the clock is enabled. Otherwise it remains 0
     *
     * @param time time at which this current call is done
     */

    update: function(time) {
        // get current time from a date-object, if not provided as parameter
        // beware of potential interference (?)
        if(typeof time === 'undefined')
            time = new Date().getTime();

        if (this.oldTime === 0)
            this.oldTime = time;

        this.deltaTime = time - this.oldTime;
        this.oldTime = time;

        this.clockReactList = this.clockReactList.filter(react => react.update(this.deltaTime));
    },

    /** Starts the clock, if it previously was stopped.
     * In it's initial state the clock is disabled */
    startClock: function()
    {
        if(!this.clockStopped)
            return;

        this.oldTime = 0;            // reset oldTime for a fresh restart of the clock
        this.clockStopped = false;
    },

    /** Stops the clock. If the clock is stopped, calls to update() will be ignored,
     * thus effectively stalling any timedependant animations */
    stopClock: function()
    {
        if(this.clockStopped)
            return;

        this.deltaTime = 0;
    },

    /**
     * Adds the specified clockreact-object to the list of active
     * react-objects.
     *
     * @param time time after which the action should be trigger (in ms)
     * @param react action to trigger
     * @param repeat true if the action should be repeated.
     * @return CummulativeClockReact CummulativeClockReact associated with this action.
     */
    registerCummulativeClockReaction: function(time, react, repeat)
    {
        let r = new CummulativeClockReact(time, react, repeat);
        this.clockReactList.push(r);
        return r;
    },

    /**
     * Adds the specified clockreact-object to the list of active react-objects
     *
     * @param react action to be taken every update
     * @returns {ClockReact} the clockreact-object associated with the task
     */
    registerClockReaction: function(react)
    {
        let r = new ClockReact(react);
        this.clockReactList.push(r);
        return r;
    },

    /**
     * Registers an updateable with the clockreact-list. Any object
     * registered with this method must supply an update-list that returns
     * a boolean-value!!! This is the preferable method for updating objects
     *
     * @param updateable the updateable to register
     */
    registerUpdateable: function(updateable)
    {
        this.clockReactList.push(updateable);
    },

    /**
     * Initializes the clock
     */
    init: function()
    {
        this.startClock();
    }
};


