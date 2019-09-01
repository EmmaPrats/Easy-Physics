/**
 * Creates a RigidLetter.
 * @class
 * @extends RigidBox
 * @param {string} character character
 * @param {string} font font of the character (in px)
 * @param {number} mass mass of the letter
 * @param {number} fontSize font size of the character
 * @param {Vector} location location of the letter, is updated each step
 * @param {Vector} velocity velocity of the letter, is updated each step
 * @param {Vector} acceleration acceleration of the letter, is updated each step
 * @classdesc A RigidLetter is a rigid body in the shape of a character.
 */
function RigidLetter (character, font, mass, fontSize, location, velocity, acceleration)
{
    RigidBox.call (this, mass, new Vector (fontSize, fontSize), location, velocity, acceleration);
    
    var gridSize = 10;
    
    //POINTS, OFFSET FOR DRAWING CHARACTER
    this.points = RigidLetter.getPointsForRBD (character, font, fontSize, gridSize);
    this.letterLocation = this.points.pop();
    
    //ROTATED POINTS
    this.rotatedPoints = [];
    for (let i=0; i<this.points.length; i++)
    {
        this.rotatedPoints.push (new Vector (this.points[i].x, this.points[i].y));
    }
    
    //BOUNDING BOX
    var minX = this.points[0].x, maxX = this.points[0].x, minY = this.points[0].y, maxY = this.points[0].y;
    for (let i=1; i<this.points.length; i++)
    {
        if (points[i].x < minX)
            minX = i;
        else if (points[i].x > maxX)
            maxX = i;
        if (points[i].y < minY)
            minY = j;
        else if (points[i].y > maxY)
            maxY = j;
    }
    gridSize *= fontSize / 100;
    this.size = new Vector (maxX - minX + gridSize, maxY - minY + gridSize);
    
    //We will assume each point has   mass = box_mass   / number_of_points
    //We will assume each point has volume = box_volume / number_of_points
    //We will assume that the rectangle is a box with depth = avg(width, height)
    //So box_volume = width * height * depth = width * height * (width + height)/2
    //The volume thing is so I can use "real world" values.
    this.pointVolume = this.size.x * this.size.y * (this.size.x + this.size.y)/2 / this.points.length;
    this.pointMass = this.mass / this.points.length;
    
    this.letter = character;
    this.font = fontSize + "px " + font;
}

RigidLetter.prototype = Object.create (RigidBox.prototype);
RigidLetter.prototype.constructor = RigidLetter;

/**
 * Calculates and returns an array containing all points belonging to the character.
 * Points are sampled with gridSize accuracy.
 * The last element in the returned array is the character's offsetForDrawing. Use pop() to retrieve and remove it.
 * @param {character} character the character to get points from
 * @param {string} font font of the character
 * @param {integer} fontSize font size of the character
 * @param {integer} [gridSize=10] grid size for sampling accuracy
 * @returns {Array<Vector>} array containing all points and offsetForDrawing in object coordinates.
 */
RigidLetter.getPointsForRBD = function (character, font, fontSize, gridSize = 10)
{
    //1. Create canvas
    var canvas = document.createElement ("canvas");
    canvas.width = 100;
    canvas.height = 150;
    var context = canvas.getContext("2d");
    
    //2. Draw character
    context.font = "100px " + font;
    context.fillStyle = "#000000";
    context.fillText (character, 20, 100);
    
    //3. Find points and center of mass
    var points = [];
    var centerOfMass = new Vector();
    for (var i=gridSize/2; i<100; i+=gridSize)
    {
        for (var j=gridSize/2; j<150; j+=gridSize)
        {
            if (context.getImageData(i,j,1,1).data[3] > 0)
            {
                points.push (new Vector (i, j));
                centerOfMass.x += i;
                centerOfMass.y += j;
            }
        }
    }
    centerOfMass.div (points.length);
    
    //4. Get points in local coordinates and the right size
    for (let i=0; i<points.length; i++)
    {
        points[i].sub (centerOfMass);
        points[i].mult (fontSize/100);
    }
    
    //5. Calculate offset for drawing the character
    var offsetForDrawing = new Vector (20-centerOfMass.x, 100-centerOfMass.y); //in local coordinates
    offsetForDrawing.mult (fontSize/100); //and the right size
    
    //6. Last element of points array is offsetForDrawing
    points.push (offsetForDrawing);
    
    return points;
}

/**
 * Renders this object on the context passed.
 * @override
 * @param {Object} context HTML Canvas's Context to draw on
 */
RigidLetter.prototype.display = function (context)
{
    context.save();
    context.translate (this.location.x, this.location.y);
    context.rotate (this.angle);
    context.fillStyle = this.color;
    context.font = this.font;
    context.fillText (this.letter, this.letterLocation.x, this.letterLocation.y);
    context.restore();
    /*
     //TODO delete, this is for debug only
     context.fillStyle = "#0000FF";
     for (var i=0; i<this.points.length; i++)
     {
     context.beginPath();
     context.arc (this.location.x + this.rotatedPoints[i].x, this.location.y + this.rotatedPoints[i].y, 0.05*(this.size.x+this.size.y)/2, 0, 2*Math.PI);
     context.fill();
     }
     context.fillStyle ="#00FF00";
     context.beginPath();
     context.arc (this.location.x, this.location.y, 0.05*(this.size.x+this.size.y)/2, 0, 2*Math.PI);
     context.fill();*/
};
