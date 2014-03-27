module.exports = function(grid) {
    //'grid' must be a sequentially-keyed array of sequentially-keyed arrays
    //that correspond to some sort of grid. So grid[3][4] refers to a gridpoint
	//that is three to the right and four below the top-left of the rendering
	//field, viewed from the top down.

    THREE = require('three'); //Assigns the renderer to THREE automatically
    THREE.OrbitControls = require('./OrbitControls.js');
	
	var WIDTH = 1200,
		HEIGHT = 800,
		SCALE = 10;

	// set some camera attributes
	var VIEW_ANGLE = 45,
		ASPECT = WIDTH / HEIGHT,
		NEAR = 0.1,
		FAR = 10000;
    
    fs = require('fs'); //fs is used to load physical models, located in the
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
		
		var targetRotationX = 0,
			targetRotationY = 0;
		var targetRotationXOnMouseDown = 0,
			targetRotationYOnMouseDown = 0;

		var mouseX = 0,
			mouseY = 0;
		var mouseXOnMouseDown = 0,
			mouseYOnMouseDown = 0;
		
		var windowHalfX = WIDTH / 2;
		var windowHalfY = HEIGHT / 2;
		
        var shape_temp;
        
        for (var x=0;x<grid.length;x++) {
            for (var y=0;y<grid[x].length;y++) {
                grid[x][y].shape = this.findShape(x,y, true);
                try {
                    var test = fs.open(this.config.asset_location + "/" + grid[x][y].shape + '.js', 'r')
                    if (test) {
                        jsonLoader.load(this.config.asset_location + "/" + grid[x][y].shape + '.js',addModelToScene);
                        console.log('Somehow loading a model!');
                    }
                } catch(err) { //We didn't find the file, so lookup how to draw it, then extrude
                    shape_temp = this.drawShape(grid[x][y].shape);
                    addModelToScene(shape_temp, {color: grid[x][y].color, wireframe: true}, {'x':x,'y':y});
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
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        document.addEventListener('change', render);
		
        // the camera starts at 0,0,0 so pull it back
        camera.position.z = 500;
		camera.position.x = 150;
        camera.position.y = 150;

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
		
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			
        animate();
		
        console.log('rendered!');
    
        return renderer;
        
        function render() {
			group.rotation.x += (targetRotationY - group.rotation.x) * 0.05;
			group.rotation.y += (targetRotationX - group.rotation.y) * 0.05;
            renderer.render(scene, camera);
        }
        function animate() {
            requestAnimationFrame(animate);
            //controls.update();
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
			targetRotationXOnMouseDown = targetRotationX;
			targetRotationYOnMouseDown = targetRotationY;
		}

		function onDocumentMouseMove(event) {
			mouseX = event.clientX - windowHalfX;
			mouseY = event.clientY - windowHalfY;
			targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
			targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
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
				mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
				mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
				targetRotationXOnMouseDown = targetRotationX;
				targetRotationYOnMouseDown = targetRotationY;
			}
		}

		function onDocumentTouchMove(event) {
			if (event.touches.length == 1) {
				event.preventDefault();
				mouseX = event.touches[0].pageX - windowHalfX;
				targetRotationX = targetRotationYOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
				mouseY = event.touches[0].pageY - windowHalfY;
				targetRotationY = targetRotationYOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.05;
			}
		}
    }
    
    this.findShape = function(x, y, checkCorners) {
        //Returns any of the 255* possible shapes that a tile might take given
        //its surrounding siblings. The number when converted to binary refers
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
        var cornersRef = [6,4,2,0]; //These ones are in the corners
        //Because the grid is arranged in HTML-render order to ease my mind at
        //a later date, y is inverted from the traditional thinking--higher
        //numbers are lower down.
        var siblings = [
            {
                "x" : x-1,
                "y" : y-1
            }, //1
            {
                "x" : x,
                "y" : y-1
            }, //2
            {
                "x" : x+1,
                "y" : y-1
            }, //3
            {
                "x" : x+1,
                "y" : y
            }, //4
            {
                "x" : x+1,
                "y" : y+1
            }, //5
            {
                "x" : x,
                "y" : y+1
            }, //6
            {
                "x" : x-1,
                "y" : y+1
            }, //7
            {
                "x" : x-1,
                "y" : y
            } //8
        ];
        
        //Now we look through our submitted grid and mark which tiles around
        //each tile have the same parent, are a parent of, or are a child of
        for (var i=0;i<8;i++) {
            if (this.grid[siblings[i].x]
                && this.grid[siblings[i].x][siblings[i].y]
                && this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('id')
                && (
                    (this.grid[x][y].hasOwnProperty('parentid')
                        && (this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('parentid')
                            && this.grid[siblings[i].x][siblings[i].y].parentid
                                == this.grid[x][y].parentid
                            ) || this.grid[siblings[i].x][siblings[i].y].id
                                == this.grid[x][y].parentid
                        ) || (this.grid[siblings[i].x][siblings[i].y].hasOwnProperty('parentid')
                        && this.grid[siblings[i].x][siblings[i].y].parentid
                            == this.grid[x][y].id
                        )
                    )
                ) {
                binaryArray.push(1);
            } else {
                binaryArray.push(0);
            }
        }
        
        //If the option is marked, we can eliminate corner pieces that also
        //don't have siblings around them, as this means they won't be touching
        //our "center" tiles 
        if (checkCorners === true) {
            for (var i=0;i<8;i++) {
                if (binaryArray[i] === 1
                    && cornersRef.indexOf(i) > -1
                    && (binaryArray[(i+1)%8] === 0 || binaryArray[(i-1)%8] === 0)
                    ) {
                    binaryArray[i] = 0;
                }
            }
        }
        
        shape = binaryArray.join('');

        shape = parseInt(shape, 2);
        console.log ('Shape in integer for ' + x + ',' + y + ' is ' + shape);
        
        return shape;
    }
    
    this.drawShape = function(shape) {
        console.log('Drawing shape!');
        var shape_array = [];
        var shapePoints = [];
        var parentShape = {};
    
        if (this.rotateLookup.hasOwnProperty(shape)) {
            parentShape = this.rotateLookup[shape];
            shape = parentShape.original;
        }
        try {
            shape_array = this.shapesLookup[shape];
        } catch(error) {
            console.log (error);
        }
        for (var i=0;i<shape_array.length;i++) {
            if (parentShape.hasOwnProperty('rotates')) {
                shape_array[i] = rotate(shape_array[i].x, shape_array[i].y, 3, 3, 90 * (parentShape.rotates));
            }
            //console.log('adding coordinate '+shape_array[i].x+','+shape_array[i].y);
            shapePoints.push(new THREE.Vector2(shape_array[i].x, shape_array[i].y));
        }
        
        var threeShape = new THREE.Shape(shapePoints);
        
        var extrusionSettings = {
            amount: 6, curveSegments: 3,
            bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
            material: 0, extrudeMaterial: 1
        };
        
		var threeGeometry = threeShape.extrude(extrusionSettings);
            
        return threeGeometry;
    
        function rotate(x, y, xm, ym, a) {
            var cos = Math.cos,
                sin = Math.sin,

                a = a * Math.PI / 180, // Convert to radians because that's what
                                       // JavaScript likes

                // Subtract midpoints, so that midpoint is translated to origin
                // and add it in the end again
                xr = (x - xm) * cos(a) - (y - ym) * sin(a)   + xm,
                yr = (x - xm) * sin(a) + (y - ym) * cos(a)   + ym;

            return {'x':Math.round(xr), 'y':Math.round(yr)};
        }
    }    
    
    return this;
}
