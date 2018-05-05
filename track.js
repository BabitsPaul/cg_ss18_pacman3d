class InterPolationPoint
{
    constructor(xyz, t)
    {
        this.xyz = xyz;
        this.t = t;
    }

    compare(a, b)
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
        if(!this.active)
            return false;

        // update accumulated time
        this.accumulatedTime += dt;

        // end of track
        if(this.index >= this.ips.size)
            return false;

        // update index if the time-frame was exceeded
        if(this.ips[this.index + 1].t <= this.accumulatedTime)
            this.index++;

        // terminate if the last point of the track was reached
        if(this.index == this.ips.length - 1)
        {
            // last point in the track => update position and terminate
            this.position = this.ips[this.index].xyz;
            return false;
        }

        // interpolate point
        var frameOffset = this.ips[this.index].t;
        var frameLength = this.ips[this.index + 1].t - frameOffset;
        var prop = (this.accumulatedTime - frameOffset) / frameLength;
        var posA = this.ips[this.index];
        var posB = this.ips[this.index + 1];

        this.position = [
            posA.xyz[0] * (1 - prop) + posB.xyz[0] * prop,
            posA.xyz[0] * (1 - prop) + posB.xyz[1] * prop,
            posA.xyz[2] * (1 - prop) + posB.xyz[2] * prop
        ];

        return true;
    }

    start()
    {
        // mark track as active and start it
        this.active = true;
        clock.registerUpdateable(this);

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