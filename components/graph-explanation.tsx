"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function GraphExplanation({ algorithm }: { algorithm: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  const algorithmData: Record<
    string,
    {
      title: string
      description: string
      overview: string
      timeComplexity: {
        time: string
        space: string
      }
      pseudocode: string
      pythonCode: string
      useCases: string[]
      pros: string[]
      cons: string[]
    }
  > = {
    bfs: {
      title: "Breadth-First Search (BFS)",
      description:
        "A graph traversal algorithm that explores all neighbors at the present depth before moving to nodes at the next depth level",
      overview:
        "Breadth-First Search (BFS) is a graph traversal algorithm that explores all the vertices of a graph at the present depth level before moving on to vertices at the next depth level. It starts at a selected node (source or root) and explores all neighboring nodes at the present depth level before moving on to nodes at the next depth level. BFS uses a queue data structure to keep track of the next vertices to visit.",
      timeComplexity: {
        time: "O(V + E) where V is the number of vertices and E is the number of edges",
        space: "O(V) for the queue and visited set",
      },
      pseudocode: `procedure BFS(G, start_v)
    let Q be a queue
    let visited be a set
    
    add start_v to visited
    Q.enqueue(start_v)
    
    while Q is not empty do
        v = Q.dequeue()
        
        for all neighbors w of v do
            if w is not in visited then
                add w to visited
                Q.enqueue(w)
            end if
        end for
    end while
end procedure`,
      pythonCode: `from collections import deque

def bfs(graph, start):
    """
    Perform Breadth-First Search on a graph
    
    Args:
        graph: A dictionary representing the graph as an adjacency list
        start: The starting vertex
        
    Returns:
        A list of vertices in the order they were visited
    """
    # Initialize queue, visited set, and result list
    queue = deque([start])
    visited = {start}
    result = []
    
    # BFS algorithm
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        # Visit all neighbors
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

traversal_order = bfs(graph, 'A')
print("BFS traversal order:", traversal_order)

# Grid-based BFS (for pathfinding)
def grid_bfs(grid, start, end):
    """
    Find shortest path in a grid using BFS
    
    Args:
        grid: 2D array where 0 represents empty cell and 1 represents wall
        start: Tuple (row, col) of starting position
        end: Tuple (row, col) of ending position
        
    Returns:
        List of coordinates representing the shortest path, or None if no path exists
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, [start])])  # (position, path)
    visited = {start}
    
    # Directions: up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    
    while queue:
        (row, col), path = queue.popleft()
        
        # Check if we've reached the end
        if (row, col) == end:
            return path
        
        # Try all four directions
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            
            # Check if the new position is valid
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] == 0 and 
                (new_row, new_col) not in visited):
                
                visited.add((new_row, new_col))
                new_path = path + [(new_row, new_col)]
                queue.append(((new_row, new_col), new_path))
    
    # No path found
    return None

# Example usage
grid = [
    [0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0]
]
start = (0, 0)
end = (4, 4)
path = grid_bfs(grid, start, end)
print("Shortest path:", path)`,
      useCases: [
        "Finding the shortest path in an unweighted graph",
        "Web crawling and indexing",
        "Social network analysis (finding friends within a certain degree of connection)",
        "Puzzle solving (e.g., sliding puzzles, maze solving)",
        "Network broadcasting",
      ],
      pros: [
        "Guarantees the shortest path in unweighted graphs",
        "Visits vertices in order of their distance from the source",
        "Complete algorithm - will find a solution if one exists",
        "Good for finding the shortest path on unweighted graphs",
      ],
      cons: [
        "Uses more memory than DFS due to storing all vertices of a level",
        "Not suitable for weighted graphs without modification",
        "May be slower than DFS for problems like maze generation or topological sorting",
      ],
    },
    dfs: {
      title: "Depth-First Search (DFS)",
      description: "A graph traversal algorithm that explores as far as possible along each branch before backtracking",
      overview:
        "Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It starts at a selected node (source or root) and explores as far as possible along each branch before backtracking. DFS uses a stack data structure (or recursion which implicitly uses the call stack) to keep track of the vertices to visit next.",
      timeComplexity: {
        time: "O(V + E) where V is the number of vertices and E is the number of edges",
        space: "O(V) for the stack and visited set",
      },
      pseudocode: `procedure DFS(G, v)
    label v as discovered
    for all directed edges from v to w that are in G.adjacentEdges(v) do
        if vertex w is not labeled as discovered then
            recursively call DFS(G, w)
        end if
    end for
end procedure

// Iterative version using a stack
procedure DFS-iterative(G, v)
    let S be a stack
    S.push(v)
    while S is not empty do
        v = S.pop()
        if v is not labeled as discovered then
            label v as discovered
            for all edges from v to w in G.adjacentEdges(v) do
                S.push(w)
            end for
        end if
    end while
end procedure`,
      pythonCode: `def dfs_recursive(graph, vertex, visited=None):
    """
    Perform Depth-First Search on a graph recursively
    
    Args:
        graph: A dictionary representing the graph as an adjacency list
        vertex: The current vertex to explore
        visited: Set of visited vertices
        
    Returns:
        A list of vertices in the order they were visited
    """
    if visited is None:
        visited = set()
    
    # Mark the current vertex as visited
    visited.add(vertex)
    result = [vertex]
    
    # Recur for all adjacent vertices
    for neighbor in graph[vertex]:
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))
    
    return result

def dfs_iterative(graph, start):
    """
    Perform Depth-First Search on a graph iteratively
    
    Args:
        graph: A dictionary representing the graph as an adjacency list
        start: The starting vertex
        
    Returns:
        A list of vertices in the order they were visited
    """
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        vertex = stack.pop()
        
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            
            # Add neighbors in reverse order to maintain the same
            # traversal order as the recursive version
            for neighbor in reversed(graph[vertex]):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# Recursive DFS
traversal_recursive = dfs_recursive(graph, 'A')
print("DFS traversal (recursive):", traversal_recursive)

# Iterative DFS
traversal_iterative = dfs_iterative(graph, 'A')
print("DFS traversal (iterative):", traversal_iterative)

# Grid-based DFS for maze solving
def grid_dfs(grid, start, end):
    """
    Find a path in a grid using DFS
    
    Args:
        grid: 2D array where 0 represents empty cell and 1 represents wall
        start: Tuple (row, col) of starting position
        end: Tuple (row, col) of ending position
        
    Returns:
        List of coordinates representing a path, or None if no path exists
    """
    rows, cols = len(grid), len(grid[0])
    visited = set()
    
    def dfs_helper(position, path):
        row, col = position
        
        # Check if we've reached the end
        if position == end:
            return path
        
        # Mark as visited
        visited.add(position)
        
        # Directions: up, right, down, left
        directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
        
        # Try all four directions
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            new_pos = (new_row, new_col)
            
            # Check if the new position is valid
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] == 0 and 
                new_pos not in visited):
                
                # Recursively search from this position
                result = dfs_helper(new_pos, path + [new_pos])
                if result:
                    return result
        
        # No path found from this position
        return None
    
    # Start DFS from the start position
    return dfs_helper(start, [start])

# Example usage
grid = [
    [0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0]
]
start = (0, 0)
end = (4, 4)
path = grid_dfs(grid, start, end)
print("DFS path:", path)`,
      useCases: [
        "Topological sorting",
        "Finding connected components",
        "Maze generation",
        "Solving puzzles with only one solution",
        "Detecting cycles in a graph",
        "Finding strongly connected components",
      ],
      pros: [
        "Uses less memory than BFS for wide graphs",
        "Can be easily implemented using recursion",
        "Better for decision tree problems where you need to check if a solution exists",
        "Good for maze generation and solving",
        "Useful for topological sorting",
      ],
      cons: [
        "Does not guarantee the shortest path",
        "Can get stuck in infinite loops if not implemented carefully (in infinite graphs)",
        "May be less efficient than BFS for finding the shortest path",
        "Recursive implementation may cause stack overflow for very deep graphs",
      ],
    },
    dijkstra: {
      title: "Dijkstra's Algorithm",
      description: "A shortest path algorithm for weighted graphs with non-negative edge weights",
      overview:
        "Dijkstra's algorithm is a greedy algorithm that solves the single-source shortest path problem for a graph with non-negative edge weights. It finds the shortest path from a starting node to all other nodes in the graph, producing a shortest-path tree. The algorithm maintains a set of unvisited nodes and a set of tentative distances, always selecting the unvisited node with the smallest tentative distance.",
      timeComplexity: {
        time: "O((V + E) log V) with a binary heap, O(V²) with an array",
        space: "O(V) for storing distances and visited nodes",
      },
      pseudocode: `procedure Dijkstra(Graph, source)
    dist[source] ← 0
    for each vertex v in Graph do
        if v ≠ source
            dist[v] ← INFINITY
        end if
        add v to unvisited
    end for
    
    while unvisited is not empty do
        u ← vertex in unvisited with min dist[u]
        remove u from unvisited
        
        for each neighbor v of u do
            alt ← dist[u] + length(u, v)
            if alt < dist[v] then
                dist[v] ← alt
                prev[v] ← u
            end if
        end for
    end while
    
    return dist[], prev[]
end procedure`,
      pythonCode: `import heapq

def dijkstra(graph, start):
    """
    Dijkstra's algorithm for finding shortest paths in a weighted graph
    
    Args:
        graph: A dictionary where keys are vertices and values are lists of (neighbor, weight) tuples
        start: The starting vertex
        
    Returns:
        A tuple of (distances, predecessors) dictionaries
    """
    # Initialize distances with infinity for all nodes except the start
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start] = 0
    
    # Initialize predecessors dictionary
    predecessors = {vertex: None for vertex in graph}
    
    # Priority queue for vertices to visit
    priority_queue = [(0, start)]
    
    while priority_queue:
        # Get vertex with smallest distance
        current_distance, current_vertex = heapq.heappop(priority_queue)
        
        # If we've found a longer path, skip
        if current_distance > distances[current_vertex]:
            continue
        
        # Check all neighbors
        for neighbor, weight in graph[current_vertex]:
            distance = current_distance + weight
            
            # If we've found a shorter path
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                predecessors[neighbor] = current_vertex
                heapq.heappush(priority_queue, (distance, neighbor))
    
    return distances, predecessors

def get_shortest_path(predecessors, start, end):
    """
    Reconstruct the shortest path from start to end using predecessors
    
    Args:
        predecessors: Dictionary mapping each vertex to its predecessor
        start: Starting vertex
        end: Ending vertex
        
    Returns:
        List representing the shortest path from start to end
    """
    path = []
    current = end
    
    # No path exists
    if predecessors[current] is None and current != start:
        return None
    
    # Reconstruct the path
    while current is not None:
        path.append(current)
        current = predecessors[current]
    
    # Reverse to get path from start to end
    return path[::-1]

# Example usage
graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('C', 1), ('D', 5)],
    'C': [('A', 2), ('B', 1), ('D', 8), ('E', 10)],
    'D': [('B', 5), ('C', 8), ('E', 2), ('F', 6)],
    'E': [('C', 10), ('D', 2), ('F', 3)],
    'F': [('D', 6), ('E', 3)]
}

start_vertex = 'A'
distances, predecessors = dijkstra(graph, start_vertex)

print("Distances from", start_vertex)
for vertex, distance in distances.items():
    print(f"{vertex}: {distance}")

end_vertex = 'F'
path = get_shortest_path(predecessors, start_vertex, end_vertex)
print(f"Shortest path from {start_vertex} to {end_vertex}: {path}")

# Grid-based Dijkstra's algorithm for pathfinding
def grid_dijkstra(grid, start, end):
    """
    Find shortest path in a weighted grid using Dijkstra's algorithm
    
    Args:
        grid: 2D array where values represent the cost to enter that cell
              (0 for empty, higher values for terrain, infinity for walls)
        start: Tuple (row, col) of starting position
        end: Tuple (row, col) of ending position
        
    Returns:
        Tuple of (distance, path) where path is a list of coordinates
    """
    rows, cols = len(grid), len(grid[0])
    
    # Initialize distances with infinity
    distances = {}
    predecessors = {}
    for r in range(rows):
        for c in range(cols):
            distances[(r, c)] = float('infinity')
            predecessors[(r, c)] = None
    
    # Set start distance to 0
    distances[start] = 0
    
    # Priority queue for cells to visit
    priority_queue = [(0, start)]
    visited = set()
    
    # Directions: up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    
    while priority_queue:
        # Get cell with smallest distance
        current_distance, current_cell = heapq.heappop(priority_queue)
        
        # If we've reached the end
        if current_cell == end:
            # Reconstruct path
            path = []
            current = end
            while current is not None:
                path.append(current)
                current = predecessors[current]
            return current_distance, path[::-1]
        
        # Skip if already visited
        if current_cell in visited:
            continue
        
        visited.add(current_cell)
        row, col = current_cell
        
        # Check all four directions
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            neighbor = (new_row, new_col)
            
            # Check if the new position is valid
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] != float('infinity')):
                
                # Calculate new distance
                distance = current_distance + grid[new_row][new_col]
                
                # If we've found a shorter path
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    predecessors[neighbor] = current_cell
                    heapq.heappush(priority_queue, (distance, neighbor))
    
    # No path found
    return float('infinity'), None

# Example usage
grid = [
    [1, 1, 1, 1, float('infinity')],
    [float('infinity'), float('infinity'), 1, 1, 1],
    [1, 1, 2, float('infinity'), 1],
    [1, float('infinity'), 1, 1, 1],
    [1, 1, 1, 1, 1]
]
start = (0, 0)
end = (4, 4)
distance, path = grid_dijkstra(grid, start, end)
print(f"Shortest path distance: {distance}")
print(f"Shortest path: {path}")`,
      useCases: [
        "Finding the shortest path in road networks",
        "Network routing protocols",
        "Flight scheduling",
        "Robotics path planning",
        "Logistics and transportation optimization",
      ],
      pros: [
        "Guarantees the shortest path in weighted graphs with non-negative weights",
        "Efficient for sparse graphs with a good priority queue implementation",
        "Can be used to find the shortest path from one node to all other nodes",
        "Widely used in real-world applications like GPS navigation",
      ],
      cons: [
        "Does not work with negative edge weights",
        "Can be slower than other algorithms for dense graphs",
        "Requires all edge weights to be known in advance",
        "Not suitable for graphs with negative cycles",
      ],
    },
    astar: {
      title: "A* Search Algorithm",
      description: "A best-first search algorithm that uses heuristics to find the shortest path",
      overview:
        "A* (pronounced 'A-star') is a best-first search algorithm that finds the shortest path from a start node to a goal node. It combines the advantages of both Dijkstra's algorithm (which guarantees the shortest path) and Greedy Best-First Search (which uses heuristics to speed up the search). A* uses a heuristic function to estimate the cost from the current node to the goal, and prioritizes nodes with the lowest combined cost (actual cost so far plus estimated cost to goal).",
      timeComplexity: {
        time: "O(b^d) in the worst case, where b is the branching factor and d is the depth of the solution",
        space: "O(b^d) to store all generated nodes",
      },
      pseudocode: `procedure A*(start, goal)
    // Initialize open and closed lists
    openList = {start}
    closedList = {}
    
    // Initialize costs
    g[start] = 0
    f[start] = g[start] + h(start, goal)
    
    while openList is not empty do
        current = node in openList with lowest f value
        
        if current = goal then
            return reconstruct_path(current)
        end if
        
        remove current from openList
        add current to closedList
        
        for each neighbor of current do
            if neighbor in closedList then
                continue
            end if
            
            tentative_g = g[current] + distance(current, neighbor)
            
            if neighbor not in openList or tentative_g < g[neighbor] then
                came_from[neighbor] = current
                g[neighbor] = tentative_g
                f[neighbor] = g[neighbor] + h(neighbor, goal)
                
                if neighbor not in openList then
                    add neighbor to openList
                end if
            end if
        end for
    end while
    
    return failure
end procedure`,
      pythonCode: `import heapq

def a_star(graph, start, goal, heuristic):
    """
    A* search algorithm for finding the shortest path
    
    Args:
        graph: A dictionary where keys are vertices and values are lists of (neighbor, weight) tuples
        start: The starting vertex
        goal: The goal vertex
        heuristic: A function that estimates the cost from a vertex to the goal
        
    Returns:
        A tuple of (path, cost) where path is a list of vertices
    """
    # Open set - vertices to be evaluated
    open_set = [(0 + heuristic(start, goal), 0, start, [])]  # (f, g, vertex, path)
    
    # Closed set - vertices already evaluated
    closed_set = set()
    
    # g_score - cost from start to vertex
    g_scores = {start: 0}
    
    while open_set:
        # Get vertex with lowest f_score
        f, g, current, path = heapq.heappop(open_set)
        
        # If we've reached the goal
        if current == goal:
            return path + [current], g
        
        # Skip if already evaluated
        if current in closed_set:
            continue
        
        # Mark as evaluated
        closed_set.add(current)
        
        # Check all neighbors
        for neighbor, weight in graph[current]:
            # Skip if already evaluated
            if neighbor in closed_set:
                continue
            
            # Calculate tentative g_score
            tentative_g = g + weight
            
            # If this is a new vertex or we found a better path
            if neighbor not in g_scores or tentative_g < g_scores[neighbor]:
                # Update g_score
                g_scores[neighbor] = tentative_g
                
                # Calculate f_score
                f_score = tentative_g + heuristic(neighbor, goal)
                
                # Add to open set
                heapq.heappush(open_set, (f_score, tentative_g, neighbor, path + [current]))
    
    # No path found
    return None, float('infinity')

# Example with a simple graph and Manhattan distance heuristic
def manhattan_distance(a, b):
    """
    Calculate Manhattan distance between two points
    
    Args:
        a: First point as (x, y) tuple
        b: Second point as (x, y) tuple
        
    Returns:
        Manhattan distance between a and b
    """
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

# Example usage with a graph where vertices are (x, y) coordinates
graph = {
    (0, 0): [((0, 1), 1), ((1, 0), 1)],
    (0, 1): [((0, 0), 1), ((0, 2), 1), ((1, 1), 1)],
    (0, 2): [((0, 1), 1), ((1, 2), 1)],
    (1, 0): [((0, 0), 1), ((1, 1), 1), ((2, 0), 1)],
    (1, 1): [((0, 1), 1), ((1, 0), 1), ((1, 2), 1), ((2, 1), 1)],
    (1, 2): [((0, 2), 1), ((1, 1), 1), ((2, 2), 1)],
    (2, 0): [((1, 0), 1), ((2, 1), 1)],
    (2, 1): [((1, 1), 1), ((2, 0), 1), ((2, 2), 1), ((3, 1), 1)],
    (2, 2): [((1, 2), 1), ((2, 1), 1), ((3, 2), 1)],
    (3, 1): [((2, 1), 1), ((3, 2), 1)],
    (3, 2): [((2, 2), 1), ((3, 1), 1)]
}

start = (0, 0)
goal = (3, 2)

path, cost = a_star(graph, start, goal, manhattan_distance)
print(f"A* path from {start} to {goal}: {path}")
print(f"Path cost: {cost}")

# Grid-based A* for pathfinding
def grid_a_star(grid, start, end):
    """
    Find shortest path in a grid using A* algorithm
    
    Args:
        grid: 2D array where values represent the cost to enter that cell
              (0 for empty, higher values for terrain, infinity for walls)
        start: Tuple (row, col) of starting position
        end: Tuple (row, col) of ending position
        
    Returns:
        Tuple of (path, cost) where path is a list of coordinates
    """
    rows, cols = len(grid), len(grid[0])
    
    # Define heuristic (Manhattan distance)
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
    
    # Open set - cells to be evaluated
    open_set = [(heuristic(start, end), 0, start, [start])]  # (f, g, cell, path)
    
    # Closed set - cells already evaluated
    closed_set = set()
    
    # g_score - cost from start to cell
    g_scores = {start: 0}
    
    # Directions: up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    
    while open_set:
        # Get cell with lowest f_score
        f, g, current, path = heapq.heappop(open_set)
        
        # If we've reached the end
        if current == end:
            return path, g
        
        # Skip if already evaluated
        if current in closed_set:
            continue
        
        # Mark as evaluated
        closed_set.add(current)
        
        row, col = current
        
        # Check all four directions
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            neighbor = (new_row, new_col)
            
            # Check if the new position is valid
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] != float('infinity')):
                
                # Skip if already evaluated
                if neighbor in closed_set:
                    continue
                
                # Calculate tentative g_score
                tentative_g = g + grid[new_row][new_col]
                
                # If this is a new cell or we found a better path
                if neighbor not in g_scores or tentative_g < g_scores[neighbor]:
                    # Update g_score
                    g_scores[neighbor] = tentative_g
                    
                    # Calculate f_score
                    f_score = tentative_g + heuristic(neighbor, end)
                    
                    # Add to open set
                    heapq.heappush(open_set, (f_score, tentative_g, neighbor, path + [neighbor]))
    
    # No path found
    return None, float('infinity')

# Example usage
grid = [
    [1, 1, 1, 1, float('infinity')],
    [float('infinity'), float('infinity'), 1, 1, 1],
    [1, 1, 2, float('infinity'), 1],
    [1, float('infinity'), 1, 1, 1],
    [1, 1, 1, 1, 1]
]
start = (0, 0)
end = (4, 4)
path, cost = grid_a_star(grid, start, end)
print(f"A* path: {path}")
print(f"Path cost: {cost}")`,
      useCases: [
        "Pathfinding in video games",
        "Robot navigation",
        "Puzzle solving (e.g., 8-puzzle, 15-puzzle)",
        "Route planning in GPS systems",
        "Automated planning and scheduling",
      ],
      pros: [
        "Finds the shortest path if the heuristic is admissible (never overestimates)",
        "More efficient than Dijkstra's algorithm by using heuristics to guide the search",
        "Complete - will find a solution if one exists",
        "Optimal - will find the optimal solution if the heuristic is admissible",
      ],
      cons: [
        "Performance depends heavily on the quality of the heuristic",
        "Can be memory-intensive for large graphs",
        "May not be suitable for graphs with changing edge weights",
        "Requires a good heuristic function, which may be difficult to design for some problems",
      ],
    },
    mst: {
      title: "Minimum Spanning Tree (MST)",
      description: "Algorithms to find a tree that connects all vertices with minimum total edge weight",
      overview:
        "A Minimum Spanning Tree (MST) is a subset of the edges of a connected, edge-weighted undirected graph that connects all the vertices together without any cycles and with the minimum possible total edge weight. There are two main algorithms for finding MSTs: Kruskal's algorithm and Prim's algorithm. Kruskal's algorithm builds the MST by adding edges in order of increasing weight, while Prim's algorithm builds the MST by adding vertices in order of increasing distance from the growing tree.",
      timeComplexity: {
        time: "O(E log V) for both Kruskal's and Prim's algorithms with appropriate data structures",
        space: "O(E + V) for both algorithms",
      },
      pseudocode: `// Kruskal's Algorithm
procedure Kruskal(G)
    A = ∅
    sort edges of G by weight in non-decreasing order
    
    for each edge (u, v) in sorted edges do
        if adding (u, v) to A does not create a cycle then
            add (u, v) to A
        end if
    end for
    
    return A
end procedure

// Prim's Algorithm
procedure Prim(G, start)
    A = ∅
    for each vertex v in G do
        key[v] = INFINITY
        parent[v] = NULL
    end for
    
    key[start] = 0
    Q = all vertices in G
    
    while Q is not empty do
        u = extract_min(Q)
        add edge (parent[u], u) to A if parent[u] is not NULL
        
        for each neighbor v of u do
            if v in Q and weight(u, v) < key[v] then
                parent[v] = u
                key[v] = weight(u, v)
            end if
        end for
    end while
    
    return A
end procedure`,
      pythonCode: `# Kruskal's Algorithm
class DisjointSet:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        return True

def kruskal_mst(graph, vertices):
    """
    Kruskal's algorithm for finding Minimum Spanning Tree
    
    Args:
        graph: List of edges as (u, v, weight) tuples
        vertices: Number of vertices in the graph
        
    Returns:
        List of edges in the MST
    """
    # Sort edges by weight
    edges = sorted(graph, key=lambda x: x[2])
    
    # Initialize disjoint set
    ds = DisjointSet(vertices)
    
    mst = []
    
    for u, v, weight in edges:
        # If including this edge doesn't form a cycle
        if ds.union(u, v):
            mst.append((u, v, weight))
        
        # Stop when we have V-1 edges
        if len(mst) == vertices - 1:
            break
    
    return mst

# Prim's Algorithm
import heapq

def prim_mst(graph, start=0):
    """
    Prim's algorithm for finding Minimum Spanning Tree
    
    Args:
        graph: A dictionary where keys are vertices and values are lists of (neighbor, weight) tuples
        start: The starting vertex
        
    Returns:
        List of edges in the MST
    """
    # Number of vertices
    n = len(graph)
    
    # Initialize key values and parent
    key = [float('infinity')] * n
    parent = [None] * n
    key[start] = 0
    
    # Priority queue for vertices
    pq = [(0, start)]
    
    # Set to keep track of vertices in MST
    mst_set = set()
    
    # Result edges
    mst = []
    
    while pq and len(mst_set) < n:
        # Get vertex with minimum key
        weight, u = heapq.heappop(pq)
        
        # Skip if already in MST
        if u in mst_set:
            continue
        
        # Add to MST
        mst_set.add(u)
        
        # Add edge to MST (except for start vertex)
        if parent[u] is not None:
            mst.append((parent[u], u, weight))
        
        # Update keys of adjacent vertices
        for v, w in graph[u]:
            if v not in mst_set and w < key[v]:
                key[v] = w
                parent[v] = u
                heapq.heappush(pq, (w, v))
    
    return mst

# Example usage
# Graph represented as a list of edges for Kruskal's algorithm
graph_edges = [
    (0, 1, 4), (0, 7, 8), (1, 2, 8), (1, 7, 11),
    (2, 3, 7), (2, 8, 2), (2, 5, 4), (3, 4, 9),
    (3, 5, 14), (4, 5, 10), (5, 6, 2), (6, 7, 1),
    (6, 8, 6), (7, 8, 7)
]
vertices = 9

mst_kruskal = kruskal_mst(graph_edges, vertices)
print("Minimum Spanning Tree (Kruskal's):")
for u, v, w in mst_kruskal:
    print(f"Edge {u}-{v} with weight {w}")

# Graph represented as adjacency list for Prim's algorithm
graph_adj = {
    0: [(1, 4), (7, 8)],
    1: [(0, 4), (2, 8), (7, 11)],
    2: [(1, 8), (3, 7), (8, 2), (5, 4)],
    3: [(2, 7), (4, 9), (5, 14)],
    4: [(3, 9), (5, 10)],
    5: [(2, 4), (3, 14), (4, 10), (6, 2)],
    6: [(5, 2), (7, 1), (8, 6)],
    7: [(0, 8), (1, 11), (6, 1), (8, 7)],
    8: [(2, 2), (6, 6), (7, 7)]
}

mst_prim = prim_mst(graph_adj)
print("\nMinimum Spanning Tree (Prim's):")
for u, v, w in mst_prim:
    print(f"Edge {u}-{v} with weight {w}")`,
      useCases: [
        "Network design (e.g., designing a road network connecting cities)",
        "Circuit design",
        "Cluster analysis",
        "Image segmentation",
        "Approximation algorithms for NP-hard problems like the Traveling Salesman Problem",
      ],
      pros: [
        "Guarantees the minimum total weight tree that connects all vertices",
        "Efficient algorithms exist (Kruskal's and Prim's)",
        "Useful for designing networks with minimum cost",
        "Can be used as a preprocessing step for other algorithms",
      ],
      cons: [
        "Only works for undirected graphs",
        "Does not guarantee shortest paths between vertices",
        "May not be unique if there are edges with the same weight",
        "Not suitable for directed graphs or when shortest paths are required",
      ],
    },
    topological: {
      title: "Topological Sort",
      description:
        "An algorithm for ordering the vertices of a directed acyclic graph (DAG) such that for every directed edge (u, v), vertex u comes before v in the ordering",
      overview:
        "Topological Sort is an algorithm for ordering the vertices of a directed acyclic graph (DAG) such that for every directed edge (u, v), vertex u comes before v in the ordering. This ordering is useful for scheduling tasks with dependencies, course prerequisites, and other applications where certain items must be processed before others. There are two main algorithms for topological sorting: Kahn's algorithm (using in-degree) and a modified DFS approach.",
      timeComplexity: {
        time: "O(V + E) where V is the number of vertices and E is the number of edges",
        space: "O(V) for storing the result and visited nodes",
      },
      pseudocode: `// Kahn's Algorithm
procedure TopologicalSort(G)
    L = Empty list that will contain the sorted elements
    S = Set of all nodes with no incoming edge
    
    while S is non-empty do
        remove a node n from S
        add n to tail of L
        for each node m with an edge e from n to m do
            remove edge e from the graph
            if m has no other incoming edges then
                insert m into S
            end if
        end for
    end while
    
    if graph has edges then
        return error (graph has at least one cycle)
    else
        return L (a topologically sorted order)
    end if
end procedure

// DFS-based Algorithm
procedure TopologicalSort(G)
    L = Empty list that will contain the sorted nodes
    S = Set of all nodes with no temporary or permanent mark
    
    function visit(node n)
        if n has a permanent mark then
            return
        end if
        if n has a temporary mark then
            return error (graph has a cycle)
        end if
        
        mark n with a temporary mark
        
        for each node m with an edge from n to m do
            visit(m)
        end for
        
        remove temporary mark from n
        mark n with a permanent mark
        add n to head of L
    end function
    
    while S is non-empty do
        select a node n from S
        visit(n)
    end while
    
    return L
end procedure`,
      pythonCode: `# Kahn's Algorithm for Topological Sort
from collections import defaultdict, deque

def topological_sort_kahn(graph):
    """
    Kahn's algorithm for topological sorting
    
    Args:
        graph: A dictionary where keys are vertices and values are lists of neighbors
        
    Returns:
        A list of vertices in topological order, or None if the graph has a cycle
    """
    # Count in-degrees
    in_degree = defaultdict(int)
    for u in graph:
        for v in graph[u]:
            in_degree[v] += 1
    
    # Initialize queue with vertices that have no incoming edges
    queue = deque([u for u in graph if in_degree[u] == 0])
    
    # Initialize result
    result = []
    
    # Process vertices
    while queue:
        u = queue.popleft()
        result.append(u)
        
        # Reduce in-degree of neighbors
        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    
    # Check if there's a cycle
    if len(result) != len(graph):
        return None  # Graph has a cycle
    
    return result

# DFS-based Topological Sort
def topological_sort_dfs(graph):
    """
    DFS-based algorithm for topological sorting
    
    Args:
        graph: A dictionary where keys are vertices and values are lists of neighbors
        
    Returns:
        A list of vertices in topological order, or None if the graph has a cycle
    """
    # Initialize result and visited sets
    result = []
    visited = set()
    temp_visited = set()
    
    def dfs(u):
        # If already visited permanently, skip
        if u in visited:
            return True
        
        # If visited temporarily, we have a cycle
        if u in temp_visited:
            return False
        
        # Mark as temporarily visited
        temp_visited.add(u)
        
        # Visit neighbors
        for v in graph[u]:
            if not dfs(v):
                return False
        
        # Mark as permanently visited
        temp_visited.remove(u)
        visited.add(u)
        
        # Add to result
        result.append(u)
        
        return True
    
    # Visit all vertices
    for u in graph:
        if u not in visited:
            if not dfs(u):
                return None  # Graph has a cycle
    
    # Reverse result for correct order
    return result[::-1]

# Example usage
graph = {
    'A': ['C', 'B'],
    'B': ['D'],
    'C': ['D'],
    'D': ['E'],
    'E': []
}

# Using Kahn's algorithm
result_kahn = topological_sort_kahn(graph)
print("Topological Sort (Kahn's):", result_kahn)

# Using DFS-based algorithm
result_dfs = topological_sort_dfs(graph)
print("Topological Sort (DFS):", result_dfs)

# Example with a cycle
graph_with_cycle = {
    'A': ['B'],
    'B': ['C'],
    'C': ['A']
}

result_cycle = topological_sort_kahn(graph_with_cycle)
print("Topological Sort with cycle:", result_cycle)  # Should return None

# Application: Course Scheduling
def can_finish_courses(num_courses, prerequisites):
    """
    Determine if it's possible to finish all courses given prerequisites
    
    Args:
        num_courses: Number of courses
        prerequisites: List of [a, b] pairs where course a depends on course b
        
    Returns:
        True if all courses can be finished, False otherwise
    """
    # Build graph
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)
    
    # Ensure all courses are in the graph
    for i in range(num_courses):
        if i not in graph:
            graph[i] = []
    
    # Perform topological sort
    result = topological_sort_kahn(graph)
    
    # If result is None, there's a cycle
    return result is not None

# Example usage
num_courses = 4
prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
can_finish = can_finish_courses(num_courses, prerequisites)
print(f"Can finish all courses: {can_finish}")

# Example with a cycle
prerequisites_cycle = [[1, 0], [0, 1]]
can_finish_cycle = can_finish_courses(2, prerequisites_cycle)
print(f"Can finish all courses with cycle: {can_finish_cycle}")`,
      useCases: [
        "Task scheduling with dependencies",
        "Course prerequisite planning",
        "Build systems (determining the order to compile files)",
        "Package dependency resolution",
        "Data processing pipelines",
      ],
      pros: [
        "Linear time complexity O(V + E)",
        "Can detect cycles in directed graphs",
        "Useful for scheduling problems with dependencies",
        "Simple to implement using either Kahn's algorithm or DFS",
      ],
      cons: [
        "Only works for directed acyclic graphs (DAGs)",
        "The topological ordering may not be unique",
        "Cannot handle cyclic dependencies",
        "Not suitable for undirected graphs",
      ],
    },
    bidirectional: {
      title: "Bidirectional Search",
      description:
        "A graph search algorithm that runs two simultaneous searches: one forward from the source, and one backward from the target, to find the shortest path",
      overview:
        "Bidirectional Search is a graph search algorithm that runs two simultaneous searches: one forward from the source, and one backward from the target. The search terminates when the two searches meet in the middle, which can significantly reduce the search space compared to a single search from the source to the target. This algorithm is particularly effective for finding the shortest path in large graphs.",
      timeComplexity: {
        time: "O(b^(d/2)) where b is the branching factor and d is the distance from source to target",
        space: "O(b^(d/2)) to store the search frontiers",
      },
      pseudocode: `procedure BidirectionalSearch(G, source, target)
    // Initialize forward and backward queues
    forward_queue = {source}
    backward_queue = {target}
    
    // Initialize visited sets
    forward_visited = {source: null}
    backward_visited = {target: null}
    
    // Initialize meeting point
    meeting_point = null
    
    while forward_queue is not empty and backward_queue is not empty do
        // Expand forward search
        current = forward_queue.dequeue()
        
        for each neighbor of current do
            if neighbor not in forward_visited then
                forward_visited[neighbor] = current
                forward_queue.enqueue(neighbor)
            end if
            
            if neighbor in backward_visited then
                meeting_point = neighbor
                break
            end if
        end for
        
        if meeting_point is not null then
            break
        end if
        
        // Expand backward search
        current = backward_queue.dequeue()
        
        for each neighbor of current do
            if neighbor not in backward_visited then
                backward_visited[neighbor] = current
                backward_queue.enqueue(neighbor)
            end if
            
            if neighbor in forward_visited then
                meeting_point = neighbor
                break
            end if
        end for
        
        if meeting_point is not null then
            break
        end if
    end while
    
    if meeting_point is null then
        return "No path exists"
    end if
    
    // Reconstruct path
    path = []
    
    // Forward path
    current = meeting_point
    while current is not null do
        path.prepend(current)
        current = forward_visited[current]
    end while
    
    // Backward path (excluding meeting point)
    current = backward_visited[meeting_point]
    while current is not null do
        path.append(current)
        current = backward_visited[current]
    end while
    
    return path
end procedure`,
      pythonCode: `from collections import deque

def bidirectional_search(graph, start, end):
    """
    Bidirectional search algorithm for finding the shortest path
    
    Args:
        graph: A dictionary where keys are vertices and values are lists of neighbors
        start: The starting vertex
        end: The ending vertex
        
    Returns:
        A list of vertices representing the shortest path, or None if no path exists
    """
    # Check if start and end are the same
    if start == end:
        return [start]
    
    # Initialize forward and backward queues
    forward_queue = deque([start])
    backward_queue = deque([end])
    
    # Initialize visited dictionaries with parent pointers
    forward_visited = {start: None}
    backward_visited = {end: None}
    
    # Initialize meeting point
    meeting_point = None
    
    while forward_queue and backward_queue:
        # Expand forward search
        current = forward_queue.popleft()
        
        for neighbor in graph[current]:
            # If not visited in forward search
            if neighbor not in forward_visited:
                forward_visited[neighbor] = current
                forward_queue.append(neighbor)
            
            # Check if we've met the backward search
            if neighbor in backward_visited:
                meeting_point = neighbor
                break
        
        if meeting_point:
            break
        
        # Expand backward search
        current = backward_queue.popleft()
        
        for neighbor in graph[current]:
            # If not visited in backward search
            if neighbor not in backward_visited:
                backward_visited[neighbor] = current
                backward_queue.append(neighbor)
            
            # Check if we've met the forward search
            if neighbor in forward_visited:
                meeting_point = neighbor
                break
        
        if meeting_point:
            break
    
    # If no meeting point, no path exists
    if not meeting_point:
        return None
    
    # Reconstruct path
    path = []
    
    # Forward path
    current = meeting_point
    while current is not None:
        path.insert(0, current)
        current = forward_visited[current]
    
    # Backward path (excluding meeting point)
    current = backward_visited[meeting_point]
    while current is not None:
        path.append(current)
        current = backward_visited[current]
    
    return path

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B', 'G'],
    'E': ['B', 'G'],
    'F': ['C', 'G'],
    'G': ['D', 'E', 'F']
}

start = 'A'
end = 'G'
path = bidirectional_search(graph, start, end)
print(f"Shortest path from {start} to {end}: {path}")

# Grid-based bidirectional search
def grid_bidirectional_search(grid, start, end):
    """
    Find shortest path in a grid using bidirectional search
    
    Args:
        grid: 2D array where 0 represents empty cell and 1 represents wall
        start: Tuple (row, col) of starting position
        end: Tuple (row, col) of ending position
        
    Returns:
        List of coordinates representing the shortest path, or None if no path exists
    """
    rows, cols = len(grid), len(grid[0])
    
    # Check if start and end are the same
    if start == end:
        return [start]
    
    # Initialize forward and backward queues
    forward_queue = deque([start])
    backward_queue = deque([end])
    
    # Initialize visited dictionaries with parent pointers
    forward_visited = {start: None}
    backward_visited = {end: None}
    
    # Initialize meeting point
    meeting_point = None
    
    # Directions: up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    
    while forward_queue and backward_queue:
        # Expand forward search
        current = forward_queue.popleft()
        row, col = current
        
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            neighbor = (new_row, new_col)
            
            # Check if the new position is valid
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] == 0 and 
                neighbor not in forward_visited):
                
                forward_visited[neighbor] = current
                forward_queue.append(neighbor)
                
                # Check if we've met the backward search
                if neighbor in backward_visited:
                    meeting_point = neighbor
                    break
        
        if meeting_point:
            break
        
        # Expand backward search
        current = backward_queue.popleft()
        row, col = current
        
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            neighbor = (new_row, new_col)
            
            # Check if the new position is valid
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] == 0 and 
                neighbor not in backward_visited):
                
                backward_visited[neighbor] = current
                backward_queue.append(neighbor)
                
                # Check if we've met the forward search
                if neighbor in forward_visited:
                    meeting_point = neighbor
                    break
        
        if meeting_point:
            break
    
    # If no meeting point, no path exists
    if not meeting_point:
        return None
    
    # Reconstruct path
    path = []
    
    # Forward path
    current = meeting_point
    while current is not None:
        path.insert(0, current)
        current = forward_visited[current]
    
    # Backward path (excluding meeting point)
    current = backward_visited[meeting_point]
    while current is not None:
        path.append(current)
        current = backward_visited[current]
    
    return path

# Example usage
grid = [
    [0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0]
]
start = (0, 0)
end = (4, 4)
path = grid_bidirectional_search(grid, start, end)
print(f"Shortest path: {path}")`,
      useCases: [
        "Finding shortest paths in large graphs",
        "Route planning in navigation systems",
        "Social network connection finding",
        "Game AI pathfinding",
        "Puzzle solving with known start and end states",
      ],
      pros: [
        "Much faster than unidirectional search for large graphs",
        "Reduces the search space from O(b^d) to O(b^(d/2))",
        "Guarantees the shortest path in unweighted graphs",
        "Particularly effective when the branching factor is high",
      ],
      cons: [
        "Requires more complex implementation than unidirectional search",
        "Requires knowledge of both the start and end states",
        "May use more memory than unidirectional search in some cases",
        "More difficult to implement for weighted graphs",
      ],
    },
    greedy: {
      title: "Greedy Best-First Search",
      description:
        "A search algorithm that expands the node that appears to be closest to the goal, based on a heuristic function",
      overview:
        "Greedy Best-First Search is a search algorithm that always expands the node that appears to be closest to the goal, based solely on a heuristic function. Unlike A*, it does not consider the cost of the path so far, making it faster but less accurate. It's a form of best-first search that uses a priority queue to select the most promising node to expand next.",
      timeComplexity: {
        time: "O(b^m) in the worst case, where b is the branching factor and m is the maximum depth of the search",
        space: "O(b^m) to store all generated nodes",
      },
      pseudocode: `procedure GreedyBestFirstSearch(start, goal)
    // Initialize open and closed lists
    openList = {start}
    closedList = {}
    
    // Initialize parent pointers
    parent[start] = null
    
    while openList is not empty do
        // Get node with lowest heuristic value
        current = node in openList with lowest h(current, goal)
        
        if current = goal then
            return reconstruct_path(current)
        end if
        
        remove current from openList
        add current to closedList
        
        for each neighbor of current do
            if neighbor in closedList then
                continue
            end if
            
            if neighbor not in openList then
                parent[neighbor] = current
                add neighbor to openList
            end if
        end for
    end while
    
    return failure
end procedure`,
      pythonCode: `import heapq

def greedy_best_first_search(graph, start, goal, heuristic):
    """
    Greedy Best-First Search algorithm
    
    Args:
        graph: A dictionary where keys are vertices and values are lists of (neighbor, weight) tuples
        start: The starting vertex
        goal: The goal vertex
        heuristic: A function that estimates the cost from a vertex to the goal
        
    Returns:
        A tuple of (path, cost) where path is a list of vertices
    """
    # Open set - vertices to be evaluated
    open_set = [(heuristic(start, goal), start, [])]  # (h, vertex, path)
    
    # Closed set - vertices already evaluated
    closed_set = set()
    
    while open_set:
        # Get vertex with lowest heuristic value
        h, current, path = heapq.heappop(open_set)
        
        # If we've reached the goal
        if current == goal:
            return path + [current], len(path)
        
        # Skip if already evaluated
        if current in closed_set:
            continue
        
        # Mark as evaluated
        closed_set.add(current)
        
        # Check all neighbors
        for neighbor, _ in graph[current]:
            # Skip if already evaluated
            if neighbor in closed_set:
                continue
            
            # Calculate heuristic for this neighbor
            h = heuristic(neighbor, goal)
            
            # Add to open set
            heapq.heappush(open_set, (h, neighbor, path + [current]))
    
    # No path found
    return None, float('infinity')

# Example with a simple graph and Manhattan distance heuristic
def manhattan_distance(a, b):
    """
    Calculate Manhattan distance between two points
    
    Args:
        a: First point as (x, y) tuple
        b: Second point as (x, y) tuple
        
    Returns:
        Manhattan distance between a and b
    """
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

# Example usage with a graph where vertices are (x, y) coordinates
graph = {
    (0, 0): [((0, 1), 1), ((1, 0), 1)],
    (0, 1): [((0, 0), 1), ((0, 2), 1), ((1, 1), 1)],
    (0, 2): [((0, 1), 1), ((1, 2), 1)],
    (1, 0): [((0, 0), 1), ((1, 1), 1), ((2, 0), 1)],
    (1, 1): [((0, 1), 1), ((1, 0), 1), ((1, 2), 1), ((2, 1), 1)],
    (1, 2): [((0, 2), 1), ((1, 1), 1), ((2, 2), 1)],
    (2, 0): [((1, 0), 1), ((2, 1), 1)],
    (2, 1): [((1, 1), 1), ((2, 0), 1), ((2, 2), 1), ((3, 1), 1)],
    (2, 2): [((1, 2), 1), ((2, 1), 1), ((3, 2), 1)],
    (3, 1): [((2, 1), 1), ((3, 2), 1)],
    (3, 2): [((2, 2), 1), ((3, 1), 1)]
}

start = (0, 0)
goal = (3, 2)

path, cost = greedy_best_first_search(graph, start, goal, manhattan_distance)
print(f"Greedy Best-First Search path from {start} to {goal}: {path}")
print(f"Path cost: {cost}")

# Grid-based Greedy Best-First Search
def grid_greedy_best_first_search(grid, start, end):
    """
    Find path in a grid using Greedy Best-First Search
    
    Args:
        grid: 2D array where values represent the cost to enter that cell
              (0 for empty, higher values for terrain, infinity for walls)
        start: Tuple (row, col) of starting position
        end: Tuple (row, col) of ending position
        
    Returns:
        Tuple of (path, cost) where path is a list of coordinates
    """
    rows, cols = len(grid), len(grid[0])
    
    # Define heuristic (Manhattan distance)
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])
    
    # Open set - cells to be evaluated
    open_set = [(heuristic(start, end), start, [start])]  # (h, cell, path)
    
    # Closed set - cells already evaluated
    closed_set = set()
    
    # Directions: up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    
    while open_set:
        # Get cell with lowest heuristic value
        h, current, path = heapq.heappop(open_set)
        
        # If we've reached the end
        if current == end:
            return path, len(path) - 1
        
        # Skip if already evaluated
        if current in closed_set:
            continue
        
        # Mark as evaluated
        closed_set.add(current)
        
        row, col = current
        
        # Check all four directions
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            neighbor = (new_row, new_col)
            
            # Check if the new position is valid
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] != float('infinity')):
                
                # Skip if already evaluated
                if neighbor in closed_set:
                    continue
                
                # Calculate heuristic
                h = heuristic(neighbor, end)
                
                # Add to open set
                heapq.heappush(open_set, (h, neighbor, path + [neighbor]))
    
    # No path found
    return None, float('infinity')

# Example usage
grid = [
    [0, 0, 0, 0, float('infinity')],
    [float('infinity'), float('infinity'), 0, 0, 0],
    [0, 0, 0, float('infinity'), 0],
    [0, float('infinity'), 0, 0, 0],
    [0, 0, 0, 0, 0]
]
start = (0, 0)
end = (4, 4)
path, cost = grid_greedy_best_first_search(grid, start, end)
print(f"Greedy Best-First Search path: {path}")
print(f"Path cost: {cost}")`,
    },
  }

  const currentAlgorithm = algorithmData[algorithm] || {
    title: "Graph Algorithm",
    description: "No information available for this algorithm",
    overview: "No overview available.",
    timeComplexity: {
      time: "N/A",
      space: "N/A",
    },
    pseudocode: "No pseudocode available.",
    pythonCode: "# No code available",
    useCases: ["N/A"],
    pros: ["N/A"],
    cons: ["N/A"],
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{currentAlgorithm.title}</CardTitle>
          <CardDescription>{currentAlgorithm.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="complexity">Complexity</TabsTrigger>
              <TabsTrigger value="pseudocode">Pseudocode</TabsTrigger>
              <TabsTrigger value="code">Python Code</TabsTrigger>
              <TabsTrigger value="usecases">Use Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">{currentAlgorithm.overview}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Pros</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {currentAlgorithm.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Cons</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {currentAlgorithm.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="complexity" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Time Complexity</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{currentAlgorithm.timeComplexity.time}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Space Complexity</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{currentAlgorithm.timeComplexity.space}</p>
                  </div>
                </div>
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Complexity Explanation</AlertTitle>
                  <AlertDescription>
                    {algorithm === "bfs" && (
                      <p>
                        BFS has O(V + E) time complexity because in the worst case, it needs to visit every vertex and
                        edge in the graph. The space complexity is O(V) because in the worst case, all vertices might be
                        stored in the queue simultaneously.
                      </p>
                    )}
                    {algorithm === "dfs" && (
                      <p>
                        DFS has O(V + E) time complexity because it visits each vertex and edge once. The space
                        complexity is O(V) due to the recursion stack or explicit stack used to track vertices.
                      </p>
                    )}
                    {algorithm === "dijkstra" && (
                      <p>
                        Dijkstra's algorithm has O((V + E) log V) time complexity with a binary heap implementation
                        because each vertex is extracted from the priority queue once (O(V log V)) and each edge is
                        relaxed once (O(E log V)). The space complexity is O(V) for storing distances and visited nodes.
                      </p>
                    )}
                    {algorithm === "astar" && (
                      <p>
                        A* has O(b^d) time and space complexity in the worst case, where b is the branching factor and d
                        is the depth of the solution. However, with a good heuristic, A* can be much more efficient than
                        this worst-case bound.
                      </p>
                    )}
                    {algorithm === "mst" && (
                      <p>
                        Minimum Spanning Tree algorithms like Kruskal's and Prim's have O(E log V) time complexity with
                        appropriate data structures. The space complexity is O(E + V) for storing the graph and
                        additional data structures.
                      </p>
                    )}
                    {algorithm === "topological" && (
                      <p>
                        Topological Sort has O(V + E) time complexity because it visits each vertex and edge once. The
                        space complexity is O(V) for storing the result and visited nodes.
                      </p>
                    )}
                    {algorithm === "bidirectional" && (
                      <p>
                        Bidirectional Search has O(b^(d/2)) time and space complexity, where b is the branching factor
                        and d is the distance from source to target. This is significantly better than the O(b^d)
                        complexity of a unidirectional search.
                      </p>
                    )}
                    {algorithm === "greedy" && (
                      <p>
                        Greedy Best-First Search has O(b^m) time and space complexity in the worst case, where b is the
                        branching factor and m is the maximum depth of the search. However, with a good heuristic, it
                        can be much more efficient in practice.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            <TabsContent value="pseudocode" className="mt-4">
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
                {currentAlgorithm.pseudocode}
              </pre>
            </TabsContent>
            <TabsContent value="code" className="mt-4">
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
                {currentAlgorithm.pythonCode}
              </pre>
            </TabsContent>
            <TabsContent value="usecases" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium mb-2">Common Use Cases</h3>
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  {currentAlgorithm.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>When to use {currentAlgorithm.title}</AlertTitle>
                  <AlertDescription>
                    {algorithm === "bfs" && (
                      <p>
                        Use BFS when you need to find the shortest path in an unweighted graph, or when you need to
                        explore all vertices at a given distance before moving further away from the source. It's also
                        useful for level-order traversal of trees and finding the shortest path in a maze.
                      </p>
                    )}
                    {algorithm === "dfs" && (
                      <p>
                        Use DFS when you need to explore as far as possible along each branch before backtracking. It's
                        useful for topological sorting, finding connected components, cycle detection, and maze
                        generation. DFS is also often simpler to implement recursively than BFS.
                      </p>
                    )}
                    {algorithm === "dijkstra" && (
                      <p>
                        Use Dijkstra's algorithm when you need to find the shortest path in a weighted graph with
                        non-negative edge weights. It's particularly useful for road networks, network routing, and
                        other applications where you need to minimize the total cost of a path.
                      </p>
                    )}
                    {algorithm === "astar" && (
                      <p>
                        Use A* when you need to find the shortest path in a weighted graph and have a good heuristic to
                        guide the search. It's particularly useful for pathfinding in games, robot navigation, and
                        puzzle solving where you can estimate the distance to the goal.
                      </p>
                    )}
                    {algorithm === "mst" && (
                      <p>
                        Use Minimum Spanning Tree algorithms when you need to connect all vertices in a graph with the
                        minimum total edge weight. It's useful for network design, clustering, and approximation
                        algorithms for other problems like the Traveling Salesman Problem.
                      </p>
                    )}
                    {algorithm === "topological" && (
                      <p>
                        Use Topological Sort when you need to order the vertices of a directed acyclic graph (DAG) such
                        that for every directed edge (u, v), vertex u comes before v in the ordering. It's useful for
                        scheduling tasks with dependencies, course prerequisites, and build systems.
                      </p>
                    )}
                    {algorithm === "bidirectional" && (
                      <p>
                        Use Bidirectional Search when you know both the start and goal states and want to find the
                        shortest path more efficiently than a unidirectional search. It's particularly effective for
                        large graphs where the branching factor is high.
                      </p>
                    )}
                    {algorithm === "greedy" && (
                      <p>
                        Use Greedy Best-First Search when you need a fast approximation of the shortest path and
                        optimality is not critical. It's useful for real-time systems, game AI, and exploratory search
                        in large state spaces where finding any reasonable path quickly is more important than finding
                        the optimal path.
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
