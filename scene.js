class SceneObject
{
    constructor(track, sg)
    {
        this.track = track;

        this.sg = new TrackObjectGraphNode(track);
        this.sg.append(sg);
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
    }

    addObject(obj)
    {
        this.objs.append(obj);
        this.sg.append(obj.sg);
    }

    start()
    {
        // start all tracks
        this.objs.forEach(s => s.track.start());
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