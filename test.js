var assert = require('assert');
var ThreeGrid = require('./index.js');

//First we need some sort of grid. Grids are arranged in an [x][y] fashion made
//up of sequential, positive integers, with 0,0 being the bottom-left corner,
//since JS can't have negative array keys without some major problems.

//The Y slot is ideally an object that stores more information about a give grid
//-point, such as relating a parent grid point (one of our built-in functions).

var grid = [
    [
        {
            "type" : "park",
            "id"   : "0"
        },
        {
            "type" : "park",
            "id"   : "1"
        },
        {
            "type" : "park",
            "id"   : "2"
        },
        {
            "type" : "road",
            "id"   : "3"
        },
        {
            "type" : "park",
            "id"   : "4"
        }
    ],
    [
        {
            "type" : "park",
            "id"   : "5"
        },
        {
            "type" : "school",
            "id"   : "6"
        },
        {
            "type" : "school",
            "id"   : "7",
            "parentid" : "6"
        },
        {
            "type" : "road",
            "id"   : "8",
            "parentid" : "3"
        },
        {
            "type" : "park",
            "id"   : "9"
        }
    ],
    [
        {
            "type" : "park",
            "id"   : "10"
        },
        {
            "type" : "school",
            "id"   : "11",
            "parentid" : "6"
        },
        {
            "type" : "park",
            "id"   : "12"
        },
        {
            "type" : "road",
            "id"   : "13",
            "parentid" : "3"
        },
        {
            "type" : "house",
            "id"   : "14",
            "parentid" : "19"
        }
    ],
    [
        {
            "type" : "park",
            "id"   : "15"
        },
        {
            "type" : "park",
            "id"   : "16"
        },
        {
            "type" : "park",
            "id"   : "17"
        },
        {
            "type" : "road",
            "id"   : "18",
            "parentid" : "3"
        },
        {
            "type" : "house",
            "id"   : "19"
        }
    ],
    [
        {
            "type" : "park",
            "id"   : "20"
        },
        {
            "type" : "park",
            "id"   : "21"
        },
        {
            "type" : "tree",
            "id"   : "22"
        },
        {
            "type" : "road",
            "id"   : "23",
            "parentid" : "3"
        },
        {
            "type" : "park",
            "id"   : "24"
        }
    ]
];

//Sheesh. The IDs are creator-defined as they may be determined by some means
//other than "what order in the array are you."

var config = {
    "size" : "0", //height/size multiplier
    "type" : "type", //what property we're calling the "grouper"
    "asset_location" : "./examples/shapes",
    "render_width" : "800", //view grid width in pixels
    "render_height" : "600" //view grid height in pixels
}

var map = new ThreeGrid(grid);

var renderedMap = map.renderGrid(config);


