# Easy-Physics
Easy Physics library for easily making physics based animations on the HTML5 Canvas!

### Springs

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-springs.png)

Each letter will be propelled away from the mouse when it gets close to them, and they will spring back into place when the mouse leaves. You can choose the text, font, color, spring strength, and more!

### Floating

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-floating.png)

Each letter is a solid object that floats in water. You can choose the letters, font, color, mass, liquid density, and more!

### Flocking

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-flocking.png)

It's a simple implementation of Reynolds' 1987 paper ["Flocks, Herds, and Shcools: A Distributed Behavioral Model"](https://www.red3d.com/cwr/boids/). It creates a flock of objects that move around. Those objects can be images, and you can tweak their behaviour.

### Steering

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-steering.png)

Another implementation of a Reynold's paper: ["Steering Behaviours for Autonomous Characters"](https://www.red3d.com/cwr/steer/). There are 2 agents and a prize. Agent A tries to reach the prize while avoiding Agent B, whose goal is to reach Agent A. You can tweak their behaviour and decide which elements you want in the scene.

## How to use

You can use **Easy Physics** as a Javascript library, but there is also a visual editor if you prefer.

### Creating a simple Springs animation

Add a Canvas element to your HTML file:

`<canvas id="EasyPhysics" width="480" height="360"></canvas>`

Download the file `EasyPhysics.js` and add `<script src="EasyPhysics.js"></script>` to your HTML file before the `</body>` tag.

After that, add:

```
<script>
var canvas = document.getElementById("EasyPhysics");
var springsAnimation = new SpringsAnimation (canvas);

(function animationLoop()
{
   springsAnimation.draw();
   window.requestAnimationFrame (animationLoop);
})();
</script>
```

This will create an animation with the default parameters.

### Customizing the Springs animation

You can create a settings object and pass it to `springsAnimation` before starting the animation loop:

```
<script>
var settings = [];
settings.text = "Hello, World!";
settings.font = "Times New Roman";

var canvas = document.getElementById("EasyPhysics");
var springsAnimation = new SpringsAnimation (canvas);
springsAnimation.initParams (false, settings);
springsAnimation.initSimulation(); //If you call initParams, you must call initSimulation after.

(function animationLoop()
{
   springsAnimation.draw();
   window.requestAnimationFrame (animationLoop);
})();
</script>
```

Check out the documentation for a full list of all the settings for each scene.

## How to install
1. Download the file `EasyPhysics.js`.
2. Place the file in your website directory.
3. Add `<script src="EasyPhysics.js"></script>` to your page, make sure it loads before the animation script.
