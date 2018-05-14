class InterPolationPoint
{
    constructor(xyz, t)
    {
        this.xyz = vec3.fromValues(xyz[0], xyz[1], xyz[2]);
        this.t = t;
    }

    static compare(a, b)
    {
        return a.t - b.t;
    }
}

class Track
{
    constructor(ips)
    {
        if(ips)
            this.ips = ips;
        else
            this.ips = [];

        this.accumulatedTime = 0;
        this.active = false;
        this.index = 0;
        this.position = (this.ips.size > 0 ? this.ips[0].xyz : null);
        this.sorted = false;
        this.vec3Position = (this.position ? vec3.fromValues(this.position[0], this.position[1], this.position[2]) : vec3.create());
    }

    addInterpolationPoint(xyz, pt)
    {
        this.ips.push(new InterPolationPoint(xyz, pt));

        if(!this.position)
            this.position = xyz;

        this.sorted = false;
    }

    update(dt)
    {
        // terminate if the track is inactive
        if(!this.active || this.ips.length === 0)
            return false;

        // update accumulated time
        this.accumulatedTime += dt;

        // update index if the time-frame was exceeded
        if(this.index < this.ips.length - 1 && this.ips[this.index + 1].t <= this.accumulatedTime)
            this.index++;

        // end of track
        if(this.index >= this.ips.length - 1)
        {
            // last point in the track => update position and terminate
            this.vec3Position = this.ips[this.index].xyz;
            this.position = [this.vec3Position[0], this.vec3Position[1], this.vec3Position[1]];

            return false;
        }

        // interpolate point
        let frameOffset = this.ips[this.index].t;
        let frameLength = this.ips[this.index + 1].t - frameOffset;
        let prop = (this.accumulatedTime - frameOffset) / frameLength;
        let posA = this.ips[this.index];
        let posB = this.ips[this.index + 1];

        vec3.lerp(this.vec3Position, posA.xyz, posB.xyz, prop);
        this.position = [this.vec3Position[0], this.vec3Position[1], this.vec3Position[2]];

        return true;
    }

    start()
    {
        // reset track
        this.index = 0;
        this.position = this.ips[0];
        this.accumulatedTime = 0;

        // sort points if necessary
        if(!this.sorted)
        {
            this.sorted = true;
            this.ips.sort(InterPolationPoint.compare);
        }

        // mark track as active and start it
        this.active = true;
        clock.registerUpdateable(this);
    }

    resume()
    {
        this.active = true;
        clock.registerUpdateable(this);
    }

    abort()
    {
        // terminate this track
        this.active = false;
    }
}
