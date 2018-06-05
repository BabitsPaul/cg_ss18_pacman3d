class SceneObject
{
    constructor(track, sg)
    {
        this.track = track;

        this.sg = new TrackSGNode(track);
        // this.sg.name = "track node obj";
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
        this.cameraLocationTrack = null;
        this.cameraOrientationTrack = null;

        // build scenegraph
        this.sg = sg.root();
    }

    addObject(obj)
    {
        this.objs.push(obj);
        this.sg.append(obj.sg);
    }

    start()
    {
        // start all tracks
        this.objs.forEach(s => s.track.start());

        camera.orientationTrack = this.cameraOrientationTrack;
        camera.locationTrack = this.cameraLocationTrack;

        this.cameraOrientationTrack.start();
        this.cameraLocationTrack.start();
    }

    stop()
    {
        this.objs.forEach(s => s.track.abort());
    }

    resume()
    {
        this.objs.forEach(s => s.track.resume());
    }

    shouldStart(camera_pos)
    {
        let delta = camera_pos.map((v, i) => Math.abs(v - this.hitbox[i]));
        let in_range = delta.map((v, i) => v - this.hitbox[3 + i]);

        return in_range.reduce((t, v) => t && v);
    }
}