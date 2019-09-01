/**
 * Returns a random number between the arguments.
 * @param {number} min
 * @param {number} max
 * @returns {number} random number between min and max
 */
function getRandomBetween (min, max)
{
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random number between the arguments.
 * @param {number} min
 * @param {number} max
 * @returns {number} random number between min and max
 */
Math.getRandomBetween = function (min, max)
{
    return Math.random() * (max - min) + min;
}

/**
 * Converts from degrees to radians.
 * @param {number} degrees
 * @returns {number} angle in radians
 */
Math.radians = function (degrees)
{
    return degrees * Math.PI / 180;
};

/**
 * Converts from radians to degrees.
 * @param {number} radians
 * @returns {number} angle in degrees
 */
Math.degrees = function (radians)
{
    return radians * 180 / Math.PI;
};
