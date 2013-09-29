#pragma strict

class Tile {
	var x : int;
	var z : int;
	var tilePlane : TilePlane;

	var state : String = 'empty';
	var content : Transform;

	// Not needed?
	/*
	private var adjacentVectors : Vector3[] = [
		Vector3(-1, 0, 0),
		Vector3(0, 0, 1),
		Vector3(1, 0, 0),
		Vector3(0, 0, -1)
	];
	*/

	private var surroundingVectors : Vector3[] = [
		Vector3(-1, 0, 0),
		Vector3(-1, 0, 1),
		Vector3(0, 0, 1),
		Vector3(1, 0, 1),
		Vector3(1, 0, 0),
		Vector3(1, 0, -1),
		Vector3(0, 0, -1),
		Vector3(-1, 0, -1)
	];

	function Tile(x : int, z : int, tilePlane : TilePlane) {
		this.x = x;
		this.z = z;
		this.tilePlane = tilePlane;
	}

	function IsEmpty() {
		return state == 'empty';
	}

	function IsFull() {
		return state == 'full';
	}

	function IsInside() {
		return state == 'inside';
	}

	function SetInside() {
		if (content != null) {
			tilePlane.Destroy(content.gameObject);
			content = null;
		}
		state = 'inside';
	}

	function IsWall() {
		return state == 'wall';
	}

	function NumAdjacent(state : String, adjacencyMatrix : Vector3[]) : int {
		var adjacent = 0;

		for (var i=0; i<adjacencyMatrix.length; i++) {
			var tile = tilePlane.TileAt(Vector3(x, 0, z) + adjacencyMatrix[i]);

			if (tile != null) {
				if (tile.state == state) {
					adjacent++;
				}
			} else {
				// Consider things outside the tile plane as "empty"
				if (state == 'empty') {
					adjacent++;
				}
			}
		}

		return adjacent;
	}

	function SetWall() {
		// Don't create a wall inside of an existing building.
		if (!IsInside()) {
			if (content != null) {
				tilePlane.Destroy(content.gameObject);
			}
			content = GameObject.CreatePrimitive(PrimitiveType.Cube).transform;
			content.position = Vector3(x+0.5, 0, z+0.5);
			content.renderer.material.SetColor("_Color", Color.blue);
			/*
			if (IsWall()) {
				for (var i=0; i<4; i++) {
					var tile1 = tilePlane.TileAt(Vector3(x, 0, z) + around[i]);
					var tile2 = tilePlane.TileAt(Vector3(x, 0, z) + around[(i+1)%4]);

					if (tile1 != null && tile2 != null && tile1.IsWall() && tile2.IsWall()) {
						//tilePlane.Destroy(content.gameObject);
						//content = tilePlane.Instantiate(GameObject.Find("BottomRight").transform);
					}
				}
			}
			*/
			state = 'wall';
		}
	}

	function MergeInside() {
		if (NumAdjacent('empty', surroundingVectors) == 0) {
			SetInside();
		}
	}

	function Add(content : Transform) {
		this.content = content;
		state = 'full';
	}

	function Create(content : Transform) {
		this.Add(tilePlane.Instantiate(content, Coordinates(), content.transform.rotation));
	}

	function Coordinates() {
		return Vector3(x, 0, z);
	}

	function Text() {
		var output = '?';
		switch (state) {
			case 'empty':
				output = '_';
				break;
			case 'wall':
				output = 'W';
				break;
			case 'inside':
				output = 'I';
				break;
		}
		return output;
	}
}
