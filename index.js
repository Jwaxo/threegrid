module.exports = function(grid) {
    //'grid' must be a sequentially-keyed array of sequentially-keyed arrays
    //that correspond to some sort of grid. So grid[3][4] refers to a gridpoint
	//that is three to the right and four below the top-left of the rendering
	//field, viewed from the top down.

    var THREE = require('three'); //Assigns the renderer to THREE automatically
    THREE.OrbitControls = require('./OrbitControls.js');
	
	var WIDTH = 1200,
		HEIGHT = 800,
		SCALE = 10;

	// set some camera attributes
	var VIEW_ANGLE = 45,
		ASPECT = WIDTH / HEIGHT,
		NEAR = 0.1,
		FAR = 10000;
    
    var fs = require('fs'); //fs is used to load physical models, located in the
	//  config-defined "assetlocation" folder. A model must be named after the
	//  shape that it replaces, as opposed to the basic placeholder we define in
	//  default_shapes.js.
    
    this.grid = grid; //We use it in virtually every function, so assign it.
    this.shapesLookup = require('./default_shapes.js'); //If a file isn't found
    //to draw for a specific shapetype, then use this.
    
    //The following lookup list is used to define similar shapes (IE, shapes that
    //rotate to equal each other. It assumes the corners check, and 'rotates'
    //indicates how many clockwise rotations it takes to get to the original
    this.rotateLookup = {
        '4' : {
            'original' : 1,
            'rotates' : 3
        },
        '16' : {
            'original' : 1,
            'rotates' : 2
        },
        '20' : {
            'original' : 5,
            'rotates' : 3
        },
        '56' : {
            'original' : 14,
            'rotates' : 3
        },
        '64' : {
            'original' : 1,
            'rotates' : 1
        },
        '65' : {
            'original' : 5,
            'rotates' : 1
        },
        '68' : {
            'original' : 17,
            'rotates' : 2
        },
        '69' : {
            'original' : 21,
            'rotates' : 1
        },
        '71' : {
            'original' : 29,
            'rotates' : 1
        },
        '80' : {
            'original' : 5,
            'rotates' : 2
        },
        '84' : {
            'original' : 21,
            'rotates' : 3
        },
        '87' : {
            'original' : 53,
            'rotates' : 2
        },
        '93' : {
            'original' : 53,
            'rotates' : 1
        },
        '116' : {
            'original' : 29,
            'rotates' : 3
        },
        '124' : {
            'original' : 31,
            'rotates' : 3
        },
        '125' : {
            'original' : 95,
            'rotates' : 3
        },
        '162' : {
            'original' : 21,
            'rotates' : 2
        },
        '193' : {
            'original' : 14,
            'rotates' : 1
        },
        '199' : {
            'original' : 31,
            'rotates' : 1
        },
        '209' : {
            'original' : 29,
            'rotates' : 2
        },
        '213' : {
            'original' : 53,
            'rotates' : 3
        },
        '215' : {
            'original' : 95,
            'rotates' : 1
        },
        '223' : {
            'original' : 127,
            'rotates' : 1
        },
        '224' : {
            'original' : 14,
            'rotates' : 2
        },
        '241' : {
            'original' : 31,
            'rotates' : 2
        },
        '245' : {
            'original' : 95,
            'rotates' : 2
        },
        '247' : {
            'original' : 127,
            'rotates' : 2
        },
        '253' : {
            'original' : 127,
            'rotates' : 3
        }
    };

    this.renderGrid = function(config) {
        //'config' has a number of optional parameters, which include:
        //  scale - value to multiply the standard three scale by
        //  type - designates the field in gridpoints that states similar types
        //  asset_location - if a gridpoint has a folder assigned to its type,
        //    where to look. Requires the fs module to be installed.
        
        this.config = config;

        // get the DOM element to attach to
        // - assume we've got jQuery to hand
        var container = document.createElement('div');
        document.body.appendChild(container);

        var scene = new THREE.Scene();
		var group = new THREE.Object3D();
		
		scene.add(group);
		group.position.x = 0 - 100;
		group.position.y = 0 - 100;
		
		var targetMoveX = 0,
			targetMoveY = 0;
		var targetMoveXOnMouseDown = 0,
			targetMoveYOnMouseDown = 0;

		var mouseX = 0,
			mouseY = 0;
		var mouseXOnMouseDown = 0,
			mouseYOnMouseDown = 0;
		
		var windowHalfX = WIDTH / 2;
		var windowHalfY = HEIGHT / 2;
        
        for (var gridX=0;gridX<grid.length;gridX++) {
            for (var gridY=0;gridY<grid[gridX].length;gridY++) {
				var shape_temp;
                grid[gridX][gridY].shape = this.findShape(gridX,gridY, true);
                try {
                    var test = fs.open(this.config.asset_location + "/" + grid[gridX][gridY].shape + '.js', 'r')
                    if (test) {
                        jsonLoader.load(this.config.asset_location + "/" + grid[gridX][gridY].shape + '.js',addModelToScene);
                        console.log('Somehow loading a model!');
                    }
                } catch(err) { //We didn't find the file, so lookup how to draw it, then extrude
                    shape_temp = this.drawShape(grid[gridX][gridY].shape);
                    addModelToScene(shape_temp, {color: grid[gridX][gridY].color, wireframe: true}, {'x':gridX,'y':gridY});
                }
            }
        }
		
        // create a WebGL renderer, camera
        // and a scene
        var renderer = new THREE.WebGLRenderer();
        var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                        ASPECT,
                                        NEAR,
                                        FAR  );
        document.addEventListener('change', render);
		
        // the camera starts at 0,0,0 so pull it back
        camera.position.z = 500;
		camera.position.x = 0;
        camera.position.y = 0;

        // start the renderer
		renderer.setClearColor(0xf0f0f0);
        renderer.setSize(WIDTH, HEIGHT);

        // and the camera
        scene.add(camera);

        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        scene.add(pointLight);

        // draw!
		container.appendChild(renderer.domElement);
		
		document.addEventListener('mousedown', onDocumentMouseDown, false);
		document.addEventListener('touchstart', onDocumentTouchStart, false);
		document.addEventListener('touchmove', onDocumentTouchMove, false);
			
        animate();
		
        console.log('rendered!');
    
        return renderer;
        
        function render() {
			camera.position.y += (10 * targetMoveY - camera.position.y) * .05;
			camera.position.x -= (10 * targetMoveX + camera.position.x) * .05;
            renderer.render(scene, camera);
        }
        function animate() {
            requestAnimationFrame(animate);
			render();
        }
		function addModelToScene(geometry, materials, position) {
			var material = new THREE.MeshBasicMaterial(materials);
			var model = new THREE.Mesh(geometry, material);
			console.log('Putting mesh at ' + position.x * 7 + ', ' + position.y * 7);
			model.scale.set(SCALE, SCALE, SCALE / 2); //Just for looks, halve heights
			model.position.set(position.x * 6 * SCALE, position.y * 6 * SCALE, 0); //For some reason 6 is the magic number
			group.add(model);
		}
		function onDocumentMouseDown(event) {
			event.preventDefault();

			document.addEventListener('mousemove', onDocumentMouseMove, false);
			document.addEventListener('mouseup', onDocumentMouseUp, false);
			document.addEventListener('mouseout', onDocumentMouseOut, false);

			mouseXOnMouseDown = event.clientX - windowHalfX;
			mouseYOnMouseDown = event.clientY - windowHalfY;
			targetMoveXOnMouseDown = targetMoveX;
			targetMoveYOnMouseDown = targetMoveY;
		}

		function onDocumentMouseMove(event) {
			mouseX = event.clientX - windowHalfX;
			mouseY = event.clientY - windowHalfY;
			targetMoveX = targetMoveXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
			targetMoveY = targetMoveYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
		}

		function onDocumentMouseUp(event) {
			document.removeEventListener('mousemove', onDocumentMouseMove, false);
			document.removeEventListener('mouseup', onDocumentMouseUp, false);
			document.removeEventListener('mouseout', onDocumentMouseOut, false);
		}

		function onDocumentMouseOut(event) {
			document.removeEventListener('mousemove', onDocumentMouseMove, false);
			document.removeEventListener('mouseup', onDocumentMouseUp, false);
			document.removeEventListener('mouseout', onDocumentMouseOut, false);
		}

		function onDocumentTouchStart(event) {
			if (event.touches.length == 1) {
				event.preventDefault();
				mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
				mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
				targetMoveXOnMouseDown = targetMoveX;
				targetMoveYOnMouseDown = targetMoveY;
			}
		}

		function onDocumentTouchMove(event) {
			if (event.touches.length == 1) {
				event.preventDefault();
				mouseX = event.touches[0].pageX - windowHalfX;
				targetMoveX = targetMoveYOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
				mouseY = event.touches[0].pageY - windowHalfY;
				targetMoveY = targetMoveYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.05;
			}
		}
    }
    
    this.findShape = function(shapeX, shapeY, checkCorners) {
        //Returns any of the 255* possible shapes that a tile might take given
        //its surrounding siblings.
		//Params:
		//(integers) shapeX, shapeY: the coordinates of the shape on the map tile.
		//(boolean) checkCorners: if true, our check for siblings will ignore
		//	potential siblings diagonally if there are no siblings next to the
		//	corner. Makes for neater drawings.
		
		//The number of a specific shape when converted to binary refers
        //to each of the eight surrounding tiles starting from the top-left and
        //moving clockwise:
        //1 2 3             0 1 1
        //8 X 4 = 12345678  1 X 0 = 01100101 = 101
        //7 6 5             0 1 0

        //*Actually an unknown lesser number, as if any corner point does not
        //have sibling gridpoints touching it, it turns itself off, because it
        //will not affect the shape of the center point, the one we care about.
        var shape = '';
        var binaryArray = [];
        var cornersRef = [6, 4, 2, 0]; //These ones are in the corners
        //Because the grid is arranged in HTML-render order to ease my mind at
        //a later date, y is inverted from the traditional thinking--higher
        //numbers are lower down.
        var siblings = [
            {
                "x" : shapeX-1,
                "y" : shapeY-1
            }, //1
            {
                "x" : shapeX,
                "y" : shapeY-1
            }, //2
            {
                "x" : shapeX+1,
                "y" : shapeY-1
            }, //3
            {
                "x" : shapeX+1,
                "y" : shapeY
            }, //4
            {
                "x" : shapeX+1,
                "y" : shapeY+1
            }, //5
            {
                "x" : shapeX,
                "y" : shapeY+1
            }, //6
            {
                "x" : shapeX-1,
                "y" : shapeY+1
            }, //7
            {
                "x" : shapeX-1,
                "y" : shapeY
            } //8
        ];
        
        //Now we look through our submitted grid and mark which tiles around
        //each tile have the same parent, are a parent of, or are a child of
        for (var i=0;i<8;i++) {
            if (this.grid[siblings[i].x]
                && this.grid[siblings[i].x][siblings[i].y]
                && this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('id')
                && (
                    (this.grid[shapeX][shapeY].hasOwnProperty('parentid')
                        && (this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('parentid')
                            && this.grid[siblings[i].x][siblings[i].y].parentid
                                == this.grid[shapeX][shapeY].parentid
                            ) || this.grid[siblings[i].x][siblings[i].y].id
                                == this.grid[shapeX][shapeY].parentid
                        ) || (this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('parentid')
                        && this.grid[siblings[i].x][siblings[i].y].parentid
                            == this.grid[shapeX][shapeY].id
                        )
                    )
                ) {
				//Yes, there is a sibling in that corner.
                binaryArray.push(1);
            } else {
				//Nope, no sibling.
                binaryArray.push(0);
            }
        }
        
        //If the option is marked, we can eliminate corner pieces that also
        //don't have siblings around them, as this means they won't be touching
        //our "center" tiles 
        if (checkCorners === true) {
            for (var j=0;j<8;j++) {
                if (binaryArray[j] === 1
                    && cornersRef.indexOf(j) > -1
                    && (binaryArray[(j + 1) % 8] === 0 || binaryArray[(j - 1) % 8] === 0)
                    ) {
                    binaryArray[j] = 0;
                }
            }
        }
        
        shape = binaryArray.join('');

        shape = parseInt(shape, 2);
        console.log ('Shape in integer for ' + shapeX + ',' + shapeY + ' is ' + shape);
        
        return shape;
    }
    
    this.drawShape = function(shape) {
		//Returns threeGeometry object extruded from a drawn shape.
		//Params:
		//(integer) shape, the ID of the shape to be pulled from this.shapesLookup,
		//	which describes the coordinates of a shape to be drawn.
        console.log('Drawing shape!');
		var shapePoints = [];
		var shape_array = [];
		var parentShape = {};
		var threeShape,
			threeGeometry;
		var extrusionSettings = {
			amount : 6,
			curveSegments : 3,
			bevelThickness : 1,
			bevelSize : 2,
			bevelEnabled : false,
			material : 0,
			extrudeMaterial : 1
		}; //These will be customized more at a later date, probably specific
		//to the tile type.
    
        if (this.rotateLookup.hasOwnProperty(shape)) {
			//Look in the rotate lookup to see if this shape is one of our
			//default shapes, just rotated. If so, run that shape for our
			//coordinates, then rotate the amount our original shape says to
			//in the rotate lookup.
            shapeRef = this.rotateLookup[shape];
			shape_array = this.shapesLookup[shapeRef.original]; //Get our array of coords.
			if (shape && shape == 16) {
				console.log('Shape array is (' + shape_array[0].x+','+shape_array[0].y+')(' + shape_array[1].x+','+shape_array[1].y+')(' + shape_array[2].x+','+shape_array[2].y+')(' + shape_array[3].x+','+shape_array[3].y+')');
			}
			shapePoints = this.getShapePoints(shapeRef.original, shapeRef.rotates );
        } else {
			shapePoints = this.getShapePoints(shape, 0);
		}
        
        threeShape = new THREE.Shape(shapePoints);        
		threeGeometry = threeShape.extrude(extrusionSettings);
            
        return threeGeometry;
    }
	
	this.getShapePoints = function(shape, rotates) {
		//Returns an array of three.js vectors
		//Params:
		//(integer) shape, the ID of the shape to be pulled from this.shapesLookup,
		//	which describes the coordinates of a shape to be drawn.
		//(integer) rotates, how many times to rotate each coordinate 90 before
		//	drawing.
		var coordsArray = [];
		var shapePoints = [];
		
		try {
			coordsArray = this.shapesLookup[shape]; //Get our array of coords.
		} catch(error) {
			console.log(error);
		}
		for (var k=0;k<coordsArray.length;k++) {
			var coords = {}
			if (rotates > 0) {
				//If our "parent" shape needs to be rotated to match our desired
				//shape, we need to rotate each individual coordinate.
				coords = rotate(coordsArray[k].x, coordsArray[k].y, 3, 3, 90 * (rotates));
			} else {
				coords = coordsArray[k];
			}
			shapePoints.push(new THREE.Vector2(coords.x, coords.y));
		}
		
		return shapePoints;
	}
	
	function rotate(x, y, xm, ym, a) {
		//Returns an object with .x and .y that have been rotated a degrees with
		//	midpoint at xm and ym.
		var cos = Math.cos,
			sin = Math.sin,

			a = a * Math.PI / 180, // Convert to radians because that's what
								   // JavaScript likes

			// Subtract midpoints, so that midpoint is translated to origin
			// and add it in the end again
			xr = (x - xm) * cos(a) - (y - ym) * sin(a) + xm,
			yr = (x - xm) * sin(a) + (y - ym) * cos(a) + ym;

		return {'x':Math.round(xr), 'y':Math.round(yr)};
	}
    
    return this;
}
