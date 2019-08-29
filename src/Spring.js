/**
 * Creates a Spring that has a particle on each end, or is fixed on one end and has a particle on the other.
 * @class
 * @param {Vector,Particle} origin fixed position or particle attatched to one end of the spring
 * @param {Particle} particle particle attatched to the other end of the spring
 * @param {number} length rest length of the spring
 * @param {number} stiffness stiffness constant of the spring (the k in F = kx)
 * @param {number} damping damping of the spring, must be between 0 and 1
 * @classdesc This spring has 2 end points: origin can be a fixed position or a moving particle, and particle is a moving particle.
 */
function Spring (origin, particle, length, stiffness, damping)
{
    this.origin = origin;
    this.particle = particle;
    this.length = length;
    this.stiffness = stiffness;
    this.damping = 1 - 0.1 * damping;
    this.color = "#000000";
}

/**
 * Calculates restitution force of the spring according to Hooke's Law (F = kx) and applies it to the particle.
 */
Spring.prototype.applySpringForcesToParticle = function()
{
    var dist = (this.origin instanceof Vector) ? Vector.sub (this.origin, this.particle.location) : Vector.sub (this.origin.location, this.particle.location);
    var normDist = Vector.getNormalizedFrom (dist);
    normDist.mult (this.length);
    
    dist.sub (normDist);
    var springForce = Vector.mult (dist, this.stiffness);
    
    this.particle.applyForce (springForce);
    this.particle.velocity.mult (this.damping);
};

/**
 * Calculates restitution force of the spring according to Hooke's Law (F = kx) and applies half to each particle.
 */
Spring.prototype.applySpringForcesToBothParticles = function()
{
    var dist = Vector.sub (this.origin.location, this.particle.location);
    var normDist = Vector.getNormalizedFrom (dist);
    normDist.mult (this.length);
    dist.sub (normDist);
    
    var springForce = Vector.mult (dist, this.stiffness);
    
    this.particle.applyForce (Vector.mult (springForce, 0.5));
    this.particle.velocity.mult (this.damping);
    
    this.origin.applyForce (Vector.mult (springForce, -0.5));
    this.origin.velocity.mult (this.damping);
    
    
};

/**
 * Renders this spring on the context passed.
 * @param {Object} context HTML Canvas's Context to draw on
 */
Spring.prototype.display = function (context)
{
    context.save();
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo (this.particle1.location.x, this.particle1.location.y);
    context.lineTo (this.particle2.location.x, this.particle2.location.y);
    context.closePath();
    context.stroke();
    context.restore();
};
