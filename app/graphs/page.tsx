"use client"

import { useState } from "react"
import { GraphVisualizer } from "@/components/graph-visualizer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitCompare, Info } from "lucide-react"
import Link from "next/link"

export default function GraphPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bfs")

  // Update selected algorithm based on visualization
  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Pathfinding Algorithm Visualizer</h1>

      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">How to Use the Grid Visualizer</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click and drag to draw walls on the grid</li>
              <li>Click and drag the green cell to move the start position</li>
              <li>Click and drag the red cell to move the end position</li>
              <li>Select an algorithm from the dropdown menu</li>
              <li>Click "Start" to visualize the algorithm finding the shortest path</li>
              <li>Use "Random Walls" to generate a maze with random obstacles</li>
              <li>Use "Clear Grid" to reset everything</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <GraphVisualizer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Pathfinding Algorithms Explained
            </CardTitle>
            <CardDescription>
              Learn more about how pathfinding algorithms work and their implementation details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Pathfinding algorithms are essential for finding routes between points in a graph or grid. Each algorithm
              has unique properties that make it suitable for different scenarios.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link href="/graphs/bfs">
                <Button variant="outline" className="w-full justify-start">
                  <span>Breadth-First Search</span>
                </Button>
              </Link>
              <Link href="/graphs/dfs">
                <Button variant="outline" className="w-full justify-start">
                  <span>Depth-First Search</span>
                </Button>
              </Link>
              <Link href="/graphs/dijkstra">
                <Button variant="outline" className="w-full justify-start">
                  <span>Dijkstra's Algorithm</span>
                </Button>
              </Link>
              <Link href="/graphs/astar">
                <Button variant="outline" className="w-full justify-start">
                  <span>A* Search Algorithm</span>
                </Button>
              </Link>
            </div>
            <Link href={`/graphs/${selectedAlgorithm}`}>
              <Button>
                <Info className="h-4 w-4 mr-2" />
                View Current Algorithm Details
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compare All Pathfinding Algorithms</CardTitle>
            <CardDescription>
              See how different pathfinding algorithms compare in terms of time complexity, space complexity, and use
              cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Each pathfinding algorithm has its own strengths and weaknesses:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>
                <strong>BFS</strong>: Guarantees shortest path in unweighted graphs
              </li>
              <li>
                <strong>DFS</strong>: Explores as far as possible along each branch
              </li>
              <li>
                <strong>Dijkstra's</strong>: Finds shortest path in weighted graphs
              </li>
              <li>
                <strong>A*</strong>: Uses heuristics to find paths more efficiently
              </li>
            </ul>
            <Link href="/graphs/compare">
              <Button>
                <GitCompare className="h-4 w-4 mr-2" />
                Compare All Pathfinding Algorithms
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
