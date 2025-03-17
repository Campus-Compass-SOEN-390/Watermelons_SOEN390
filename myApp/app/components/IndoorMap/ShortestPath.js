export function dijkstra(graph, startNode, endNode, isDisabled) {
  // this keeps of the distance from the start node to every other node 
  let distances = {};
  // stores the previous node leading to the shortest path
  let previousNodes = {};
  // keeps track of nodes that have not been visited yet. initialised with all nodes in the graph
  let unvisitedNodes = new Set(Object.keys(graph));

  // Initialize distances and previous nodes
  for (let node of unvisitedNodes) {
    // initially, all nodes have a distance of infinity
    distances[node] = Infinity;
    // initialy, every nodes previous node is null
    previousNodes[node] = null;
  }
  distances[startNode] = 0;

  // while there are still univisited nodes
  while (unvisitedNodes.size > 0) {
    // Get the node with the smallest distance by using .reduce(). Ensures that we always expand the shortest known path
    let currentNode = [...unvisitedNodes].reduce((a, b) =>
      distances[a] < distances[b] ? a : b, null
    );

    // this removes the current Node from the unvisited nodes
    unvisitedNodes.delete(currentNode);

    // Stop if we reach the end node
    if (currentNode === endNode) break;

    // for each neighbour of our current node (connected_tos), check if going through currentNode provides a shorter path
    for (let neighbor in graph[currentNode]) {
      if (
        isDisabled && 
        (neighbor.includes("stair") || neighbor.includes("escalator")) && 
        !(neighbor.includes("path") || neighbor.includes("elevator"))
      ) {
        console.log(neighbor)
        continue; // Skip this neighbor
      }
      let weight = graph[currentNode][neighbor];
      let newDistance = distances[currentNode] + weight;

      // if new distance is shorter than existing record, replace it. 
      // new distance is from startNode -> currentNode -> neighbour
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previousNodes[neighbor] = currentNode;
      }
    }
  }

  // Reconstruct shortest path, going backwards
  let path = [];
  let currentNode = endNode;
  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }

  return path.length > 1 ? path : null; // Return path if found
}
