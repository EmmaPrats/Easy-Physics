/**
 * Creates a Character.
 * @class
 * @param {string} character character
 * @param {string} font font of the character
 * @param {number} size font size of the character (in px)
 * @param {string} color color of the character
 * @classdesc A character is an object that contains a character. Its position is its center of mass.
 */
function Character (character, font, size, color)
{
    this.character = character;
    this.font = font;
    this.size = size;
    this.color = color;
    
    //Find bounding box
    
    //1. Find points
    var canvas = document.createElement ("canvas");
    canvas.width = 100;
    canvas.height = 150;
    var context = canvas.getContext("2d");
    
    //1.1. Draw letter
    context.font = "100px " + font;
    context.fillStyle = "#000000";
    context.fillText (character, 20, 100);
    
    //1.2. Find points
    var gridSize = 10;
    var numberOfPoints = 0;
    var centerOfMass = new Vector();
    for (var i=gridSize/2; i<100; i+=gridSize)
    {
        for (var j=gridSize/2; j<150; j+=gridSize)
        {
            if (context.getImageData(i,j,1,1).data[3] > 0)
            {
                centerOfMass.add (new Vector (i, j));
                numberOfPoints ++;
            }
        }
    }
    centerOfMass.div (numberOfPoints);
    this.offsetForDrawing = new Vector (20-centerOfMass.x, 100-centerOfMass.y); //in local coordinates
    this.offsetForDrawing.mult (size/100);
}

/**
 * Renders this character so that its center of mass is in its position.
 * @param {Object} context HTML Canvas's Context to draw on
 */
Character.prototype.display = function (context)
{
    context.save();
    
    context.font = this.size + "px " + this.font;
    context.fillStyle = this.color;
    
    context.fillText (this.character, this.offsetForDrawing.x, this.offsetForDrawing.y);
    
    context.restore();
};

/**
 * Renders this character so that its center of mass is in the given position.
 * @param {Object} context HTML Canvas's Context to draw on
 * @param {Vector} location position to draw the character at
 */
Character.prototype.displayAt = function (context, location)
{
    context.save();
    
    context.font = this.size + "px " + this.font;
    context.fillStyle = this.color;
    
    context.fillText (this.character, location.x + this.offsetForDrawing.x, location.y + this.offsetForDrawing.y);
    
    context.restore();
};
