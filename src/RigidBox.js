/**
 * Creates a RigidBox.
 * @class
 * @extends SimulationObject
 * @param {number} mass mass of the box
 * @param {Vector} size width and height of the box
 * @param {Vector} location location of the box, is updated each step
 * @param {Vector} velocity velocity of the box, is updated each step
 * @param {Vector} acceleration acceleration of the box, is updated each step
 * @clasdesc A RigidBox is a 2D rigid body (a rectangle).
 */
function RigidBox (mass, size, location, velocity, acceleration)
{
    SimulationObject.call (this, "circle", (size.x+size.y)/2, location, velocity, acceleration, false);
    this.mass = mass;
    this.size = size;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.angle = 0;
    this.momentOfInertia = mass * (size.x * size.x + size.y * size.y) / 12; //formula for rectangle
    
    //points location are in local coordinates to the Box.
    this.points = [];
    this.points.push (new Vector (-size.x/2, size.y/2)); //left down
    this.points.push (new Vector (size.x/2, size.y/2)); //right down
    this.points.push (new Vector (size.x/2, -size.y/2)); //right up
    this.points.push (new Vector (-size.x/2, -size.y/2)); //left up
    
    this.rotatedPoints = [];
    this.rotatedPoints.push (new Vector (this.points[0].x * Math.cos(this.angle) - this.points[0].y * Math.sin(this.angle), this.points[0].x * Math.sin(this.angle) + this.points[0].y * Math.cos(this.angle))); //left down
    this.rotatedPoints.push (new Vector (this.points[1].x * Math.cos(this.angle) - this.points[1].y * Math.sin(this.angle), this.points[1].x * Math.sin(this.angle) + this.points[1].y * Math.cos(this.angle))); //right down
    this.rotatedPoints.push (new Vector (this.points[2].x * Math.cos(this.angle) - this.points[2].y * Math.sin(this.angle), this.points[2].x * Math.sin(this.angle) + this.points[2].y * Math.cos(this.angle))); //right up
    this.rotatedPoints.push (new Vector (this.points[3].x * Math.cos(this.angle) - this.points[3].y * Math.sin(this.angle), this.points[3].x * Math.sin(this.angle) + this.points[3].y * Math.cos(this.angle))); //left up
    
    //We will assume each point has   mass = box_mass   / number_of_points
    //We will assume each point has volume = box_volume / number_of_points
    //We will assume that the rectangle is a box with depth = avg(width, height)
    //So box_volume = width * height * depth = width * height * (width + height)/2
    //The volume thing is so I can use "real world" values.
    this.pointVolume = this.size.x * this.size.y * (this.size.x + this.size.y)/2 / this.points.length;
    this.pointMass = this.mass / this.points.length;
}

RigidBox.prototype = Object.create (SimulationObject.prototype);
RigidBox.prototype.constructor = RigidBox;

/**
 * Calculates the acceleration that the given force generates on this object and adds it to it.
 * @override
 * @param {Vector} force force applied
 */
RigidBox.prototype.applyForce = function (force)
{
    this.acceleration.add (Vector.div (force, this.mass));
};

/**
 * Calculates the acceleration and torque that the given force generates on this object and adds them to it.
 * @param {Vector} force force applied
 * @param {number,Vector} point vertex list index or position on the object (in object coordinates) upon which the force is applied
 */
RigidBox.prototype.applyForceTo = function (force, point)
{
    this.acceleration.add (Vector.div (force, this.mass));
    var torque = 0;
    if (typeof(point) === "number")
    {
        torque = this.rotatedPoints[point].x * force.y - this.rotatedPoints[point].y * force.x;
    }
    else if (typeof(point) === "object" && !(typeof(point) === "undefined"))
    {
        if (point != null)
        {
            torque = point.x * force.y - point.y * force.x;
        }
    }
    this.angularAcceleration += torque / this.momentOfInertia;
};

/**
 * Calculates flotation force and torque and applies it to this particle.
 * @param {Vector} gravity gravity acceleration
 * @param {number} liquidDensity density of liquid
 * @param {number} sealevel level of water
 */
RigidBox.prototype.applyFlotationForces = function (gravity, liquidDensity, sealevel)
{
    var flotationForce = Vector.mult (gravity, -liquidDensity * this.pointVolume);
    for (var i=0; i<this.points.length; i++)
    {
        if (this.location.y + this.rotatedPoints[i].y > sealevel)
        {
            this.applyForce (flotationForce);
            
            var torque = this.rotatedPoints[i].x * flotationForce.y - this.rotatedPoints[i].y * flotationForce.x;
            this.angularAcceleration += torque / this.momentOfInertia;
            
            //Friction in water
            var friction = Vector.mult (this.velocity, -0.5);
            this.applyAcceleration (friction);//this.applyForce (friction);
            var angularFriction = Vector.mult (this.angularVelocity, -0.8);
            torque = this.rotatedPoints[i].x * angularFriction.y - this.rotatedPoints[i].y * angularFriction.x;
            this.angularAcceleration += torque;//this.angularAcceleration += torque / this.momentOfInertia;
        }
    }
};

/**
 * Updates object's location, angle, velocity and angular velocity. Sets acceleration = 0 and angularAcceleration = 0.
 * Should be called once per simulation step, after all forces have been computed and before rendering the object.
 * @override
 * @param {number} dt simulation time step (time passed since last update)
 */
RigidBox.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;
    for (var i=0; i<this.points.length; i++)
    {
        this.rotatedPoints[i].x = this.points[i].x * Math.cos(this.angle) - this.points[i].y * Math.sin(this.angle);
        this.rotatedPoints[i].y = this.points[i].x * Math.sin(this.angle) + this.points[i].y * Math.cos(this.angle);
    }
    this.angularAcceleration = 0;
};

/**
 * Renders this object on the context passed.
 * @override
 * @param {Object} context HTML Canvas's Context to draw on
 */
RigidBox.prototype.display = function (context)
{
    context.save();
    
    context.strokeStyle = "#000000";
    context.fillStyle = this.color;
    
    context.translate (this.location.x, this.location.y);
    
    context.save();
    context.rotate (this.angle);
    context.fillRect (-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
    context.restore();
    
    context.beginPath();
    context.moveTo (this.rotatedPoints[0].x, this.rotatedPoints[0].y);
    context.lineTo (this.rotatedPoints[1].x, this.rotatedPoints[1].y);
    context.lineTo (this.rotatedPoints[2].x, this.rotatedPoints[2].y);
    context.lineTo (this.rotatedPoints[3].x, this.rotatedPoints[3].y);
    context.closePath();
    context.stroke();
    
    context.restore();
};
