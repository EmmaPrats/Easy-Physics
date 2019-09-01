/**
 * Creates a Boid.
 * This is a simple implementation of Reynolds' Boids as explained in https://www.red3d.com/cwr/boids/
 * @class
 * @extends SimulationObject
 * @param {string,Image} visualrepresentation visual representation of the boid
 * @param {number} radius radius of the boid
 * @param {Vector} location location of the object, is updated each step
 * @param {Vector} velocity velocity of the object, is updated each step
 * @param {Vector} acceleration acceleration of the object, is updated each step
 * @param {number} maxspeed maximum speed the boid can move at
 * @param {number} maxforce maximum force the boid can produce
 * @param {bool} orientedTowardsMovement wether it's oriented towards its velocity vector
 */
function Boid (visualrepresentation, radius, location, velocity, acceleration, maxspeed, maxforce, orientedTowardsMovement = true)
{
    SimulationObject.call (this, visualrepresentation, 1, radius, location, velocity, acceleration, orientedTowardsMovement);
    
    this.maxspeed = maxspeed;
    this.maxforce = maxforce;
    
    this.circleDistance = 3 * this.radius;
    this.circleRadius = 1.5 * this.radius;
    this.wanderAngle = 0;
    
}

Boid.prototype = Object.create (SimulationObject.prototype);
Boid.prototype.constructor = Boid;

/**
 * Updates boid's location and velocity. Sets acceleration = 0.
 * Should be called once per simulation step, after all forces have been computed and before rendering the object.
 * @override
 * @param {number} dt simulation time step (time passed since last update)
 */
Boid.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.velocity.limit (this.maxspeed);
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
};

/**
 * Calculates and applies flocking forces: separation, alignment and cohesion.
 * More information: https://www.red3d.com/cwr/boids/
 * @param {Arary<Boid>} boids all the boids in the flock
 * @param {number} desiredseparation desired separation between all boids
 * @param {number} neighbourdist neighbourhood radius
 * @param {number} separationWeight weight of separation behaviour
 * @param {number} alignmentWeight weight of alignment behaviour
 * @param {number} cohesionWeight weight of cohesion behaviour
 */
Boid.prototype.flock = function (boids, desiredseparation, neighbourdist, separationWeight, alignmentWeight, cohesionWeight)
{
    var separation = this.separate (boids, desiredseparation);
    var alignment = this.align (boids, neighbourdist);
    var cohesion = this.cohesionate (boids, neighbourdist);
    
    separation.mult (separationWeight);
    alignment.mult (alignmentWeight);
    cohesion.mult (cohesionWeight);
    
    this.applyForce (separation);
    this.applyForce (alignment);
    this.applyForce (cohesion);
};

/**
 * Updates the boid's position so that it stays inside the given bounds.
 */
Boid.prototype.borders = function (minX, maxX, minY, maxY)
{
    if (this.location.x - this.radius < minX)
    {
        this.location.x = maxX + this.radius;
    }
    if (this.location.y -this.radius < minY)
    {
        this.location.y = maxY + this.radius;
    }
    if (this.location.x > maxX + this.radius)
    {
        this.location.x = minX + this.radius;
    }
    if (this.location.y > maxY + this.radius)
    {
        this.location.y = minY + this.radius;
    }
};

/**
 * Returns the steering force that will produce separation behaviour.
 * For each boid that is closer than desiredseparation, it calculates a direction away from it.
 * All repelling directions are added, normalized and scaled to match maxspeed.
 * A steering force is calculated that will move the boid towards the repelling direction.
 * @param {Array<Boid>} boids all the boids in the flock
 * @param {number} desiredseparation desired separation between all boids
 * @returns {Vector} steering force to move the boid away from other boids that are too close
 */
Boid.prototype.separate = function (boids, desiredseparation)
{
    var steer = new Vector (0, 0);
    var count = 0;
    for (var i=0; i<boids.length; i++)
    {
        var d = Vector.dist (this.location, boids[i].location);
        if (d > 0 && d < desiredseparation)
        {
            var diff = Vector.sub (this.location, boids[i].location);
            diff.normalize();
            diff.div (d);
            steer.add (diff);
            count ++;
        }
    }
    if (count > 0)
    {
        steer.div (count);
    }
    
    if (steer.getMagnitude() > 0)
    {
        steer.normalize();
        steer.mult (this.maxspeed);
        steer.sub (this.velocity);
        steer.limit (this.maxforce);
    }
    
    return steer;
};

/**
 * Returns the steering force that will produce alignment behaviour.
 * It calculates the average velocity of all neighbours, and it is normalized and scaled to match maxspeed.
 * A steering force is calculated that will move the boid to match the average velocity.
 * @param {Array<Boid>} boids all the boids in the flock
 * @param {number} neighbourdist neighbourhood radius
 * @returns {Vector} steering force to align the boid with its neighbours
 */
Boid.prototype.align = function (boids, neighbourdist)
{
    var sum = new Vector (0, 0);
    var count = 0;
    for (var i=0; i<boids.length; i++)
    {
        var d = Vector.dist (this.location, boids[i].location);
        if (d > 0 && d < neighbourdist)
        {
            sum.add (boids[i].velocity);
            count ++;
        }
    }
    if (count > 0)
    {
        //Reynolds: Steering = Desired - Velocity
        sum.div (count);
        sum.normalize();
        sum.mult (this.maxspeed);
        var steer = Vector.sub (sum, this.velocity);
        steer.limit (this.maxforce);
        return steer;
    }
    else
    {
        return new Vector (0, 0);
    }
};

