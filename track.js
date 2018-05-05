class InterPolationPoint
{
    constructor(xyz, t)
    {
        this.xyz = xyz;
        this.t = t;
    }
}

class Track
{
    constructor(ips)
    {
        if(ips)
            this.ips = ips;
        else
            ips = [];

        this.accumulatedTime = 0;
        this.active = false;
        this.index = 0;
        this.position = (ips ? ips[0].xyz : null);
    }

    addInterpolationPoint(xyz, pt)
    {
        this.ips.append(new InterPolationPoint(xyz, pt));

        if(!this.position)
            this.position = xyz;
    }

    update(dt)
    {
        if(!this.active)
            return false;

        // update accumulated time
        this.accumulatedTime += dt;

        // end of track
        if(this.index >= this.ips.size)
            return false;

        // update index if the time-frame was exceeded
        if(this.ips[this.index + 1].t >= this.accumulatedTime)
        {
            this.index++;

            if(this.index == this.ips.size - 1)
            {
                // last point in the track => update position and terminate
                this.position = this.ips[this.index].xyz;
                return false;
            }
        }

        // interpolate point
        var frameOffset = this.ips[this.index].t;
        var frameLength = this.ips[this.index + 1].t - frameOffset;
        var prop = (this.accumulatedTime - frameOffset) / frameLength;
        var posA = this.ips[this.index];
        var posB = this.ips[this.index + 1];

        this.position = [
            posA[0] * (1 - prop) + posB[0] * prop,
            posA[1] * (1 - prop) + posB[1] * prop,
            posA[2] * (1 - prop) + posB[2] * prop
        ];
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