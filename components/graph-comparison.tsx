"use client"

import { TableHeader } from "@/components/ui/table"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { GraphExplanation } from "@/components/graph-explanation"

export function GraphComparison() {
  const [tabValue, setTabValue] = useState("comparison")

  return (
    <Card className="mt-8 border border-slate-200 dark:border-slate-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-800 dark:text-slate-200">Graph Algorithm Comparison & Details</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Compare different graph algorithms and understand their implementations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="bfs">BFS</TabsTrigger>
            <TabsTrigger value="dfs">DFS</TabsTrigger>
            <TabsTrigger value="dijkstra">Dijkstra</TabsTrigger>
            <TabsTrigger value="astar">A*</TabsTrigger>
            <TabsTrigger value="mst">MST</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300">Algorithm</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Time Complexity</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Space Complexity</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Weighted Graphs</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Negative Weights</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Finds Shortest Path</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Breadth-First Search (BFS)</TableCell>
                  <TableCell>O(V + E)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>Yes (unweighted)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Depth-First Search (DFS)</TableCell>
                  <TableCell>O(V + E)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Dijkstra's Algorithm</TableCell>
                  <TableCell>O((V + E) log V)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">A* Search</TableCell>
                  <TableCell>O(E)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Yes (with heuristic)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bellman-Ford</TableCell>
                  <TableCell>O(V × E)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Prim's Algorithm (MST)</TableCell>
                  <TableCell>O(E log V)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>No (finds MST)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Kruskal's Algorithm (MST)</TableCell>
                  <TableCell>O(E log E)</TableCell>
                  <TableCell>O(V)</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>No (finds MST)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-800 dark:text-slate-200">
                    When to use which algorithm?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-700 dark:text-slate-300">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>BFS:</strong> Finding shortest paths in unweighted graphs, level-by-level traversal, or
                      when target is close to source.
                    </li>
                    <li>
                      <strong>DFS:</strong> Exploring all paths, maze solving, cycle detection, or when memory is
                      limited.
                    </li>
                    <li>
                      <strong>Dijkstra:</strong> Finding shortest paths in weighted graphs with non-negative weights.
                    </li>
                    <li>
                      <strong>A*:</strong> When you have a good heuristic to guide search toward the target node.
                    </li>
                    <li>
                      <strong>Bellman-Ford:</strong> When graph may contain negative edge weights.
                    </li>
                    <li>
                      <strong>Prim's/Kruskal's:</strong> Finding minimum spanning tree in a connected, undirected graph.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-slate-800 dark:text-slate-200">Key Concepts</CardTitle>
                </CardHeader>
                <CardContent className="text-slate-700 dark:text-slate-300">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Graph Traversal:</strong> Visiting nodes in a specific order (BFS, DFS).
                    </li>
                    <li>
                      <strong>Shortest Path:</strong> Finding the path with minimum total weight between nodes.
                    </li>
                    <li>
                      <strong>Minimum Spanning Tree (MST):</strong> Subset of edges that connect all vertices with
                      minimum total weight.
                    </li>
                    <li>
                      <strong>Heuristic:</strong> Function that estimates the cost from current node to goal (used in
                      A*).
                    </li>
                    <li>
                      <strong>Relaxation:</strong> Process of updating the distance to a node if a shorter path is
                      found.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bfs">
            <GraphExplanation algorithm="bfs" />
          </TabsContent>

          <TabsContent value="dfs">
            <GraphExplanation algorithm="dfs" />
          </TabsContent>

          <TabsContent value="dijkstra">
            <GraphExplanation algorithm="dijkstra" />
          </TabsContent>

          <TabsContent value="astar">
            <GraphExplanation algorithm="astar" />
          </TabsContent>

          <TabsContent value="mst">
            <GraphExplanation algorithm="mst" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
