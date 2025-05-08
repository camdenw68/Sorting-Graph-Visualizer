"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Pause, RotateCcw, StepForward, Info, GitCompare } from "lucide-react"
import Link from "next/link"

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [sortingAlgorithm, setSortingAlgorithm] = useState<string>("bubble")
  const [isSorting, setIsSorting] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(50)
  const [arraySize, setArraySize] = useState<number>(50)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [comparingIndices, setComparingIndices] = useState<number[]>([])
  const [swappingIndices, setSwappingIndices] = useState<number[]>([])
  const [sortedIndices, setSortedIndices] = useState<number[]>([])
  const [steps, setSteps] = useState<any[]>([])
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Generate a new random array
  const generateArray = () => {
    const newArray = []
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 5)
    }
    setArray(newArray)
    setCurrentStep(0)
    setComparingIndices([])
    setSwappingIndices([])
    setSortedIndices([])
    setSteps([])
  }

  // Initialize array on component mount and when array size changes
  useEffect(() => {
    generateArray()
  }, [arraySize])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Bubble Sort Algorithm
  const bubbleSort = (arr: number[]) => {
    const steps = []
    const arrayCopy = [...arr]
    const n = arrayCopy.length

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing step
        steps.push({
          type: "compare",
          indices: [j, j + 1],
          array: [...arrayCopy],
        })

        if (arrayCopy[j] > arrayCopy[j + 1]) {
          // Swapping step
          const temp = arrayCopy[j]
          arrayCopy[j] = arrayCopy[j + 1]
          arrayCopy[j + 1] = temp

          steps.push({
            type: "swap",
            indices: [j, j + 1],
            array: [...arrayCopy],
          })
        }
      }

      // Mark as sorted
      steps.push({
        type: "sorted",
        index: n - i - 1,
        array: [...arrayCopy],
      })
    }

    return steps
  }

  // Selection Sort Algorithm
  const selectionSort = (arr: number[]) => {
    const steps = []
    const arrayCopy = [...arr]
    const n = arrayCopy.length

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i

      for (let j = i + 1; j < n; j++) {
        // Comparing step
        steps.push({
          type: "compare",
          indices: [minIdx, j],
          array: [...arrayCopy],
        })

        if (arrayCopy[j] < arrayCopy[minIdx]) {
          minIdx = j
        }
      }

      // Swapping step (if needed)
      if (minIdx !== i) {
        const temp = arrayCopy[i]
        arrayCopy[i] = arrayCopy[minIdx]
        arrayCopy[minIdx] = temp

        steps.push({
          type: "swap",
          indices: [i, minIdx],
          array: [...arrayCopy],
        })
      }

      // Mark as sorted
      steps.push({
        type: "sorted",
        index: i,
        array: [...arrayCopy],
      })
    }

    // Mark the last element as sorted
    steps.push({
      type: "sorted",
      index: n - 1,
      array: [...arrayCopy],
    })

    return steps
  }

  // Insertion Sort Algorithm
  const insertionSort = (arr: number[]) => {
    const steps = []
    const arrayCopy = [...arr]
    const n = arrayCopy.length

    for (let i = 1; i < n; i++) {
      const key = arrayCopy[i]
      let j = i - 1

      // Compare with previous elements
      steps.push({
        type: "compare",
        indices: [i, j],
        array: [...arrayCopy],
      })

      while (j >= 0 && arrayCopy[j] > key) {
        arrayCopy[j + 1] = arrayCopy[j]

        steps.push({
          type: "swap",
          indices: [j, j + 1],
          array: [...arrayCopy],
        })

        j--

        if (j >= 0) {
          steps.push({
            type: "compare",
            indices: [j, j + 1],
            array: [...arrayCopy],
          })
        }
      }

      arrayCopy[j + 1] = key

      // Mark elements as sorted
      for (let k = 0; k <= i; k++) {
        steps.push({
          type: "sorted",
          index: k,
          array: [...arrayCopy],
        })
      }
    }

    return steps
  }

  // Merge Sort Algorithm
  const mergeSort = (arr: number[]) => {
    const steps: any[] = []
    const arrayCopy = [...arr]

    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const n1 = mid - left + 1
      const n2 = right - mid

      const L = new Array(n1)
      const R = new Array(n2)

      for (let i = 0; i < n1; i++) {
        L[i] = arr[left + i]
      }

      for (let j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j]
      }

      let i = 0,
        j = 0,
        k = left

      while (i < n1 && j < n2) {
        steps.push({
          type: "compare",
          indices: [left + i, mid + 1 + j],
          array: [...arr],
        })

        if (L[i] <= R[j]) {
          arr[k] = L[i]
          i++
        } else {
          arr[k] = R[j]
          j++
        }

        steps.push({
          type: "swap",
          indices: [k],
          array: [...arr],
        })

        k++
      }

      while (i < n1) {
        arr[k] = L[i]
        steps.push({
          type: "swap",
          indices: [k],
          array: [...arr],
        })
        i++
        k++
      }

      while (j < n2) {
        arr[k] = R[j]
        steps.push({
          type: "swap",
          indices: [k],
          array: [...arr],
        })
        j++
        k++
      }

      // Mark the sorted subarray
      for (let i = left; i <= right; i++) {
        steps.push({
          type: "sorted",
          index: i,
          array: [...arr],
        })
      }
    }

    const mergeSortHelper = (arr: number[], left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor(left + (right - left) / 2)

        mergeSortHelper(arr, left, mid)
        mergeSortHelper(arr, mid + 1, right)

        merge(arr, left, mid, right)
      }
    }

    mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1)
    return steps
  }

  // Quick Sort Algorithm
  const quickSort = (arr: number[]) => {
    const steps: any[] = []
    const arrayCopy = [...arr]

    const partition = (arr: number[], low: number, high: number) => {
      const pivot = arr[high]
      let i = low - 1

      for (let j = low; j < high; j++) {
        steps.push({
          type: "compare",
          indices: [j, high],
          array: [...arr],
        })

        if (arr[j] < pivot) {
          i++

          // Swap arr[i] and arr[j]
          const temp = arr[i]
          arr[i] = arr[j]
          arr[j] = temp

          steps.push({
            type: "swap",
            indices: [i, j],
            array: [...arr],
          })
        }
      }

      // Swap arr[i+1] and arr[high]
      const temp = arr[i + 1]
      arr[i + 1] = arr[high]
      arr[high] = temp

      steps.push({
        type: "swap",
        indices: [i + 1, high],
        array: [...arr],
      })

      return i + 1
    }

    const quickSortHelper = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pi = partition(arr, low, high)

        // Mark the pivot as sorted
        steps.push({
          type: "sorted",
          index: pi,
          array: [...arr],
        })

        quickSortHelper(arr, low, pi - 1)
        quickSortHelper(arr, pi + 1, high)
      } else if (low === high) {
        // Mark single elements as sorted
        steps.push({
          type: "sorted",
          index: low,
          array: [...arr],
        })
      }
    }

    quickSortHelper(arrayCopy, 0, arrayCopy.length - 1)
    return steps
  }

  // Start sorting visualization
  const startSorting = () => {
    if (isSorting && !isPaused) return

    if (isPaused) {
      setIsPaused(false)
      visualizeNextStep()
      return
    }

    setIsSorting(true)
    setIsPaused(false)
    setComparingIndices([])
    setSwappingIndices([])
    setSortedIndices([])

    let sortSteps

    switch (sortingAlgorithm) {
      case "bubble":
        sortSteps = bubbleSort([...array])
        break
      case "selection":
        sortSteps = selectionSort([...array])
        break
      case "insertion":
        sortSteps = insertionSort([...array])
        break
      case "merge":
        sortSteps = mergeSort([...array])
        break
      case "quick":
        sortSteps = quickSort([...array])
        break
      default:
        sortSteps = bubbleSort([...array])
    }

    setSteps(sortSteps)
    setCurrentStep(0)

    // Start visualization after a short delay
    setTimeout(() => {
      visualizeNextStep(0, sortSteps)
    }, 100)
  }

  // Visualize the next step in the sorting algorithm
  const visualizeNextStep = (step = currentStep, sortSteps = steps) => {
    if (step >= sortSteps.length) {
      setIsSorting(false)
      setComparingIndices([])
      setSwappingIndices([])
      return
    }

    const currentStep = sortSteps[step]

    if (currentStep.type === "compare") {
      setComparingIndices(currentStep.indices)
      setSwappingIndices([])
    } else if (currentStep.type === "swap") {
      setComparingIndices([])
      setSwappingIndices(currentStep.indices)
    } else if (currentStep.type === "sorted") {
      setComparingIndices([])
      setSwappingIndices([])
      setSortedIndices((prev) => [...prev, currentStep.index])
    }

    setArray(currentStep.array)
    setCurrentStep(step + 1)

    if (!isPaused) {
      const timeout = 1000 - speed * 9
      animationTimeoutRef.current = setTimeout(() => {
        visualizeNextStep(step + 1, sortSteps)
      }, timeout)
    }
  }

  // Pause the sorting visualization
  const pauseSorting = () => {
    setIsPaused(true)
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
  }

  // Reset the sorting visualization
  const resetSorting = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    setIsSorting(false)
    setIsPaused(false)
    setComparingIndices([])
    setSwappingIndices([])
    setSortedIndices([])
    generateArray()
  }

  // Step through the algorithm manually
  const stepForward = () => {
    if (steps.length === 0) {
      let sortSteps

      switch (sortingAlgorithm) {
        case "bubble":
          sortSteps = bubbleSort([...array])
          break
        case "selection":
          sortSteps = selectionSort([...array])
          break
        case "insertion":
          sortSteps = insertionSort([...array])
          break
        case "merge":
          sortSteps = mergeSort([...array])
          break
        case "quick":
          sortSteps = quickSort([...array])
          break
        default:
          sortSteps = bubbleSort([...array])
      }

      setSteps(sortSteps)
    }

    if (currentStep < steps.length) {
      pauseSorting()
      setIsSorting(true)
      visualizeNextStep()
    }
  }

  // Get the color for a bar based on its state
  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) {
      return "bg-green-500"
    } else if (swappingIndices.includes(index)) {
      return "bg-red-500"
    } else if (comparingIndices.includes(index)) {
      return "bg-yellow-500"
    } else {
      return "bg-blue-500"
    }
  }

  const algorithmNames: Record<string, string> = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort",
    merge: "Merge Sort",
    quick: "Quick Sort",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sorting Algorithm Visualizer</h1>

      <Card className="mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
            <div className="flex flex-wrap gap-4">
              <Select value={sortingAlgorithm} onValueChange={setSortingAlgorithm} disabled={isSorting && !isPaused}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                  <SelectItem value="quick">Quick Sort</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <span className="text-sm">Size:</span>
                <Select
                  value={arraySize.toString()}
                  onValueChange={(value) => setArraySize(Number.parseInt(value))}
                  disabled={isSorting && !isPaused}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Array Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="75">75</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Speed:</span>
                <div className="w-[150px]">
                  <Slider
                    value={[speed]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setSpeed(value[0])}
                    disabled={isSorting && !isPaused}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={resetSorting} title="Reset">
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={stepForward}
                disabled={isSorting && !isPaused}
                title="Step Forward"
              >
                <StepForward className="h-4 w-4" />
              </Button>

              {!isSorting || isPaused ? (
                <Button onClick={startSorting}>
                  <Play className="h-4 w-4 mr-2" />
                  {isPaused ? "Resume" : "Start"}
                </Button>
              ) : (
                <Button onClick={pauseSorting} variant="secondary">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}

              <Button variant="outline" onClick={generateArray} disabled={isSorting && !isPaused}>
                New Array
              </Button>
            </div>
          </div>

          <div className="flex items-end justify-center h-[400px] gap-[2px]">
            {array.map((value, index) => (
              <div
                key={index}
                className={`${getBarColor(index)} rounded-t-sm transition-all duration-100`}
                style={{
                  height: `${value * 3.5}px`,
                  width: `${Math.max(800 / arraySize - 2, 4)}px`,
                }}
                title={value.toString()}
              ></div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Sorted</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
              Current Algorithm: {algorithmNames[sortingAlgorithm]}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Learn more about how this algorithm works and its implementation details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-700 dark:text-slate-300">
              {sortingAlgorithm === "bubble" &&
                "Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order."}
              {sortingAlgorithm === "selection" &&
                "Selection Sort works by repeatedly finding the minimum element from the unsorted part of the array and putting it at the beginning."}
              {sortingAlgorithm === "insertion" &&
                "Insertion Sort builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position."}
              {sortingAlgorithm === "merge" &&
                "Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves."}
              {sortingAlgorithm === "quick" &&
                "Quick Sort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot."}
            </p>
            <Link href={`/algorithms/${sortingAlgorithm}`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Info className="h-4 w-4 mr-2" />
                View Detailed Explanation
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-800 dark:text-slate-200">Compare All Algorithms</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              See how different sorting algorithms compare in terms of time complexity, space complexity, and use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-700 dark:text-slate-300">
              Each sorting algorithm has its own strengths and weaknesses. Some are better for small datasets, others
              for nearly sorted data, and others for large datasets where performance is critical.
            </p>
            <Link href="/compare">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <GitCompare className="h-4 w-4 mr-2" />
                Compare All Algorithms
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
