# Easy-Physics
Easy Physics library for easily making physics based animations on the HTML5 Canvas!

### Springs

![alt text](https://github.com/Onpu93/Easy-Physics-Plugin/blob/master/sample-springs.png)

Each letter will be propelled away from the mouse when it gets close to them, and they will spring back into place when the mouse leaves. You can choose the text, font, color, spring strength, and more!

### Floating

![alt text](https://github.com/Onpu93/Easy-Physics-Plugin/blob/master/sample-floating.png)

Each letter is a solid object that floats in water. You can choose the letters, font, color, mass, liquid density, and more!

### Flocking

![alt text](https://github.com/Onpu93/Easy-Physics-Plugin/blob/master/sample-flocking.png)

It's a simple implementation of Reynolds' 1987 paper ["Flocks, Herds, and Shcools: A Distributed Behavioral Model"](https://www.red3d.com/cwr/boids/). It creates a flock of objects that move around. Those objects can be images, and you can tweak their behaviour.

### Steering

![alt text](https://github.com/Onpu93/Easy-Physics-Plugin/blob/master/sample-steering.png)

Another implementation of a Reynold's paper: ["Steering Behaviours for Autonomous Characters"](https://www.red3d.com/cwr/steer/). There are 2 agents and a prize. Agent A tries to reach the prize while avoiding Agent B, whose goal is to reach Agent A. You can tweak their behaviour and decide which elements you want in the scene.

## How to use

### Creating a simple Springs animation

Add a Canvas element to your HTML file:

`<canvas id="EasyPhysics" width="480" height="360"></canvas>`

Create a script, let's call it, for example, `myAnimation.js`.

```
var canvas = document.getElementById("EasyPhysics");
var springsAnimation = new SpringsAnimation (canvas);
```

## How to install
1. Download the file `EasyPhysics.js`.
2. Place the file in your website directory.
3. Add `<script src="EasyPhysics.js"></script>` to your page, make sure it loads before the animation script.
