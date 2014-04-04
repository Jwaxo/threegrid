threegrid
======

Takes a grid array and renders a visualization using three.js

Mostly created for visualization of grid-based city structures, threegrid can take an array of arrays of objects, read the information within the objects, and render using three.js a grid of those objects. Currently the module has built-in camera controls, but they can be easily overridden with any three.js knowledge. I will probably remove and modularize them, or at least isolate them, as I work on the main project that this contributes to.

Basically it can make neat looking town-like things.

## Grids

A grid is defined by two arrays: the outer X array and the inner Y array, like so:

```
var grid = [
    [
        {
            "type" : "school",
			"color": 0xFFCC00,
            "id"   : "7",
            "parentid" : "6"
        }
	]
]
```

In our grid, the tile with ID 7 will be located at 0,0.

## Tiles

There are three reserved properties of a tile on the grid, which occupies a coordinate. Those properties are as follows:

* **id**: a unique integer that identifies a tile. If any neighboring tiles have a parentid that matches this number, the renderer will count them as siblings and adjust their shapes.
* **parentid**: a nonunique integer that identifies the relationship a tile has with other tiles. While this ID does not have to match a tile in the grid, it is advised to have the "parent" be one of the siblings (as incestuous as this might sound). If a tile has any neighboring tiles that have this same parentid or an id that matches it, it will count them as siblings.
* **color**: a hexidecimal entry that paints that tile a specific color. This will probably be phased out at some point, but is there for easy testing.

## Shapes

The fancy part of the module is that any tiles that share the same parent ID, which can be any number you want so long as it matches between tiles you want to be related, will be assigned a shape that would make the most sense. For instance, a tile that has one sibling to the left and one sibling above will be assigned a shape that indicates this relationship:

|---|---|---|
| X | O | X |
|---|   |---|
| A | O   O |
|---|---|---|

While a set of default shapes for the 13 unique shapes this can create is provided, with coordinates mapping out their shapes in a 2D drawing, the module will eventually have the ability to let you create your own JSON objects of 3D shapes (easily exported from Blender or other 3D modelling software) and pull them in place of the blocky default ones.

## Configuration Settings

Thus far, threegrid uses three configuration settings, with two reserved for future use.

A normal configuration object will look like this:

```
var config = {
    "size" : "0", //height/size multiplier if greater than 0
    "type" : "type", //what property we're calling the "grouper", not used yet
    "asset_location" : "./examples/shapes", //not used yet
    "render_width" : "1200", //view grid width in pixels
    "render_height" : "800" //view grid height in pixels
}
```

* **size**: an integer by which to multiply an coordinate calculations by. Doesn't have the biggest purpose yet, and may break the default camera.
* **type**: eventually will be used when choosing pre-created 3D models. Up in our grid example we had "school" for a tile, so we could designate the word "type" as our type property, and only school models will be chosen. This does not function yet, as we don't have the asset loader functioning and only default shapes will be used.
* **asset_location**: the folder where pre-created 3D models are stored. Not currently used.
* **render_width**: the width, in pixels, to render the output of the map in. Probably will be phased out when this is made more modular.
* **render_height**: the height, in pixels, to render the output of the map in.

## Using the Module

To start popping out your own 3D grids, install the module, `npm install` for dependencies, then do the following things:

1. Include the threegrid package somehow, like with `var ThreeGrid = require('./index.js');`
2. Prepare your grid and configurations using the above help.
3. Have threegrid prepare the grid with something like `var map = new ThreeGrid(grid);`
4. Start rendering with something similar to `map.renderGrid(config);`

## Testing the Module

The provided test is set up to use [Beefy](https://www.npmjs.org/package/beefy) with [Browserify](https://www.npmjs.org/package/browserify), the best browser-based testing modules for Node, in my opinion.