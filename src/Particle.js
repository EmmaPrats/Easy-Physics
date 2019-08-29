/**
 * Creates a Particle.
 * @class
 * @extends SimulationObject
 * @param {string,Image} visualrepresentation visual representation of the particle
 * @param {number} mass mas of the particle
 * @param {number} radius radius of the particle
 * @param {Vector} location location of the particle, is updated each step
 * @param {Vector} velocity velocity of the particle, is updated each step
 * @param {Vector} acceleration acceleration of the particle, is updated each step
 * @param {bool} [orientedTowardsMovement=false] wether it's oriented towards its velocity vector
 * @classdesc A Particle is a SimulationObject that has mass.
 */
function Particle (visualrepresentation, mass, radius, location, velocity, acceleration, orientedTowardsMovement = false)
{
    SimulationObject.call (this, visualrepresentation, radius, location, velocity, acceleration, orientedTowardsMovement);
    
    this.mass = mass;
}

Particle.prototype = Object.create (SimulationObject.prototype);
Particle.prototype.constructor = Particle;

/**
 * Calculates the acceleration that the given force generates on this object and adds it to it.
 * @override
 * @param {Vector} force force applied
 */
Particle.prototype.applyForce = function (force)
{
    this.acceleration.add (Vector.div (force, this.mass));
};

/**
 * Calculates flotation force and applies it to this particle. It considers this particle is a sphere.
 * @param {Vector} gravity gravity acceleration
 * @param {number} liquidDensity density of liquid
 * @param {number} sealevel level of water
 * @param {number} floor level of floor
 */
Particle.prototype.applyFlotationForces = function (gravity, liquidDensity, sealevel, floor)
{
    if (this.location.y + this.radius >= sealevel)
    {
        var Vs = 0;
        
        if (this.location.y - this.radius >= sealevel) //Totalmente submergido
        {
            Vs = 4 * Math.PI * this.radius * this.radius * this.radius / 3;
            
            if (this.location.y + this.radius >= floor) //Centro por debajo del suelo
            {
                //alert (this.location.y);
            }
        }
        else //Sección submergida
        {
            var h = this.location.y + this.radius - sealevel;
            var a = Math.sqrt (2 * h * this.radius - h * h);
            Vs = (3 * a * a + h * h) * Math.PI * h / 6;
        }
        var Fb = liquidDensity * gravity * Vs;
        var flotacion = new Vector (0, -Fb);
        this.applyForce (flotacion);
        
        //Friction in water
        var friction = Vector.mult (this.velocity, -0.8);
        this.applyForce (friction);
    }
};
