var ThreeGrid = require('./index.js');

//This is all best tested using beefy, for in-browser stuff.
//More a personal note than anything.

//First we need some sort of grid. Grids are arranged in an [x][y] fashion made
//up of sequential, positive integers, with 0,0 being the bottom-left corner,
//since JS can't have negative array keys without some major problems.

//The Y slot is ideally an object that stores more information about a give grid
//-point, such as relating a parent grid point (one of our built-in functions).

var grid = [
    [
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "0"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "1"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "2"
        },
        {
            "type" : "road",
			"color": 0x000000,
            "id"   : "3"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "4"
        }
    ],
    [
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "5"
        },
        {
            "type" : "school",
			"color": 0xFFCC00,
            "id"   : "6"
        },
        {
            "type" : "school",
			"color": 0xFFCC00,
            "id"   : "7",
            "parentid" : "6"
        },
        {
            "type" : "road",
			"color": 0x000000,
            "id"   : "8",
            "parentid" : "3"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "9"
        }
    ],
    [
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "10"
        },
        {
            "type" : "school",
			"color": 0xFFCC00,
            "id"   : "11",
            "parentid" : "6"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "12"
        },
        {
            "type" : "road",
			"color": 0x000000,
            "id"   : "13",
            "parentid" : "3"
        },
        {
            "type" : "house",
			"color": 0xFF0000,
            "id"   : "14",
            "parentid" : "19"
        }
    ],
    [
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "15"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "16"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "17"
        },
        {
            "type" : "road",
			"color": 0x000000,
            "id"   : "18",
            "parentid" : "3"
        },
        {
            "type" : "house",
			"color": 0xFF0000,
            "id"   : "19"
        }
    ],
    [
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "20"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "21"
        },
        {
            "type" : "tree",
			"color": 0x00FFFF,
            "id"   : "22"
        },
        {
            "type" : "road",
			"color": 0x000000,
            "id"   : "23",
            "parentid" : "3"
        },
        {
            "type" : "park",
			"color": 0x00FF00,
            "id"   : "24"
        }
    ]
];

//Sheesh. The IDs are creator-defined as they may be determined by some means
//other than "what order in the array are you."

var config = {
    "size" : "0", //height/size multiplier if greater than 0
    "type" : "type", //what property we're calling the "grouper"
    "asset_location" : "./examples/shapes", //not used yet
    "render_width" : "1200", //view grid width in pixels
    "render_height" : "800" //view grid height in pixels
}

var map = new ThreeGrid(grid);

map.renderGrid(config);