/**
 * Returns the steering force that will produce cohesion behaviour.
 * It calculates the center of mass of all the neighbouring boids, and calculates a steering force towards it.
 * @param {Array<Boid>} boids all the boids in the flock
 * @param {number} neighbourdist neighbourhood radius
 * @returns {Vector} steering force towards the neighbourhood's center of mass
 */
Boid.prototype.cohesionate = function (boids, neighbourdist)
{
    var sum = new Vector (0, 0);
    var count = 0;
    for (var i=0; i<boids.length; i++)
    {
        var d = Vector.dist (this.location, boids[i].location);
        if (d > 0 && d < neighbourdist)
        {
            sum.add (boids[i].location);
            count ++;
        }
    }
    if (count > 0)
    {
        sum.div (count);
        
        return this.seek (sum);
    }
    else
    {
        return new Vector (0, 0);
    }
};

/**
 * Returns the steering force that will move the boid towards a target.
 * @param {Vector} target target location
 * @returns {Vector} steering force that will move the boid towards the target
 */
Boid.prototype.seek = function (target)
{
    var desired = Vector.sub (target, this.location);
    desired.normalize();
    desired.mult (this.maxspeed);
    
    var steer = Vector.sub (desired, this.velocity);
    steer.limit (this.maxforce);
    return steer;
};

/**
 * Returns the steering force that will move the boid towards a target, only if the target is within the given radius.
 * @param {Vector} target target location
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid towards the target if it's within the radius
 */
Boid.prototype.seekIfNear = function (target, distance)
{
    if (Vector.dist (this.location, target) <= distance)
    {
        return this.seek (target);
    }
    else
    {
        return new Vector();
    }
};

/**
 * Returns the steering force that will move a boid towards a target.
 * @param {Boid} boid boid to calculate a steering force for
 * @param {Vector} target target location
 * @returns {Vector} steering force that will move the boid towards the target
 */
Boid.seek = function (boid, target)
{
    var desired = Vector.sub (target, boid.location);
    desired.normalize();
    desired.mult (boid.maxspeed);
    
    var steer = Vector.sub (desired, boid.velocity);
    steer.limit (boid.maxforce);
    return steer;
};

/**
 * Returns the steering force that will move the boid towards a moving target (another boid).
 * @param {Boid} target target boid
 * @returns {Vector} steering force that will move the boid towards the target
 */
Boid.prototype.pursue = function (target, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    return this.seek (predictedLocation);
};

/**
 * Returns the steering force that will move the boid towards a moving target (another boid), only if the target is within the given radius.
 * @param {Boid} target target boid
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid towards the target if it's within the radius
 */
Boid.prototype.pursueIfNear = function (target, distance, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    if (Vector.dist (this.location, target.location) <= distance)
    {
        return this.seek (predictedLocation);
    }
    else
    {
        return new Vector();
    }
};

/**
 * Returns the steering force that will move the boid away from a target.
 * @param {Vector} target target location
 * @returns {Vector} steering force that will move the boid away from the target
 */
Boid.prototype.flee = function (target)
{
    var steer = this.seek (target);
    steer.mult (-1);
    return steer;
};

/**
 * Returns the steering force that will move the boid away from a target, only if the target is within the given radius.
 * @param {Vector} target target location
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid away from the target if it's within the radius
 */
Boid.prototype.fleeIfNear = function (target, distance)
{
    if (Vector.dist (this.location, target) <= distance)
    {
        return this.flee (target);
    }
    else
    {
        return new Vector();
    }
};

/**
 * Returns the steering force that will move the boid away from a moving target (another boid).
 * @param {Boid} target target boid
 * @returns {Vector} steering force that will move the boid away from the target
 */
Boid.prototype.evade = function (target, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    return this.flee (predictedLocation);
};

/**
 * Returns the steering force that will move the boid away from a moving target (another boid), only if the target is within the given radius.
 * @param {Boid} target target boid
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid away from the target if it's within the radius
 */
Boid.prototype.evadeIfNear = function (target, distance, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    if (Vector.dist (this.location, predictedLocation) <= distance)
    {
        return this.flee (predictedLocation);
    }
    else
    {
        return new Vector();
    }
};

/**
 * Returns the steering force that will move the boid randomly.
 * @returns {Vector} steering force that will move the boid randomly.
 */
Boid.prototype.wander = function()
{
    var circlePosition = new Vector (this.velocity.x, this.velocity.y);
    if (circlePosition.getMagnitude() == 0)
    {
        circlePosition.x = 1;
        circlePosition.y = 0;
    }
    else
    {
        circlePosition.normalize();
    }
    circlePosition.mult (this.circleDistance);
    
    this.wanderAngle += getRandomBetween (-0.3, 0.3);
    var displacement = new Vector (this.circleRadius * Math.cos(this.wanderAngle), this.circleRadius * Math.sin(this.wanderAngle));
    
    var desired = Vector.add (circlePosition, displacement);
    desired.normalize();
    desired.mult (this.maxspeed);
    
    var steer = Vector.sub (desired, this.velocity);
    steer.limit (this.maxforce);
    return steer;
};
