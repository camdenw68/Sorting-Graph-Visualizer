"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, StepForward, RefreshCw, FastForward, SkipForward } from "lucide-react"

// Define grid cell types
type CellStatus = "empty" | "wall" | "start" | "end" | "visited" | "visiting" | "path"

type Cell = {
  row: number
  col: number
  status: CellStatus
  distance: number
  previous: { row: number; col: number } | null
}

type Grid = Cell[][]

export function GraphVisualizer() {
  const [grid, setGrid] = useState<Grid>([])
  const [algorithm, setAlgorithm] = useState<string>("bfs")
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(50) // Default speed is moderate
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({ rows: 20, cols: 40 })
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [steps, setSteps] = useState<any[]>([])
  const [startPosition, setStartPosition] = useState<{ row: number; col: number }>({ row: 5, col: 5 })
  const [endPosition, setEndPosition] = useState<{ row: number; col: number }>({ row: 15, col: 35 })
  const [isDrawingWalls, setIsDrawingWalls] = useState<boolean>(false)
  const [isErasingWalls, setIsErasingWalls] = useState<boolean>(false)
  const [isMovingStart, setIsMovingStart] = useState<boolean>(false)
  const [isMovingEnd, setIsMovingEnd] = useState<boolean>(false)
  const [wallDensity, setWallDensity] = useState<number>(20)
  const [message, setMessage] = useState<string>(
    "Select an algorithm and press Start, or draw walls by clicking and dragging on the grid",
  )
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize grid
  useEffect(() => {
    generateEmptyGrid()
  }, [gridSize])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Generate an empty grid
  const generateEmptyGrid = () => {
    const newGrid: Grid = []
    for (let row = 0; row < gridSize.rows; row++) {
      const currentRow: Cell[] = []
      for (let col = 0, colMax = gridSize.cols; col < colMax; col++) {
        currentRow.push({
          row,
          col,
          status: "empty",
          distance: Number.POSITIVE_INFINITY,
          previous: null,
        })
      }
      newGrid.push(currentRow)
    }

    // Set start and end positions
    if (startPosition.row < gridSize.rows && startPosition.col < gridSize.cols) {
      newGrid[startPosition.row][startPosition.col].status = "start"
    } else {
      const newStart = { row: Math.floor(gridSize.rows / 4), col: Math.floor(gridSize.cols / 4) }
      newGrid[newStart.row][newStart.col].status = "start"
      setStartPosition(newStart)
    }

    if (endPosition.row < gridSize.rows && endPosition.col < gridSize.cols) {
      newGrid[endPosition.row][endPosition.col].status = "end"
    } else {
      const newEnd = {
        row: Math.floor((3 * gridSize.rows) / 4),
        col: Math.floor((3 * gridSize.cols) / 4),
      }
      newGrid[newEnd.row][newEnd.col].status = "end"
      setEndPosition(newEnd)
    }

    setGrid(newGrid)
    setCurrentStep(0)
    setSteps([])
    setMessage("Select an algorithm and press Start, or draw walls by clicking and dragging on the grid")
  }

  // Generate random walls
  const generateRandomWalls = () => {
    const newGrid = JSON.parse(JSON.stringify(grid))

    // Clear existing walls first
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (newGrid[row][col].status === "wall") {
          newGrid[row][col].status = "empty"
        }
      }
    }

    // Add random walls
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (
          Math.random() < wallDensity / 100 &&
          newGrid[row][col].status !== "start" &&
          newGrid[row][col].status !== "end"
        ) {
          newGrid[row][col].status = "wall"
        }
      }
    }

    setGrid(newGrid)
  }

  
  // Reset the grid (keep walls)
  const resetGrid = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    const newGrid = JSON.parse(JSON.stringify(grid))

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (
          newGrid[row][col].status !== "wall" &&
          newGrid[row][col].status !== "start" &&
          newGrid[row][col].status !== "end"
        ) {
          newGrid[row][col].status = "empty"
        }
        newGrid[row][col].distance = Number.POSITIVE_INFINITY
        newGrid[row][col].previous = null
      }
    }

    setGrid(newGrid)
    setIsVisualizing(false)
    setIsPaused(false)
    setCurrentStep(0)
    setSteps([])
    setMessage("Select an algorithm and press Start, or draw walls by clicking and dragging on the grid")
  }

  // Clear the entire grid
  const clearGrid = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    generateEmptyGrid()
    setIsVisualizing(false)
    setIsPaused(false)
  }

  // Handle mouse events for drawing walls
  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizing && !isPaused) return

    const cell = grid[row][col]

    if (cell.status === "start") {
      setIsMovingStart(true)
      return
    }

    if (cell.status === "end") {
      setIsMovingEnd(true)
      return
    }

    if (cell.status === "wall") {
      setIsErasingWalls(true)
      const newGrid = JSON.parse(JSON.stringify(grid))
      newGrid[row][col].status = "empty"
      setGrid(newGrid)
    } else if (cell.status === "empty") {
      setIsDrawingWalls(true)
      const newGrid = JSON.parse(JSON.stringify(grid))
      newGrid[row][col].status = "wall"
      setGrid(newGrid)
    }
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (isVisualizing && !isPaused) return

    if (isMovingStart) {
      const newGrid = JSON.parse(JSON.stringify(grid))
      newGrid[startPosition.row][startPosition.col].status = "empty"
      newGrid[row][col].status = "start"
      setStartPosition({ row, col })
      setGrid(newGrid)
      return
    }

    if (isMovingEnd) {
      const newGrid = JSON.parse(JSON.stringify(grid))
      newGrid[endPosition.row][endPosition.col].status = "empty"
      newGrid[row][col].status = "end"
      setEndPosition({ row, col })
      setGrid(newGrid)
      return
    }

    if (isDrawingWalls && grid[row][col].status === "empty") {
      const newGrid = JSON.parse(JSON.stringify(grid))
      newGrid[row][col].status = "wall"
      setGrid(newGrid)
    } else if (isErasingWalls && grid[row][col].status === "wall") {
      const newGrid = JSON.parse(JSON.stringify(grid))
      newGrid[row][col].status = "empty"
      setGrid(newGrid)
    }
  }

  const handleMouseUp = () => {
    setIsDrawingWalls(false)
    setIsErasingWalls(false)
    setIsMovingStart(false)
    setIsMovingEnd(false)
  }

  // Check if a path exists between start and end
  const isPathPossible = () => {
    const visited = Array(gridSize.rows)
      .fill(false)
      .map(() => Array(gridSize.cols).fill(false))
    const queue = [{ row: startPosition.row, col: startPosition.col }]
    visited[startPosition.row][startPosition.col] = true

    while (queue.length > 0) {
      const { row, col } = queue.shift()!

      if (row === endPosition.row && col === endPosition.col) {
        return true
      }

      // Check all four directions
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]
      for (const [dr, dc] of directions) {
        const newRow = row + dr
        const newCol = col + dc

        if (
          newRow >= 0 &&
          newRow < gridSize.rows &&
          newCol >= 0 &&
          newCol < gridSize.cols &&
          !visited[newRow][newCol] &&
          grid[newRow][newCol].status !== "wall"
        ) {
          visited[newRow][newCol] = true
          queue.push({ row: newRow, col: newCol })
        }
      }
    }

    return false
  }

  // Get valid neighbors for a cell
  const getNeighbors = (grid: Grid, row: number, col: number) => {
    const neighbors = []
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc

      if (
        newRow >= 0 &&
        newRow < gridSize.rows &&
        newCol >= 0 &&
        newCol < gridSize.cols &&
        grid[newRow][newCol].status !== "wall"
      ) {
        neighbors.push(grid[newRow][newCol])
      }
    }

    return neighbors
  }

  // BFS algorithm
  const runBFS = () => {
    const steps: any[] = []
    const simulationGrid: Grid = JSON.parse(JSON.stringify(grid))

    // Initialize distances
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        simulationGrid[row][col].distance = Number.POSITIVE_INFINITY
        simulationGrid[row][col].previous = null
        // Keep existing status unless it's a visited/visiting/path status
        if (["visited", "visiting", "path"].includes(simulationGrid[row][col].status)) {
          simulationGrid[row][col].status = "empty"
        }
      }
    }

    simulationGrid[startPosition.row][startPosition.col].distance = 0
    const queue = [{ row: startPosition.row, col: startPosition.col }]
    const visited = new Set<string>()
    visited.add(`${startPosition.row},${startPosition.col}`)

    while (queue.length > 0) {
      const { row, col } = queue.shift()!
      
      // Skip if this is the start or end node
      if ((row === startPosition.row && col === startPosition.col) ||
          (row === endPosition.row && col === endPosition.col)) {
        continue
      }

      // Explicitly mark as visiting
      simulationGrid[row][col].status = "visiting"
      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Visiting cell at row ${row}, column ${col}`,
      })

      // Get neighbors
      const neighbors = getNeighbors(simulationGrid, row, col)
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`
        if (!visited.has(key)) {
          visited.add(key)
          queue.push({ row: neighbor.row, col: neighbor.col })
          simulationGrid[neighbor.row][neighbor.col].previous = { row, col }
          
          // Only mark as visiting if not start or end
          if (neighbor.row !== startPosition.row || neighbor.col !== startPosition.col) {
            if (neighbor.row !== endPosition.row || neighbor.col !== endPosition.col) {
              simulationGrid[neighbor.row][neighbor.col].status = "visiting"
            }
          }
        }
      }

      // After processing neighbors, mark current as visited
      simulationGrid[row][col].status = "visited"
      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Finished visiting cell at row ${row}, column ${col}`,
      })
    }

    // Mark path at the end
    if (simulationGrid[endPosition.row][endPosition.col].previous) {
      let current = { row: endPosition.row, col: endPosition.col }
      const path = []
      
      while (current.row !== startPosition.row || current.col !== startPosition.col) {
        path.push(current)
        current = simulationGrid[current.row][current.col].previous!
      }

      // Mark path
      for (const { row, col } of path.reverse()) {
        simulationGrid[row][col].status = "path"
        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Adding cell at row ${row}, column ${col} to the path`,
        })
      }
    }

    return steps
  }

  // DFS algorithm
  const runDFS = () => {
    const steps: any[] = []
    const simulationGrid: Grid = JSON.parse(JSON.stringify(grid))

    // Initialize distances
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        simulationGrid[row][col].distance = Number.POSITIVE_INFINITY
        simulationGrid[row][col].previous = null
      }
    }

    simulationGrid[startPosition.row][startPosition.col].distance = 0

    const visited = new Set<string>()
    let foundEnd = false

    // DFS recursive function
    const dfs = (row: number, col: number, depth: number) => {
      if (foundEnd) return

      const key = `${row},${col}`
      visited.add(key)

      // Mark as visiting
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visiting"
      }

      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Visiting cell at row ${row}, column ${col} (depth: ${depth})`,
      })

      // If we found the end
      if (row === endPosition.row && col === endPosition.col) {
        foundEnd = true
        return
      }

      // Get neighbors
      const neighbors = getNeighbors(simulationGrid, row, col)

      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`

        if (!visited.has(neighborKey)) {
          // Update distance and previous
          simulationGrid[neighbor.row][neighbor.col].distance = depth + 1
          simulationGrid[neighbor.row][neighbor.col].previous = { row, col }

          dfs(neighbor.row, neighbor.col, depth + 1)

          if (foundEnd) return
        }
      }

      // Mark as visited
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visited"
      }

      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Backtracking from cell at row ${row}, column ${col}`,
      })
    }

    // Start DFS
    dfs(startPosition.row, startPosition.col, 0)

    // If we found the end, reconstruct path
    if (foundEnd) {
      let current = { row: endPosition.row, col: endPosition.col }
      const path = []

      while (current.row !== startPosition.row || current.col !== startPosition.col) {
        path.push(current)
        const prev = simulationGrid[current.row][current.col].previous!
        current = prev
      }

      // Mark path
      for (const { row, col } of path.reverse()) {
        if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
          simulationGrid[row][col].status = "path"
        }

        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Adding cell at row ${row}, column ${col} to the path`,
        })
      }

      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Found path from start to end with length ${path.length}!`,
      })
    } else {
      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: "No path found from start to end!",
      })
    }

    return steps
  }

  // Dijkstra's Algorithm - Fixed version
  const runDijkstra = () => {
    const steps: any[] = []
    const simulationGrid: Grid = JSON.parse(JSON.stringify(grid))

    // Initialize distances
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        simulationGrid[row][col].distance = Number.POSITIVE_INFINITY
        simulationGrid[row][col].previous = null
      }
    }

    simulationGrid[startPosition.row][startPosition.col].distance = 0

    // Use a more efficient priority queue implementation
    const unvisited = new Set<string>()

    // Add all cells to unvisited set
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (simulationGrid[row][col].status !== "wall") {
          unvisited.add(`${row},${col}`)
        }
      }
    }

    let foundEnd = false
    let stepCount = 0
    const maxStepsBeforeSnapshot = 3 // Take more snapshots for better visualization

    while (unvisited.size > 0 && !foundEnd) {
      // Find the unvisited cell with the smallest distance
      let minDistance = Number.POSITIVE_INFINITY
      let current = { row: -1, col: -1 }

      for (const key of unvisited) {
        const [row, col] = key.split(",").map(Number)
        if (simulationGrid[row][col].distance < minDistance) {
          minDistance = simulationGrid[row][col].distance
          current = { row, col }
        }
      }

      // If we can't reach any more cells
      if (current.row === -1) {
        break
      }

      // If we found the end
      if (current.row === endPosition.row && current.col === endPosition.col) {
        foundEnd = true

        // Mark as visiting for visualization
        if (
          simulationGrid[current.row][current.col].status !== "start" &&
          simulationGrid[current.row][current.col].status !== "end"
        ) {
          simulationGrid[current.row][current.col].status = "visiting"
        }

        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Found the end node at row ${current.row}, column ${current.col}!`,
        })

        break
      }

      // Remove from unvisited
      unvisited.delete(`${current.row},${current.col}`)

      // If the current node is at infinity, we can't reach any more nodes
      if (minDistance === Number.POSITIVE_INFINITY) {
        break
      }

      // Mark as visiting
      if (
        simulationGrid[current.row][current.col].status !== "start" &&
        simulationGrid[current.row][current.col].status !== "end"
      ) {
        simulationGrid[current.row][current.col].status = "visiting"
      }

      // Take snapshots periodically
      stepCount++
      if (
        stepCount % maxStepsBeforeSnapshot === 0 ||
        (current.row === startPosition.row && current.col === startPosition.col)
      ) {
        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Visiting cell at row ${current.row}, column ${current.col} (distance: ${minDistance})`,
        })
      }

      // Get neighbors
      const neighbors = getNeighbors(simulationGrid, current.row, current.col)

      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`

        if (unvisited.has(key)) {
          // Calculate new distance
          const newDistance = simulationGrid[current.row][current.col].distance + 1

          if (newDistance < simulationGrid[neighbor.row][neighbor.col].distance) {
            // Update distance and previous
            simulationGrid[neighbor.row][neighbor.col].distance = newDistance
            simulationGrid[neighbor.row][neighbor.col].previous = { row: current.row, col: current.col }

            // Mark as visiting
            if (
              simulationGrid[neighbor.row][neighbor.col].status !== "start" &&
              simulationGrid[neighbor.row][neighbor.col].status !== "end"
            ) {
              simulationGrid[neighbor.row][neighbor.col].status = "visiting"
            }

            // Take snapshots periodically
            if (stepCount % maxStepsBeforeSnapshot === 0) {
              steps.push({
                grid: JSON.parse(JSON.stringify(simulationGrid)),
                message: `Updated distance to cell at row ${neighbor.row}, column ${neighbor.col}: ${newDistance}`,
              })
            }
          }
        }
      }

      // Mark as visited
      if (
        simulationGrid[current.row][current.col].status !== "start" &&
        simulationGrid[current.row][current.col].status !== "end"
      ) {
        simulationGrid[current.row][current.col].status = "visited"
      }

      // Take snapshots periodically
      if (stepCount % maxStepsBeforeSnapshot === 0) {
        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Finished visiting cell at row ${current.row}, column ${current.col}`,
        })
      }
    }

    // If we found the end, reconstruct path
    if (foundEnd) {
      let current = { row: endPosition.row, col: endPosition.col }
      const path = []

      while (current.row !== startPosition.row || current.col !== startPosition.col) {
        path.push(current)
        const prev = simulationGrid[current.row][current.col].previous!
        current = prev
      }

      // Mark path - take snapshots for better visualization
      const pathSteps = path.reverse()
      for (let i = 0; i < pathSteps.length; i++) {
        const { row, col } = pathSteps[i]

        if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
          simulationGrid[row][col].status = "path"
        }

        // Take snapshots periodically during path reconstruction
        if (i === 0 || i === pathSteps.length - 1 || i % 3 === 0) {
          steps.push({
            grid: JSON.parse(JSON.stringify(simulationGrid)),
            message: `Adding cell at row ${row}, column ${col} to the path`,
          })
        }
      }

      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Found shortest path from start to end with length ${path.length}!`,
      })
    } else {
      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: "No path found from start to end!",
      })
    }

    return steps
  }

  // A* algorithm - Fixed version
  const runAStar = () => {
    const steps: any[] = []
    const simulationGrid: Grid = JSON.parse(JSON.stringify(grid))

    // Initialize distances
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        simulationGrid[row][col].distance = Number.POSITIVE_INFINITY
        simulationGrid[row][col].previous = null
      }
    }

    // Calculate Manhattan distance heuristic
    const heuristic = (row: number, col: number) => {
      return Math.abs(row - endPosition.row) + Math.abs(col - endPosition.col)
    }

    simulationGrid[startPosition.row][startPosition.col].distance = 0

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known
    const gScore = Array(gridSize.rows)
      .fill(0)
      .map(() => Array(gridSize.cols).fill(Number.POSITIVE_INFINITY))
    gScore[startPosition.row][startPosition.col] = 0

    // For node n, fScore[n] = gScore[n] + h(n)
    const fScore = Array(gridSize.rows)
      .fill(0)
      .map(() => Array(gridSize.cols).fill(Number.POSITIVE_INFINITY))
    fScore[startPosition.row][startPosition.col] = heuristic(startPosition.row, startPosition.col)

    // Priority queue for A*
    const openSet = [
      {
        row: startPosition.row,
        col: startPosition.col,
        f: fScore[startPosition.row][startPosition.col],
      },
    ]

    // Closed set (visited nodes)
    const closedSet = new Set<string>()

    let foundEnd = false
    let stepCount = 0
    const maxStepsBeforeSnapshot = 3 // Take more snapshots for better visualization

    while (openSet.length > 0 && !foundEnd) {
      // Sort by f-score
      openSet.sort((a, b) => a.f - b.f)

      const current = openSet.shift()!
      const { row, col } = current

      // If we reached the end
      if (row === endPosition.row && col === endPosition.col) {
        foundEnd = true
        break
      }

      // Add to closed set
      closedSet.add(`${row},${col}`)

      // Mark as visiting
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visiting"
      }

      // Take snapshots periodically
      stepCount++
      if (stepCount % maxStepsBeforeSnapshot === 0 || (row === startPosition.row && col === startPosition.col)) {
        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Visiting cell at row ${row}, column ${col} (f-score: ${fScore[row][col].toFixed(1)})`,
        })
      }

      // Get neighbors
      const neighbors = getNeighbors(simulationGrid, row, col)

      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`

        if (closedSet.has(key)) continue

        // Tentative gScore
        const tentativeGScore = gScore[row][col] + 1

        // If this path is not better than previous, skip
        if (tentativeGScore >= gScore[neighbor.row][neighbor.col]) continue

        // This path is the best until now, record it
        simulationGrid[neighbor.row][neighbor.col].previous = { row, col }
        gScore[neighbor.row][neighbor.col] = tentativeGScore
        const newFScore = tentativeGScore + heuristic(neighbor.row, neighbor.col)
        fScore[neighbor.row][neighbor.col] = newFScore

        // Add to open set if not already there
        const neighborIndex = openSet.findIndex((n) => n.row === neighbor.row && n.col === neighbor.col)
        if (neighborIndex === -1) {
          openSet.push({ row: neighbor.row, col: neighbor.col, f: newFScore })
        } else {
          // Update f-score in open set
          openSet[neighborIndex].f = newFScore
        }

        // Mark as visiting
        if (
          simulationGrid[neighbor.row][neighbor.col].status !== "start" &&
          simulationGrid[neighbor.row][neighbor.col].status !== "end"
        ) {
          simulationGrid[neighbor.row][neighbor.col].status = "visiting"
        }
      }

      // Mark as visited
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visited"
      }
    }

    // If we found the end, reconstruct path
    if (foundEnd) {
      let current = { row: endPosition.row, col: endPosition.col }
      const path = []

      while (current.row !== startPosition.row || current.col !== startPosition.col) {
        path.push(current)
        const prev = simulationGrid[current.row][current.col].previous!
        current = prev
      }

      // Mark path - take snapshots for better visualization
      const pathSteps = path.reverse()
      for (let i = 0; i < pathSteps.length; i++) {
        const { row, col } = pathSteps[i]

        if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
          simulationGrid[row][col].status = "path"
        }

        // Take snapshots periodically during path reconstruction
        if (i === 0 || i === pathSteps.length - 1 || i % 3 === 0) {
          steps.push({
            grid: JSON.parse(JSON.stringify(simulationGrid)),
            message: `Adding cell at row ${row}, column ${col} to the path`,
          })
        }
      }

      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Found optimal path from start to end with length ${path.length}!`,
      })
    } else {
      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: "No path found from start to end!",
      })
    }

    return steps
  }

  // Greedy Best-First Search algorithm
  const runGreedy = () => {
    const steps: any[] = []
    const simulationGrid: Grid = JSON.parse(JSON.stringify(grid))

    // Initialize distances
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        simulationGrid[row][col].distance = Number.POSITIVE_INFINITY
        simulationGrid[row][col].previous = null
      }
    }

    // Calculate Manhattan distance heuristic
    const heuristic = (row: number, col: number) => {
      return Math.abs(row - endPosition.row) + Math.abs(col - endPosition.col)
    }

    simulationGrid[startPosition.row][startPosition.col].distance = 0

    // Priority queue for Greedy Best-First Search
    const openSet = [
      {
        row: startPosition.row,
        col: startPosition.col,
        h: heuristic(startPosition.row, startPosition.col),
      },
    ]

    // Closed set (visited nodes)
    const closedSet = new Set<string>()

    let foundEnd = false
    let stepCount = 0
    const maxStepsBeforeSnapshot = 3 // Take more snapshots for better visualization

    while (openSet.length > 0 && !foundEnd) {
      // Sort by heuristic only (that's what makes it greedy)
      openSet.sort((a, b) => a.h - b.h)

      const current = openSet.shift()!
      const { row, col } = current

      // If we reached the end
      if (row === endPosition.row && col === endPosition.col) {
        foundEnd = true
        break
      }

      // Add to closed set
      closedSet.add(`${row},${col}`)

      // Mark as visiting
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visiting"
      }

      // Take snapshots periodically
      stepCount++
      if (stepCount % maxStepsBeforeSnapshot === 0 || (row === startPosition.row && col === startPosition.col)) {
        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Visiting cell at row ${row}, column ${col} (heuristic: ${current.h.toFixed(1)})`,
        })
      }

      // Get neighbors
      const neighbors = getNeighbors(simulationGrid, row, col)

      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`

        if (closedSet.has(key)) continue

        // Calculate heuristic for this neighbor
        const h = heuristic(neighbor.row, neighbor.col)

        // This path is the best until now, record it
        simulationGrid[neighbor.row][neighbor.col].previous = { row, col }

        // Add to open set if not already there
        const neighborIndex = openSet.findIndex((n) => n.row === neighbor.row && n.col === neighbor.col)
        if (neighborIndex === -1) {
          openSet.push({ row: neighbor.row, col: neighbor.col, h: h })
        }

        // Mark as visiting
        if (
          simulationGrid[neighbor.row][neighbor.col].status !== "start" &&
          simulationGrid[neighbor.row][neighbor.col].status !== "end"
        ) {
          simulationGrid[neighbor.row][neighbor.col].status = "visiting"
        }
      }

      // Mark as visited
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visited"
      }
    }

    // If we found the end, reconstruct path
    if (foundEnd) {
      let current = { row: endPosition.row, col: endPosition.col }
      const path = []

      while (current.row !== startPosition.row || current.col !== startPosition.col) {
        path.push(current)
        const prev = simulationGrid[current.row][current.col].previous!
        current = prev
      }

      // Mark path - take snapshots for better visualization
      const pathSteps = path.reverse()
      for (let i = 0; i < pathSteps.length; i++) {
        const { row, col } = pathSteps[i]

        if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
          simulationGrid[row][col].status = "path"
        }

        // Take snapshots periodically during path reconstruction
        if (i === 0 || i === pathSteps.length - 1 || i % 3 === 0) {
          steps.push({
            grid: JSON.parse(JSON.stringify(simulationGrid)),
            message: `Adding cell at row ${row}, column ${col} to the path`,
          })
        }
      }

      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Found path from start to end with length ${path.length}!`,
      })
    } else {
      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: "No path found from start to end!",
      })
    }

    return steps
  }

  // Bidirectional Search algorithm
  const runBidirectional = () => {
    const steps: any[] = []
    const simulationGrid: Grid = JSON.parse(JSON.stringify(grid))

    // Initialize distances
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        simulationGrid[row][col].distance = Number.POSITIVE_INFINITY
        simulationGrid[row][col].previous = null
      }
    }

    // Forward search from start
    const forwardQueue = [{ row: startPosition.row, col: startPosition.col }]
    const forwardVisited = new Set<string>()
    forwardVisited.add(`${startPosition.row},${startPosition.col}`)
    const forwardParent: Record<string, { row: number; col: number } | null> = {}
    forwardParent[`${startPosition.row},${startPosition.col}`] = null

    // Backward search from end
    const backwardQueue = [{ row: endPosition.row, col: endPosition.col }]
    const backwardVisited = new Set<string>()
    backwardVisited.add(`${endPosition.row},${endPosition.col}`)
    const backwardParent: Record<string, { row: number; col: number } | null> = {}
    backwardParent[`${endPosition.row},${endPosition.col}`] = null

    let meetingPoint: { row: number; col: number } | null = null
    let stepCount = 0
    const maxStepsBeforeSnapshot = 2

    // Function to process a queue (either forward or backward)
    const processQueue = (
      queue: { row: number; col: number }[],
      visited: Set<string>,
      otherVisited: Set<string>,
      parent: Record<string, { row: number; col: number } | null>,
      isForward: boolean,
    ) => {
      if (queue.length === 0) return false

      const { row, col } = queue.shift()!

      // Mark as visiting
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visiting"
      }

      // Take snapshots periodically
      stepCount++
      if (stepCount % maxStepsBeforeSnapshot === 0) {
        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `${isForward ? "Forward" : "Backward"} search visiting cell at row ${row}, column ${col}`,
        })
      }

      // Get neighbors
      const neighbors = getNeighbors(simulationGrid, row, col)

      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`

        if (!visited.has(key)) {
          visited.add(key)
          queue.push({ row: neighbor.row, col: neighbor.col })
          parent[key] = { row, col }

          // Mark as visiting
          if (
            simulationGrid[neighbor.row][neighbor.col].status !== "start" &&
            simulationGrid[neighbor.row][neighbor.col].status !== "end"
          ) {
            simulationGrid[neighbor.row][neighbor.col].status = "visiting"
          }

          // Check if we've met the other search
          if (otherVisited.has(key)) {
            meetingPoint = { row: neighbor.row, col: neighbor.col }
            return true
          }
        }
      }

      // Mark as visited
      if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
        simulationGrid[row][col].status = "visited"
      }

      return false
    }

    // Alternate between forward and backward search
    let found = false
    while (forwardQueue.length > 0 && backwardQueue.length > 0 && !found) {
      // Forward search step
      found = processQueue(forwardQueue, forwardVisited, backwardVisited, forwardParent, true)
      if (found) break

      // Backward search step
      found = processQueue(backwardQueue, backwardVisited, forwardVisited, backwardParent, false)
    }

    // If we found a meeting point, reconstruct the path
    if (meetingPoint) {
      // Reconstruct path from start to meeting point
      let current = meetingPoint
      const pathFromStart = []

      while (current) {
        pathFromStart.push(current)
        const key = `${current.row},${current.col}`
        current = forwardParent[key]
        if (!current) break
      }

      // Reconstruct path from meeting point to end
      current = meetingPoint
      const pathToEnd = []

      while (current) {
        const key = `${current.row},${current.col}`
        current = backwardParent[key]
        if (!current) break
        pathToEnd.push(current)
      }

      // Combine paths (excluding duplicates)
      const fullPath = [...pathFromStart.reverse(), ...pathToEnd]

      // Mark path
      for (const { row, col } of fullPath) {
        if (simulationGrid[row][col].status !== "start" && simulationGrid[row][col].status !== "end") {
          simulationGrid[row][col].status = "path"
        }

        steps.push({
          grid: JSON.parse(JSON.stringify(simulationGrid)),
          message: `Adding cell at row ${row}, column ${col} to the path`,
        })
      }

      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: `Found path from start to end with length ${fullPath.length}!`,
      })
    } else {
      steps.push({
        grid: JSON.parse(JSON.stringify(simulationGrid)),
        message: "No path found from start to end!",
      })
    }

    return steps
  }

  // Start algorithm visualization
  const startVisualization = () => {
    if (isVisualizing && !isPaused) return

    if (isPaused) {
      setIsPaused(false)
      visualizeNextStep()
      return
    }

    // Check if a path is possible before starting
    if (!isPathPossible()) {
      setMessage("No path is possible from start to end with the current walls!")
      return
    }

    setIsVisualizing(true)
    setIsPaused(false)

    let algoSteps

    switch (algorithm) {
      case "bfs":
        algoSteps = runBFS()
        break
      case "dfs":
        algoSteps = runDFS()
        break
      case "dijkstra":
        algoSteps = runDijkstra()
        break
      case "astar":
        algoSteps = runAStar()
        break
      case "greedy":
        algoSteps = runGreedy()
        break
      case "bidirectional":
        algoSteps = runBidirectional()
        break
      default:
        algoSteps = runBFS()
    }

    setSteps(algoSteps)
    setCurrentStep(0)

    // Start visualization after a short delay
    setTimeout(() => {
      visualizeNextStep(0, algoSteps)
    }, 100)
  }

  // Visualize the next step in the algorithm
  const visualizeNextStep = (step = currentStep, algoSteps = steps) => {
    if (step >= algoSteps.length) {
      setIsVisualizing(false)
      return
    }

    // For high speeds, skip some steps but not too many
    const skipSteps = speed > 500 && step < algoSteps.length - 10
    const nextStep = skipSteps ? Math.min(step + 5, algoSteps.length - 10) : step + 1

    const currentStep = algoSteps[step]
    // Add console.log to debug cell statuses
    console.log('Current grid state:', currentStep.grid.map(row => 
      row.map(cell => cell.status)
    ))
    
    setGrid(currentStep.grid)
    setMessage(currentStep.message)
    setCurrentStep(nextStep)

    if (!isPaused) {
      let timeout = 1000 - Math.min(speed * 5, 950)
      if (speed > 500) {
        timeout = Math.max(50, timeout)
      }

      animationTimeoutRef.current = setTimeout(() => {
        visualizeNextStep(nextStep, algoSteps)
      }, timeout)
    }
  }

  // Pause the visualization
  const pauseVisualization = () => {
    setIsPaused(true)
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
  }

  // Step through the algorithm manually
  const stepForward = () => {
    if (steps.length === 0) {
      // Check if a path is possible before starting
      if (!isPathPossible()) {
        setMessage("No path is possible from start to end with the current walls!")
        return
      }

      let algoSteps

      switch (algorithm) {
        case "bfs":
          algoSteps = runBFS()
          break
        case "dfs":
          algoSteps = runDFS()
          break
        case "dijkstra":
          algoSteps = runDijkstra()
          break
        case "astar":
          algoSteps = runAStar()
          break
        case "greedy":
          algoSteps = runGreedy()
          break
        case "bidirectional":
          algoSteps = runBidirectional()
          break
        default:
          algoSteps = runBFS()
      }

      setSteps(algoSteps)
    }

    if (currentStep < steps.length) {
      pauseVisualization()
      setIsVisualizing(true)
      visualizeNextStep()
    }
  }

  const isColorable = (status: string) => !["start", "end", "wall"].includes(status);

  const getCellColor = (status: CellStatus): string => {
    switch (status) {
      case "wall":
        return "#475569" // slate-600
      case "start":
        return "#22c55e" // green-500
      case "end":
        return "#ef4444" // red-500
      case "visited":
        return "#93c5fd" // blue-300
      case "visiting":
        return "#f472b6" // pink-400
      case "path":
        return "#facc15" // yellow-400
      default:
        return "#f1f5f9" // slate-100
    }
  };
  
  // 5. Improve the controls layout and add tooltips
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="flex flex-wrap gap-4">
            <Select value={algorithm} onValueChange={setAlgorithm} disabled={isVisualizing && !isPaused}>
              <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bfs">Breadth-First Search</SelectItem>
                <SelectItem value="dfs">Depth-First Search</SelectItem>
                <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                <SelectItem value="astar">A* Search Algorithm</SelectItem>
                <SelectItem value="bidirectional">Bidirectional Search</SelectItem>
                <SelectItem value="greedy">Greedy Best-First Search</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Speed</span>
              <div className="w-[150px]">
                <Slider
                  value={[speed]}
                  min={1}
                  max={1000}
                  step={1}
                  onValueChange={(value) => setSpeed(value[0])}
                  disabled={isVisualizing && !isPaused}
                  className="py-1"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Wall Density</span>
              <div className="w-[150px]">
                <Slider
                  value={[wallDensity]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={(value) => setWallDensity(value[0])}
                  disabled={isVisualizing && !isPaused}
                  className="py-1"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={resetGrid}
              title="Reset visualization"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={stepForward}
              disabled={isVisualizing && !isPaused}
              title="Step forward"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <StepForward className="h-4 w-4" />
            </Button>

            {!isVisualizing || isPaused ? (
              <Button onClick={startVisualization} className="bg-emerald-600 hover:bg-emerald-700">
                <Play className="h-4 w-4 mr-2" />
                {isPaused ? "Resume" : "Start"}
              </Button>
            ) : (
              <Button
                onClick={pauseVisualization}
                variant="secondary"
                className="bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => {
                // Speed up significantly but not too much
                setSpeed(300)
                if (isPaused) {
                  setIsPaused(false)
                  visualizeNextStep()
                }
              }}
              disabled={!isVisualizing}
              title="Fast forward"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FastForward className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Fast Forward</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                // Check if a path is possible before starting
                if (!isPathPossible()) {
                  setMessage("No path is possible from start to end with the current walls!")
                  return
                }

                // Skip animation and show final result
                if (steps.length > 0) {
                  pauseVisualization()
                  setGrid(steps[steps.length - 1].grid)
                  setMessage(steps[steps.length - 1].message)
                  setCurrentStep(steps.length)
                } else {
                  let algoSteps
                  switch (algorithm) {
                    case "bfs":
                      algoSteps = runBFS()
                      break
                    case "dfs":
                      algoSteps = runDFS()
                      break
                    case "dijkstra":
                      algoSteps = runDijkstra()
                      break
                    case "astar":
                      algoSteps = runAStar()
                      break
                    case "greedy":
                      algoSteps = runGreedy()
                      break
                    case "bidirectional":
                      algoSteps = runBidirectional()
                      break
                    default:
                      algoSteps = runBFS()
                  }
                  setSteps(algoSteps)
                  setGrid(algoSteps[algoSteps.length - 1].grid)
                  setMessage(algoSteps[algoSteps.length - 1].message)
                  setCurrentStep(algoSteps.length)
                  setIsVisualizing(true)
                  setIsPaused(true)
                }
              }}
              disabled={isVisualizing && !isPaused}
              title="Show final result"
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Show Result</span>
            </Button>

            <Button
              variant="outline"
              onClick={generateRandomWalls}
              disabled={isVisualizing && !isPaused}
              className="border-slate-400 dark:border-slate-500 hover:bg-pink-400 dark:hover:bg-pink-400"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Maze
            </Button>

            <Button
              variant="outline"
              onClick={clearGrid}
              disabled={isVisualizing && !isPaused}
              className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Clear Grid
            </Button>
          </div>
        </div>

        {/* 2. Replace the grid rendering with a more responsive and visually appealing version */}
        <div
          className="flex items-center justify-center mb-4 overflow-auto"
        >
          <div
            className="grid gap-[1px] bg-slate-300 p-[1px] border border-slate-400 rounded-md shadow-sm"
            style={{
              gridTemplateColumns: `repeat(${gridSize.cols}, minmax(16px, 20px))`,
              gridTemplateRows: `repeat(${gridSize.rows}, minmax(16px, 20px))`,
            }}
          >
            {grid.map((row, rowIdx) =>
              row.map((cell, colIdx) => {
                const backgroundColor = getCellColor(cell.status)
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className="w-full h-full transition-colors duration-150"
                    style={{ 
                      backgroundColor,
                      border: '1px solid #cbd5e1' // slate-300 color for grid lines
                    }}
                    onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                    onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                    onMouseUp={handleMouseUp}
                    title={`Row: ${rowIdx}, Col: ${colIdx}, Status: ${cell.status}`}
                  ></div>
                )
              }),
            )}
          </div>
        </div>

        {/* 3. Replace the message display with a more visually appealing version */}
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{message}</p>
        </div>

        {/* 8. Add instructions for better user experience */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 shadow-sm">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">How to Use</h3>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>Click and drag to draw walls</li>
            <li>Click and drag the green start or red end point to move them</li>
            <li>Select an algorithm and press Start to visualize</li>
            <li>Use the speed slider to adjust visualization speed</li>
            <li>Use Random Walls to generate a maze automatically</li>
          </ul>
        </div>

        {/* 4. Replace the legend with a more visually appealing version */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-slate-100 border border-slate-300"></div>
            <span className="text-sm text-slate-300">Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-slate-600"></div>
            <span className="text-sm text-slate-300">Wall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-green-500"></div>
            <span className="text-sm text-slate-300">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
            <span className="text-sm text-slate-300">End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-pink-400"></div>
            <span className="text-sm text-slate-300">Visiting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-blue-300"></div>
            <span className="text-sm text-slate-300">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-yellow-400"></div>
            <span className="text-sm text-slate-300">Path</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
