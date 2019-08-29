/**
 * Creates a Flock. Contains an empty array of boids that you have to fill.
 * @class
 * @param {number} [desiredseparation=25.0] desired separation between the boids in the flock
 * @param {number} [neighbourdist=50.0] neighbourhood radius for each boid
 * @param {number} [separationWeight=1.5] weight of separation behaviour
 * @param {number} [alignmentWeight=1.0] weight of alignment behaviour
 * @param {number} [cohesionWeight=1.0] weight of cohesion behaviour
 */
function Flock (desiredseparation = 25.0, neighbourdist = 50.0, separationWeight = 1.5, alignmentWeight = 1.0, cohesionWeight = 1.0)
{
    this.boids = [];
    
    this.desiredseparation = desiredseparation;
    this.neighbourdist = neighbourdist;
    
    this.separationWeight = separationWeight;
    this.alignmentWeight = alignmentWeight;
    this.cohesionWeight = cohesionWeight;
    
    this.obstacles = [];
    this.predators = [];
    this.safeDistance = 200;
    
    this.fleeingWeight = 1;
    this.evasionWeight = 1;
}

Flock.desiredseparationtoradiusratio = 5.0;
Flock.neighbourdistancetoradiusratio = 10.0;

/**
 * Runs the flock: For each boid, calls flock(), calls update(), calls borders().
 * @param {number} dt simulation time step (time passed since last update)
 * @param {number} minX left bound
 * @param {number} minY upper bound
 * @param {number} maxX right bound
 * @param {number} maxY lower bound
 */
Flock.prototype.run = function (dt, minX, maxX, minY, maxY)
{
    for (var i=0; i<this.boids.length; i++)
    {
        this.boids[i].flock (this.boids, this.desiredseparation, this.neighbourdist, this.separationWeight, this.alignmentWeight, this.cohesionWeight);
        for (var j=0; j<this.predators.length; j++)
        {
            var evade = this.boids[i].evadeIfNear (this.predators[j], this.safeDistance);
            evade.mult (this.evasionWeight);
            this.boids[i].applyForce (evade);
        }
        for (var j=0; j<this.obstacles.length; j++)
        {
            var flee = this.boids[i].fleeIfNear (this.predators[j], this.safeDistance);
            flee.mult (this.fleeingWeight);
            this.boids[i].applyForce (flee);
        }
        this.boids[i].update (dt);
        this.boids[i].borders (minX, maxX, minY, maxY);
    }
};

/**
 * Renders each boid in the flock.
 * @param {Object} context HTML Canvas's Context to draw on
 */
Flock.prototype.display = function (context)
{
    for (var i=0; i<this.boids.length; i++)
    {
        this.boids[i].display (context);
    }
};

/**
 * Adds a boid to the flock.
 * @param {Boid} b boid to add
 */
Flock.prototype.addBoid = function (b)
{
    this.boids.push (b);
};

/**
 * Changes the radius of the boids.
 * @param {number} size new radius
 */
Flock.prototype.boidSizeChange = function (size)
{
    for (var i=0; i<this.boids.length; i++)
    {
        this.boids[i].radius = 1.0 * size;
        this.boids[i].circleDistance = 3.0 * size;
        this.boids[i].circleRadius = 1.5 * size;
    }
    this.desiredseparation = size * Flock.desiredseparationtoradiusratio;
    this.neighbourdist = size * Flock.neighbourdistancetoradiusratio;
};
