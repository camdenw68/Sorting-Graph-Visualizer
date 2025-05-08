"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Menu, X, ChevronDown, Home, BarChart2, GitCompare, Share2, GitGraph } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [sortingAlgorithmsOpen, setSortingAlgorithmsOpen] = useState(false)
  const [graphAlgorithmsOpen, setGraphAlgorithmsOpen] = useState(false)

  // Update the toggleMenu function to include a smooth transition
  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Add a small delay to allow for smooth animation
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      setTimeout(() => {
        document.body.style.overflow = ""
      }, 300)
    }
  }

  const toggleSortingAlgorithms = () => setSortingAlgorithmsOpen(!sortingAlgorithmsOpen)
  const toggleGraphAlgorithms = () => setGraphAlgorithmsOpen(!graphAlgorithmsOpen)
  const closeMenu = () => setIsOpen(false)

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Sorting Algorithms",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
      children: [
        {
          name: "Bubble Sort",
          path: "/algorithms/bubble",
        },
        {
          name: "Selection Sort",
          path: "/algorithms/selection",
        },
        {
          name: "Insertion Sort",
          path: "/algorithms/insertion",
        },
        {
          name: "Merge Sort",
          path: "/algorithms/merge",
        },
        {
          name: "Quick Sort",
          path: "/algorithms/quick",
        },
      ],
    },
    {
      name: "Graph Algorithms",
      icon: <GitGraph className="h-4 w-4 mr-2" />,
      children: [
        {
          name: "Graph Visualizer",
          path: "/graphs",
        },
        {
          name: "Breadth-First Search",
          path: "/graphs/bfs",
        },
        {
          name: "Depth-First Search",
          path: "/graphs/dfs",
        },
        {
          name: "Dijkstra's Algorithm",
          path: "/graphs/dijkstra",
        },
        {
          name: "A* Search",
          path: "/graphs/astar",
        },
      ],
    },
    {
      name: "Compare Sorting",
      path: "/compare",
      icon: <GitCompare className="h-4 w-4 mr-2" />,
    },
    {
      name: "Compare Graphs",
      path: "/graphs/compare",
      icon: <Share2 className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    // Update the navbar container
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center font-bold text-lg text-slate-800 dark:text-white"
              onClick={closeMenu}
            >
              <BarChart3 className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-500" />
              <span>Algorithm Visualizer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {routes.map((route) =>
              route.children ? (
                <div className="relative group" key={route.name}>
                  <Button
                    variant="ghost"
                    className={`flex items-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800`}
                    onClick={route.name === "Sorting Algorithms" ? toggleSortingAlgorithms : toggleGraphAlgorithms}
                  >
                    {route.icon}
                    {route.name}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 ml-1 transition-transform duration-200",
                        (route.name === "Sorting Algorithms" && sortingAlgorithmsOpen) ||
                          (route.name === "Graph Algorithms" && graphAlgorithmsOpen)
                          ? "rotate-180"
                          : "",
                      )}
                    />
                  </Button>
                  <div
                    className={cn(
                      "absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out",
                      (route.name === "Sorting Algorithms" && sortingAlgorithmsOpen) ||
                        (route.name === "Graph Algorithms" && graphAlgorithmsOpen)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none",
                    )}
                  >
                    <div className="py-1">
                      {route.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={cn(
                            "block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                            pathname === child.path ? "bg-slate-100 dark:bg-slate-800 font-medium" : "",
                          )}
                          onClick={() => {
                            if (route.name === "Sorting Algorithms") {
                              setSortingAlgorithmsOpen(false)
                            } else {
                              setGraphAlgorithmsOpen(false)
                            }
                          }}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={route.path} key={route.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                      pathname === route.path ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "",
                    )}
                  >
                    {route.icon}
                    {route.name}
                  </Button>
                </Link>
              ),
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {routes.map((route) =>
            route.children ? (
              <div key={route.name}>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={route.name === "Sorting Algorithms" ? toggleSortingAlgorithms : toggleGraphAlgorithms}
                >
                  <div className="flex items-center">
                    {route.icon}
                    {route.name}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      (route.name === "Sorting Algorithms" && sortingAlgorithmsOpen) ||
                        (route.name === "Graph Algorithms" && graphAlgorithmsOpen)
                        ? "rotate-180"
                        : "",
                    )}
                  />
                </Button>
                <div
                  className={cn(
                    "pl-4 space-y-1 transition-all duration-200 ease-in-out overflow-hidden",
                    (route.name === "Sorting Algorithms" && sortingAlgorithmsOpen) ||
                      (route.name === "Graph Algorithms" && graphAlgorithmsOpen)
                      ? "max-h-[500px] opacity-100 mt-1"
                      : "max-h-0 opacity-0",
                  )}
                >
                  {route.children.map((child) => (
                    <Link
                      key={child.path}
                      href={child.path}
                      className={cn(
                        "block py-2 px-3 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                        pathname === child.path
                          ? "bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"
                          : "",
                      )}
                      onClick={closeMenu}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link href={route.path} key={route.name} onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                    pathname === route.path ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "",
                  )}
                >
                  {route.icon}
                  {route.name}
                </Button>
              </Link>
            ),
          )}
        </div>
      </div>
    </nav>
  )
}
