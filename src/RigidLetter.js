/**
 * Creates a RigidLetter.
 * @class
 * @extends RigidBox
 * @param {string} letter character
 * @param {string} font font of the character (in px)
 * @param {number} mass mass of the letter
 * @param {number} size font size of the character
 * @param {Vector} location location of the letter, is updated each step
 * @param {Vector} velocity velocity of the letter, is updated each step
 * @param {Vector} acceleration acceleration of the letter, is updated each step
 * @classdesc A RigidLetter is a rigid body in the shape of a character.
 */
function RigidLetter (letter, font, mass, size, location, velocity, acceleration)
{
    //1. Find points
    var canvas = document.createElement ("canvas");
    canvas.width = 100;
    canvas.height = 150;
    var context = canvas.getContext("2d");
    
    //1.1. Draw letter
    context.font = "100px " + font;
    context.fillStyle = "#000000";
    context.fillText (letter, 20, 100);
    
    //1.2. Find points
    var gridSize = 10;
    var realPoints = [];
    var centerOfMass = new Vector();
    var minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (var i=gridSize/2; i<100; i+=gridSize)
    {
        for (var j=gridSize/2; j<150; j+=gridSize)
        {
            if (context.getImageData(i,j,1,1).data[3] > 0)
            {
                realPoints.push (new Vector (i, j));
                centerOfMass.add (new Vector (i, j));
                
                //For calculating bounding box size
                if (i < minX) minX = i;
                else if (i > maxX) maxX = i;
                if (j < minY) minY = j;
                else if (j > maxY) maxY = j;
            }
        }
    }
    centerOfMass.div (realPoints.length);
    var boundingBoxSize = new Vector (maxX - minX + gridSize, maxY - minY + gridSize); //super
    boundingBoxSize.mult (size/100);
    
    RigidBox.call (this, mass, boundingBoxSize, location, velocity, acceleration);
    
    this.letterLocation = new Vector (20-centerOfMass.x, 100-centerOfMass.y); //in local coordinates
    this.letterLocation.mult (size/100);
    this.points = realPoints; //Constructor calculated the 4 points for the bounding box.
    for (var i=0; i<this.points.length; i++)
    {
        this.points[i].sub (centerOfMass);
        this.points[i].mult (size/100);
    }
    //now all points are in local coordinates
    
    this.rotatedPoints = []; //Constructor calculated the 4 points for the bounding box.
    for (var i=0; i<this.points.length; i++)
    {
        this.rotatedPoints.push (new Vector (
                                             this.points[i].x * Math.cos(this.angle) - this.points[i].y * Math.sin(this.angle),
                                             this.points[i].x * Math.sin(this.angle) + this.points[i].y * Math.cos(this.angle)
                                             ));
    }
    
    //We will assume each point has   mass = box_mass   / number_of_points
    //We will assume each point has volume = box_volume / number_of_points
    //We will assume that the rectangle is a box with depth = avg(width, height)
    //So box_volume = width * height * depth = width * height * (width + height)/2
    //The volume thing is so I can use "real world" values.
    this.pointVolume = this.size.x * this.size.y * (this.size.x + this.size.y)/2 / this.points.length;
    this.pointMass = this.mass / this.points.length;
    
    this.letter = letter;
    this.font = size + "px " + font;
}

RigidLetter.prototype = Object.create (RigidBox.prototype);
RigidLetter.prototype.constructor = RigidLetter;

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
