var lat = 53.8338072;
var lon = 10.7001245;
var range = 0.02;

var map = document.querySelector('gn-map');

map.latitude = lat;
map.longitude = lon;
map.zoom = 17;

function findNodeWithShortestDistance(set) {
  var distance = Infinity;
  var shortestId = null;
  for (var id in set) {
    if (set[id].distance < distance) {
      distance = set[id].distance;
      shortestId = id;
    }
  }
  return nodeCache[shortestId];
}

function UCS(start, goal) {
  map.addMarker(start.lat, start.lon);
  map.addMarker(goal.lat, goal.lon);
  var node;
  var frontier = {};
  var explored = {};
  var maxSteps = 1000;
  node = start;
  node.distance = 0;
  frontier[node.id] = node;
  while (Object.keys(frontier).length > 0 && maxSteps > 0) {
    node = findNodeWithShortestDistance(frontier);
    delete frontier[node.id];
    if (node == goal) { // Draw found path
      var latLng = [];
      while (node.previous != undefined) {
        latLng.push({latitude: node.lat, longitude: node.lon});
        node = node.previous;
      }
      setTimeout(function() {
        map.addPolygon(latLng, 'red');
      }, 10000 - maxSteps * 10);
      return;
    }
    explored[node.id] = true;
    getNextNodes(node).forEach(function(n) {
      previous = node;
      distance = distanceInM(node, n);
      if (!(n.id in explored)) {
        if (!(n.id in frontier)) {
          frontier[n.id] = n;
          frontier[n.id].previous = previous;
          frontier[n.id].distance = distance;
        }
        else if (frontier[n.id].distance > distance) {
          frontier[n.id].previous = previous;
          frontier[n.id].distance = distance;
        }
      }

      var circle = [
        {latitude: node.lat, longitude: node.lon},
        {latitude: node.lat + 0.0001, longitude: node.lon + 0.0001}
      ];

      setTimeout(function() {
        map.addPolygon(circle, 2);
      }, 10000 - maxSteps * 10, circle);
    });
    maxSteps--;
  }
}

cacheOSMData(lat, lon, range, function() {
  map.addPolygon([ // Show loaded range
      {latitude: lat + range, longitude: lon - range},
      {latitude: lat + range, longitude: lon + range},
      {latitude: lat - range, longitude: lon + range},
      {latitude: lat - range, longitude: lon - range}
  ], 'green');

  alert('loaded!');
  // demo();
});

function demo() {
  var start = nodeCache[1949570796]; // AM1
  var goal = nodeCache[301451595]; // G64
  UCS(start, goal);
}
