// This is a temporary solution. The API call that holds this data is the bottleneck in terms of time, so storing it here is the quick-and-dirty solution.
// TODO: Change this to self-update with time, and to have this information stored within a database.
function getArrayPossibleContests() {
	const possibleContests = [100002,100069,100078,100085,100084,100095,100107,100109,100113,100114,100125,100134,100151,100155,100182,100184,100191,100190,100253,100257,100269,100273,100283,100285,100287,100286,100291,100299,100307,100405,100438,100443,100500,100503,100507,100513,100519,100526,100531,100536,100543,100548,100553,100554,100609,100610,100623,100622,100625,100624,100641,100643,100642,100645,100644,100647,100646,100648,100651,100650,100676,100685,100712,100714,100719,100721,100723,100722,100725,100726,100729,100753,100765,100781,100783,100784,100791,100790,100792,100795,100801,100800,100803,100811,100810,100814,100819,100820,100825,100827,100829,100851,100861,100860,100863,100864,100867,100866,101002,101061,101086,101102,101128,101137,101142,101147,101158,101161,101164,101173,101175,101174,101177,101190,101194,101196,101201,101205,101206,101208,101221,101239,101243,101242,101246,101252,101291,101309,101308,101334,101350,101388,101398,101404,101409,101408,101411,101410,101413,101412,101415,101414,101461,101463,101462,101464,101467,101468,101471,101470,101473,101472,101481,101480,101482,101485,101487,101490,101498,101503,101505,101504,101512,101516,101519,101518,101549,101550,101555,101554,101557,101556,101561,101564,101573,101572,101585,101597,101606,101608,101611,101612,101615,101617,101620,101623,101630,101635,101649,101648,101651,101650,101653,101652,101655,101657,101656,101667,101666,101669,101670,101673,101775,101801,101810,101840,101853,101856,101873,101889,101908,101911,101915,101933,101955,101954,101964,101972,101981,101982,101987,101986,101991,101992,102001,102004,102007,102006,102012,102014,102021,102028,102040,102056,102082,102219,102263,102267,102346,102348,102392,102411,102423,102428,102433,102452,102460,102465,102471,102470,102483,102482,102501,102500,102511,102780,102785,102788,102791,102835,102861,102881,102890,102896,102900,102920,102966,102992,103049,103069,103081,103102,103119,103185,103202,103274,103306,103373,103388,103409,103415,103427,103428,103430,103438,103443,103447,103446,103466,103470,103492,103640,103708,103821,103828,103861,103940,103957,103960,103990,103993,104011,104013,104012,104015,104017,104021,104020,104023,104022,104030,104059,104064,104077,104076,104090,104114,104118,104120,104128,104147,104160,104172,104196,104252,104270,104288,104373,104375,104393,104412,104426,104447,104452,104454,104466,104468,104487,104493,104544,104555,104566,104587,104596,104603,104614,104619,104633,104639,104651,104666,104668,104670,104673,104686,104713,104736,104757,104758,104767,104772,104777,104783,104782,104785,104784,104787,104791,104790,104805,104821,104822,104832,104842,104847,104849,104848,104854,104857,104869,104871,104873,104875,104874,104891,104901,104945,104976,104990,105020,105053,105112,105139,105164,105190,105216,105223,105230,105242,105255,105254,105264,105316,105319,105321,105358,105383,105387,105394,105408,105427,105431,105437,105442,105444,105446,105459,105465,105472,105484,105487,105486,105493,105492,105494,105505];

	return possibleContests;
}

module.exports = { getArrayPossibleContests };