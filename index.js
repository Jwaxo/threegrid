module.exports = function(grid) {
    //'grid' must be a sequentially-keyed array of sequentially-keyed arrays
    //  that correspond to some sort of grid. So grid[3][4] refers to a
    //  gridpoint that is three to the right and four below the top-left of
    //  the rendering field, viewed from the top-down.

    THREE = require('three'); //Assigns the renderer to THREE automatically
    fs = require('fs');
    
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
        '8' : {
            'original' : 1,
            'rotates' : 2
        },
        '40' : {
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
        '130' : {
            'original' : 5,
            'rotates' : 1
        },
        '160' : {
            'original' : 5,
            'rotates' : 2
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
        //      where to look. Requires the fs module to be installed.
        
        this.config = config;
        
        var WIDTH = 800,
            HEIGHT = 600;

        // set some camera attributes
        var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 0.1,
            FAR = 10000;

        // get the DOM element to attach to
        // - assume we've got jQuery to hand
        var container = document.createElement('div');
        document.body.appendChild(container);

        // create a WebGL renderer, camera
        // and a scene
        var renderer = new THREE.WebGLRenderer();
        var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                        ASPECT,
                                        NEAR,
                                        FAR  );
        this.scene = new THREE.Scene();
        var shape_temp;

        // the camera starts at 0,0,0 so pull it back
        camera.position.z = 300;

        // start the renderer
        renderer.setSize(WIDTH, HEIGHT);

        // attach the render-supplied DOM element
        container.appendChild(renderer.domElement);
        
        for (var x=0;x<grid.length;x++) {
            for (var y=0;y<grid[x].length;y++) {
                grid[x][y].shape = this.findShape(x,y, false);
                try {
                    var test = fs.open(this.config.asset_location + "/" + grid[x][y].shape + '.js', 'r')
                    if (test) {
                        jsonLoader.load(this.config.asset_location + "/" + grid[x][y].shape + '.js',this.addModelToScene);
                    }
                } catch(err) { //We didn't find the file, so lookup how to draw it, then extrude
                    shape_temp = this.drawShape(grid[x][y].shape);
                    this.addModelToScene(shape_temp, new THREE.MeshLambertMaterial({color: 0xCC0000}), {'x':x,'y':y});
                }
            }
        }
    
        // create the sphere's material
        var sphereMaterial = new THREE.MeshLambertMaterial(
        {
            color: 0xCC0000
        });

        // set up the sphere vars
        var radius = 50, segments = 16, rings = 16;

        // create a new mesh with sphere geometry -
        // we will cover the sphereMaterial next!
        var sphere = new THREE.Mesh(
           new THREE.SphereGeometry(radius, segments, rings),
           sphereMaterial);

        // add the sphere to the scene
        this.scene.add(sphere);

        // and the camera
        this.scene.add(camera);

        // create a point light
        var pointLight = new THREE.PointLight( 0xFFFFFF );

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        this.scene.add(pointLight);

        // draw!
        renderer.render(this.scene, camera);
        console.log('rendered!');
    
        return renderer;
    }
    
    this.findShape = function(x,y,checkCorners) {
        //Returns any of the 255* possible shapes that a tile might take given
        //its surrounding siblings. The number when converted to binary refers
        //to each of the eight surrounding tiles starting from the top-left and
        //moving clockwise:
        //1 2 3             0 1 1
        //8 X 4 = 87654321  1 X 0 = 10100110 = 166
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
        
        shape = binaryArray.reverse().join('');

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
            console.log('adding coordinate '+shape_array[i].x+','+shape_array[i].y);
            shapePoints.push(new THREE.Vector2(shape_array[i].x, shape_array[i].y));
        }
        
        var threeShape = new THREE.Shape(shapePoints );
        
        var extrusionSettings = {
            size: 30, height: 4, curveSegments: 3,
            bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
            material: 0, extrudeMaterial: 1
        };
        
        var threeGeometry = new THREE.ExtrudeGeometry(threeShape, extrusionSettings);
            
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

            return {'x':xr, 'y':yr};
        }
    }
    this.addModelToScene = function(geometry, materials, position) {
        var material = new THREE.MeshFaceMaterial( materials );
        var model = new THREE.Mesh( geometry, material );
        model.position.set(position.x*7,position.y*7,0);
        model.scale.set(10,10,10);
        this.scene.add( model );
    }
    
    
    return this;
}
