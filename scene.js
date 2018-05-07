class SceneObject
{
    constructor(track, sg)
    {
        this.track = track;
        this.sg = sg;
    }

    startTrack()
    {
        this.track.start();
    }
}

class Scene
{
    /**
     * Hitbox:
     *
     * [center_x, center_y, center_z, dim_x / 2, dim_y / 2, dim_z / 2]
     *
     * @param hitbox
     */
    constructor(hitbox)
    {
        this.objs = [];
        this.hitbox = hitbox;

        // build scenegraph
        this.sg = new SceneGraphNode();
        this.objs.map(v => {
            var t = new TrackObjectGraphNode(v.track);
            t.append(v.sg);
            return t;
        }).forEach(t => this.sg.append(t));
    }

    start()
    {
        // start all tracks
        this.objs.forEach(s => s.startTrack());
    }

    stop()
    {
        this.objs.forEach(s => s.track.stop());
    }

    resume()
    {
        this.objs.forEach(s => s.track.resume());
    }

    should_start(camera_pos)
    {
        var delta = camera_pos.map((v, i, _) => Math.abs(v - this.hitbox[i]));
        var in_range = delta.map((v, i, _) => v - this.hitbox[3 + i]);

        return in_range.reduce((t, v, _) => t && v);
    }
}