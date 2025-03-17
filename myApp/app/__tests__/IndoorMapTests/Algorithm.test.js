import { dijkstra } from "../../components/IndoorMap/ShortestPath";

describe("Dijkstra's Algorithm with Disabled Option", () => {
  const graph = {
    "A": { "B": 1, "stair-C": 1, "path-D-stairs": 2, "elevator-E": 3 },
    "B": { "A": 1, "C": 1 },
    "C": { "B": 1, "D": 2 },
    "D": { "C": 2, "E": 1 },
    "E": { "D": 1, "F": 3 },
    "F": { "E": 3 },
    "stair-C": { "A": 1, "D": 2 }, // Should be skipped if isDisabled is true
    "escalator-F": { "E": 1 }, // Should be skipped if isDisabled is true
    "path-D-stairs": { "A": 2, "D": 1 }, // Should NOT be skipped
    "elevator-E": { "A": 3, "E": 2 } // Should NOT be skipped
  };

  it("finds the shortest path normally (without disabling stairs/escalators)", () => {
    const result = dijkstra(graph, "A", "F", false);
    expect(result).toEqual(["A", "stair-C", "D", "E", "F"]);
  });

  it("avoids stairs/escalators when isDisabled is true", () => {
    const result = dijkstra(graph, "A", "F", true);
    expect(result).toEqual(["A", "path-D-stairs", "D", "E", "F"]);
  });

  it("includes paths and elevators even when isDisabled is true", () => {
    const result = dijkstra(graph, "A", "E", true);
    expect(result).toEqual(["A", "path-D-stairs", "D", "E"]);
  });

});
