/**
 * Creates a 2D Vector.
 * @class
 * @param {number} [x=0] position in x axis
 * @param {number} [y=0] position in y axis
 * @classdesc A 2D Vector with multiple operations.
 */
function Vector (x, y)
{
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * Adds another vector to this.
 * @param {Vector} vector vector to add to this
 */
Vector.prototype.add = function (vector)
{
    this.x += vector.x;
    this.y += vector.y;
};

/**
 * Returns a new vector that is the sum of the two passed as arguments.
 * @param {Vector} vector1 vector to add
 * @param {Vector} vector2 vector to add
 * @returns {Vector} new Vector object that is the sum of the two
 */
Vector.add = function (vector1, vector2)
{
    return new Vector (vector1.x + vector2.x, vector1.y + vector2.y);
};

/**
 * Substracts another vector to this.
 * @param {Vector} vector vector to substract to this
 */
Vector.prototype.sub = function (vector)
{
    this.x -= vector.x;
    this.y -= vector.y;
};

/**
 * Returns a new vector that is the substraction of the two passed as arguments.
 * @param {Vector} vector1 vector to substract to
 * @param {Vector} vector2 vector to substract
 * @returns {Vector} new Vector object that is the result of vector1 - vector2
 */
Vector.sub = function (vector1, vector2)
{
    return new Vector (vector1.x - vector2.x, vector1.y - vector2.y);
};

/**
 * Returns the distance between two points.
 * @param {Vector} pointA pointA
 * @param {Vector} pointB pointB
 * @returns {number} distance between the two points
 */
Vector.dist = function (pointA, pointB)
{
    return Math.sqrt ((pointB.x - pointA.x) * (pointB.x - pointA.x) + (pointB.y - pointA.y) * (pointB.y - pointA.y));
};

/**
 * Returns the length of this vector.
 * @return {number} length of this vector
 */
Vector.prototype.getMagnitude = function()
{
    return Math.sqrt (this.x * this.x + this.y * this.y);
};

/**
 * Returns the length of the vector.
 * @param {Vector} vector vector to calculate the length of
 * @return {number} length of the vector
 */
Vector.getMagnitude = function (vector)
{
    return Math.sqrt (vector.x * vector.x + vector.y * vector.y);
};

/**
 * Normalizes this vector (makes its length = 1).
 */
Vector.prototype.normalize = function()
{
    var mag = this.getMagnitude();
    this.x /= mag;
    this.y /= mag;
};

/**
 * Returns a new vector that is a normalized version of the one passed as argument.
 * @param {Vector} vector vector to get a normalized from
 * @return {Vector} normalized vector that has the same direction as the argument
 */
Vector.getNormalizedFrom = function (vector)
{
    return new Vector (vector.x / vector.getMagnitude(), vector.y / vector.getMagnitude());
};

/**
 * Gets the angle between a line A=(0,0) B=(this.x,this.y) and the X axis.
 * @return {number} angle between line A=(0,0) B=(this.x,this.y) and the X axis
 */
Vector.prototype.getAngle = function()
{
    return Math.atan2 (this.y, this.x);
};

/**
 * Returns a new Vector with the given length and angle from the X axis.
 * @param {number} angle angle from the X axis
 * @param {number} magnitude length of the desired vector
 * @returns {Vector} new Vector with the given length and angle
 */
Vector.fromAngle = function (angle, magnitude)
{
    return new Vector (magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

/**
 * Multiplies this vector by a number.
 * @param {number} scalar number to multiply this vector by
 */
Vector.prototype.mult = function (scalar)
{
    this.x *= scalar;
    this.y *= scalar;
};

/**
 * Returns a new Vector that is the result of multiplying the vector and number passed.
 * @param {Vector} vector vector to copy
 * @param {number} scalar number to multiply the vector by
 * @returns {Vector} vector that is a copy of the one passed, scaled by the number passed
 */
Vector.mult = function (vector, scalar)
{
    return new Vector (vector.x * scalar, vector.y * scalar);
};

/**
 * Divides this vector by a number.
 * @param {number} scalar number to divide this vector by
 */
Vector.prototype.div = function (scalar)
{
    this.x /= scalar;
    this.y /= scalar;
};

/**
 * Returns a new Vector that is the result of dividing the vector by the number passed.
 * @param {Vector} vector vector to copy
 * @param {number} scalar number to divide the vector by
 * @returns {Vector} vector that is a copy of the one passed, divided by the number passed
 */
Vector.div = function (vector, scalar)
{
    return new Vector (vector.x / scalar, vector.y / scalar);
};

/**
 * Limits the length of this vector by the length passed.
 * @param {number} magnitude maximum length of the vector
 */
Vector.prototype.limit = function (magnitude)
{
    if (this.getMagnitude() > magnitude)
    {
        this.normalize();
        this.x *= magnitude;
        this.y *= magnitude;
    }
};

/**
 * Returns the dot product between 2 vectors
 * @param {Vector} vector1 vector1
 * @param {Vector} vector2 vector2
 */
Vector.dot = function (vector1, vector2)
{
    return vector1.x * vector2.x + vector1.y * vector2.y;
};
