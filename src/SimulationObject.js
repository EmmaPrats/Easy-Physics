/**
 * Creates a SimulationObject.
 * @class
 * @param {string,Image} visualrepresentation visual representation of the object
 * @param {number} radius radius of the object
 * @param {Vector} location location of the object, is updated each step
 * @param {Vector} velocity velocity of the object, is updated each step
 * @param {Vector} acceleration acceleration of the object, is updated each step
 * @param {bool} orientedTowardsMovement wether it's oriented towards its velocity vector
 */
function SimulationObject (visualrepresentation, mass, radius, location, velocity, acceleration, orientedTowardsMovement = false)
{
    this.visualrepresentation = visualrepresentation;
    this.mass = mass;
    this.radius = radius * 1.0;
    this.location = location;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.orientedTowardsMovement = orientedTowardsMovement;
    this.color = "#000000";
}

/**
 * Updates object's location and velocity. Sets acceleration = 0.
 * Should be called once per simulation step, after all forces have been computed and before rendering the object.
 * @param {number} dt simulation time step (time passed since last update)
 */
SimulationObject.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
};

/**
 * Adds acceleration to the object's acceleration.
 * @param {Vector} acceleration acceleration to add
 */
SimulationObject.prototype.applyAcceleration = function (acceleration)
{
    this.acceleration.add (acceleration);
};

/**
 * Calculates the acceleration that the given force generates on this object and adds it to it.
 * @param {Vector} force force applied
 */
SimulationObject.prototype.applyForce = function (force)
{
    this.acceleration.add (Vector.div (force, this.mass));
};

/**
 * Renders this object on the context passed.
 * @param {Object} context HTML Canvas's Context to draw on
 */
SimulationObject.prototype.display = function (context)
{
    context.save();
    context.fillStyle = this.color;
    
    if (typeof (this.visualrepresentation) == "string")
    {
        switch (this.visualrepresentation)
        {
            case "square":
                context.fillRect (this.location.x-this.radius, this.location.y-this.radius, 2*this.radius, 2*this.radius);
                break;
            case "circle":
                context.beginPath();
                context.arc (this.location.x, this.location.y, this.radius, 0, 2*Math.PI);
                context.closePath();
                context.fill();
                break;
            case "triangle":
                context.save();
                context.transform (1, 0, 0, 1, this.location.x, this.location.y);
                if (this.orientedTowardsMovement)
                {
                    var theta = Math.atan2 (this.velocity.y, this.velocity.x) - Math.atan2 (0, 1);
                    context.rotate (theta);
                }
                context.beginPath();
                context.moveTo (this.radius, 0);
                context.lineTo (-this.radius, -3*this.radius/5);
                context.lineTo (-this.radius, 3*this.radius/5);
                context.closePath();
                context.fill();
                context.restore();
                break;
            default:
                context.beginPath();
                context.arc (this.location.x, this.location.y, this.radius, 0, 2*Math.PI, false);
                context.closePath();
                context.fill();
        }
    }
    else if (this.visualrepresentation instanceof Image)
    {
        context.save();
        context.transform (1, 0, 0, 1, this.location.x, this.location.y);
        if (this.orientedTowardsMovement)
        {
            var theta = Math.atan2 (this.velocity.y, this.velocity.x) - Math.atan2 (0, 1);
            context.rotate (theta);
        }
        context.drawImage (this.visualrepresentation, -this.radius, -this.radius, 2*this.radius, 2*this.radius);
        context.restore();
    }
    else if (this.visualrepresentation instanceof Character)
    {
        this.visualrepresentation.displayAt (context, this.location);
    }
    else
    {
        context.beginPath();
        context.arc (this.location.x, this.location.y, this.radius, 0, 2*Math.PI);
        context.closePath();
        context.fill();
    }
    
    context.restore();
};
