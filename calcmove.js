var calcMove = function (x,y,game) {

	// check that space is unoccupied
	if (game.brdstate[x][y] != "e") {
		game.message = "That space is already occupied, move somewhere else.";
		return game;
	}

	// check for ko
	if (game.ko.isko) {
		if (game.ko.x == x) {
			if (game.ko.y == y) {
				game.message = "That space is \"KO\", move somewhere else.";
				return game;
			}
		}
	}

	// mark the move
	var t = "w";
	if (game.turn == "b") {t = "b";}
	game.brdstate[x][y] = t;

	//init dMatrix
	var dMatrix = new Array();
	for (var i = 0; i < 19; i++) {
		var dColumn = new Array();
		for (var j = 0; j < 19; j++) {
			dColumn[j] = "e";
		}
		dMatrix[i] = dColumn;
	}

	// assume all dead
	for (var i = 0; i < 19; i++) {
		for (var j = 0; j < 19; j++) {
			if (game.brdstate[i][j] != "e") {
				dMatrix[i][j] = "d";
				// console.log("mark dead = " + i + " " + j);
			}
		}
	}

	// Check each piece for an empty adjacent spot
	for (var d = 0; d < 19; d++) {
		for (var k = 0; k < 19; k++) {

			// ck north east south west
			if (game.brdstate[d][k] != "e") {
				var nk = k - 1; var sk = k + 1; var ed = d + 1; var wd = d - 1;
				if (nk >= 0) {
					if (game.brdstate[d][nk] == "e") {
						dMatrix[d][k] = "A";
					}
				}
				if (sk <= 18) {
					if (game.brdstate[d][sk] == "e") {
						dMatrix[d][k] = "A";
					}
				}
				if (wd >= 0) {
					if (game.brdstate[wd][k] == "e") {
						dMatrix[d][k] = "A";
					}
				}
				if (ed <= 18) {
					if (game.brdstate[ed][k] == "e") {
						dMatrix[d][k] = "A";
					}
				}
			}
		}
	}

	// ck for life through friends
	var changed = true;
	while(changed){
		changed = false;

		for (var d = 0; d < 19; d++) {
			for (var k = 0; k < 19; k++) {

				var nk = k - 1; var sk = k + 1; var ed = d + 1; var wd = d - 1;

				if (dMatrix[d][k] == "d") {
					if (nk >= 0) {
						if (game.brdstate[d][k] == game.brdstate[d][nk]) {
							if (dMatrix[d][nk] == "A") {
								dMatrix[d][k] = "A";
								changed = true;
							}
						}
					}

					if (sk <= 18) {
						if (game.brdstate[d][k] == game.brdstate[d][sk]) {
							if (dMatrix[d][sk] == "A") {
								dMatrix[d][k] = "A";
								changed = true;
							}
						}
					}

					if (ed <= 18) {
						if (game.brdstate[d][k] == game.brdstate[ed][k]) {
							if (dMatrix[ed][k] == "A") {
								dMatrix[d][k] = "A";
								changed = true;
							}
						}
					}

					if (wd >= 0) {
						if (game.brdstate[d][k] == game.brdstate[wd][k]) {
							if (dMatrix[wd][k] == "A") {
								dMatrix[d][k] = "A";
								changed = true;
							}
						}
					}
				} // end of tests
			} // end of inner loop
		}


	}


	// // check for survival of the move
	var survival = true;

	if (dMatrix[x][y] == "d") {
		console.log("in survival");
		var d = x;
		var k = y;
		survival = false;
		var nk = k - 1; var sk = k + 1; var ed = d + 1; var wd = d - 1;
		if (nk >= 0) {
			console.log(nk);
			if (game.brdstate[d][k] != game.brdstate[d][nk]) {
				if (dMatrix[d][nk] == "d") {
					// console.log("nk");
					dMatrix[d][k] = "A";
					survival = true;
				}
			}
		}

		if (sk <= 18) {
			if (game.brdstate[d][k] != game.brdstate[d][sk]) {
				if (dMatrix[d][sk] == "d") {
					// console.log("sk");
					dMatrix[d][k] = "A";
					survival = true;
				}
			}
		}

		if (ed <= 18) {
			if (game.brdstate[d][k] != game.brdstate[ed][k]) {
				if (dMatrix[ed][k] == "d") {
					// console.log("ed");
					dMatrix[d][k] = "A";
					survival = true;
				}
			}
		}

		if (wd >= 0) {
			if (game.brdstate[d][k] != game.brdstate[wd][k]) {
				if (dMatrix[wd][k] == "d") {
					// console.log("wd");
					dMatrix[d][k] = "A";
					survival = true;
				}
			}
		}
	}

	// for (var a =0;a<19;a++) {
	// 	console.log(dMatrix[a]);
	// }


	// // check for making of a KO
	if (survival) {
		//  count the dead
		var deadcount = 0;
		var deadx = 0;
		var deady = 0;
		for (var d = 0; d < 19; d++) {
			for (var k = 0; k < 19; k++) {
				if (dMatrix[d][k] == "d") {
					deadcount++;
					deadx = d;
					deady = k;
				}
			}
		}
		// determine the atari of last move if it killed just one, else ko = false
		if (deadcount == 1) {
			var d = deadx;
			var k = deady;
			game.ko.isko = true;

			// console.log( "ko = " + $scope.game.ko.isko + ", d= " + d + ", k= " + k);
			// console.log("x = " + x + ", y = " + y);
			// console.log("stone is " + $scope.game.brdState[x][y]);

			var nk = y - 1; var sk = y + 1; var ed = x + 1; var wd = x - 1;
			// console.log("nk = " + $scope.game.brdState[x][nk] + " " + x + " " + nk +
			// 	", sk = " + $scope.game.brdState[x][sk] + " " + x + " " + sk +
			// 	", ed = " + $scope.game.brdState[ed][y] + " " + ed + " " + y +
			// 	", wd = " + $scope.game.brdState[wd][y] + " " + wd + " " + y );

			if (nk >= 0) {
				if (game.brdstate[x][nk] == "e") {
					game.ko.isko = false;
				}
			}
			if (sk <= 18) {
				if (game.brdstate[x][sk] == "e") {
					game.ko.isko = false;
				}
			}
			if (ed <= 18) {
				if (game.brdstate[ed][y] == "e") {
					game.ko.isko = false;
				}
			}
			if (wd >= 0) {
				if (game.brdstate[wd][y] == "e") {
					game.ko.isko = false;
				}
			}
			if (game.ko.isko) {
				game.ko.x = d;
				game.ko.y = k;
			}
		} else {
			game.ko.isko = false;
		}
	}

	if (survival) {

//toggle the turn, you are finished, congratulations
if ( t == "w") {
  game.turn = "b";
  game.message = "Black's turn";
} else {
  game.turn = "w";
  game.message = "White's turn";
}

		for (var d = 0; d < 19; d++) {
			for (var k = 0; k < 19; k++) {
				if (dMatrix[d][k] == "d") {
					game.brdstate[d][k] = "e";
					if (t == "w") {
						game.blackdead++;
					} else {
						game.whitedead++;
					}
				}
			}
		}
	} else {
		game.brdstate[x][y] = "e";
		game.message = "suicide is not allowed";
	}
	return game;
}