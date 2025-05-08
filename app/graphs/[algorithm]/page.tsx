"use client"

import { useParams } from "next/navigation"
import { GraphExplanation } from "@/components/graph-explanation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GraphAlgorithmPage() {
  const params = useParams()
  const algorithm = params.algorithm as string

  const algorithmNames: Record<string, string> = {
    bfs: "Breadth-First Search (BFS)",
    dfs: "Depth-First Search (DFS)",
    dijkstra: "Dijkstra's Algorithm",
    astar: "A* Search Algorithm",
    mst: "Minimum Spanning Tree",
    topological: "Topological Sort",
  }

  const algorithmName = algorithmNames[algorithm] || "Graph Algorithm"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/graphs">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Graph Visualizer
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{algorithmName}</h1>
        <p className="text-muted-foreground mt-2">Detailed explanation, implementation, and analysis</p>
      </div>

      <GraphExplanation algorithm={algorithm} />
    </div>
  )
}
