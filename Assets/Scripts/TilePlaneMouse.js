#pragma strict

@script RequireComponent(Plane);

var currentTileCoordinate : Vector3;
var selectionCube : Transform;
var cursor : Transform;

private var tilePlane : TilePlane;
private var highlightedObject : GameObject;
private var movingObject : GameObject;
private var moving : boolean = false;

function Start() {
    tilePlane = GetComponent(TilePlane);
    //selectionCube.FindChild("model").collider.enabled = false;
}

function Update () {
    if (Input.GetMouseButtonUp(0) && moving) {
        moving = false;
        movingObject.SendMessage("UnGrab");
    }

	if (Input.GetMouseButtonDown(1)) {
		for (var child : Transform in cursor) {
			if (child.gameObject.name == "Model") {
				child.Rotate(Vector3.up, 90.0);
			}
		}
	}

	var hit: RaycastHit;
	var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	if (Physics.Raycast(ray, hit)) {
		var hitObject : GameObject = hit.collider.gameObject;

		if (tilePlane.IsEmpty(hit.point)) {
			cursor.position = tilePlane.Coordinates(hit.point);
		}

		if (Input.GetMouseButton(0)) {
			if (Input.GetMouseButtonDown(0)) {
				if (hitObject.tag == "Movable") {
					Debug.Log("grabbing object" + hitObject);
					Grab(hitObject);
				} else {
					Debug.Log("create building");
				}
			} else if (tilePlane.IsEmpty(hit.point)) {
				tilePlane.TileAt(hit.point).Add(cursor);
			}
		}
	}
}

function Grab(gameObject : GameObject) {
	moving = true;
	movingObject = gameObject;
	movingObject.SendMessage("Grab");
}
