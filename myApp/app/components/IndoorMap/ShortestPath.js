import Graph from "./Graphs/Graph";

export function dijkstra(graph, startNode, endNode) {
  let distances = {};
  let previousNodes = {};
  let unvisitedNodes = new Set(Object.keys(graph));

  // Initialize distances and previous nodes
  for (let node of unvisitedNodes) {
    distances[node] = Infinity;
    previousNodes[node] = null;
  }
  distances[startNode] = 0;

  while (unvisitedNodes.size > 0) {
    // Get the node with the smallest distance
    let currentNode = [...unvisitedNodes].reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );

    unvisitedNodes.delete(currentNode);

    // Stop if we reach the end node
    if (currentNode === endNode) break;

    for (let neighbor in graph[currentNode]) {
      let weight = graph[currentNode][neighbor];
      let newDistance = distances[currentNode] + weight;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previousNodes[neighbor] = currentNode;
      }
    }
  }

  // Reconstruct shortest path
  let path = [];
  let currentNode = endNode;
  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }

  return path.length > 1 ? path : null; // Return path if found
}
