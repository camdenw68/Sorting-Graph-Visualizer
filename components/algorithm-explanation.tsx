"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export function AlgorithmExplanation({ algorithm }: { algorithm: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  const algorithmData: Record<
    string,
    {
      title: string
      description: string
      overview: string
      timeComplexity: {
        best: string
        average: string
        worst: string
        space: string
      }
      pseudocode: string
      pythonCode: string
      useCases: string[]
      pros: string[]
      cons: string[]
    }
  > = {
    bubble: {
      title: "Bubble Sort",
      description: "A simple comparison-based sorting algorithm",
      overview:
        "Bubble Sort is one of the simplest sorting algorithms. It works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
      timeComplexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      },
      pseudocode: `procedure bubbleSort(A: list of sortable items)
    n = length(A)
    repeat
        swapped = false
        for i = 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure`,
      pythonCode: `def bubble_sort(arr):
    n = len(arr)
    # Traverse through all array elements
    for i in range(n):
        # Last i elements are already in place
        for j in range(0, n-i-1):
            # Traverse the array from 0 to n-i-1
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Example usage
arr = [64, 34, 25, 12, 22, 11, 90]
sorted_arr = bubble_sort(arr)
print("Sorted array:", sorted_arr)`,
      useCases: [
        "Educational purposes to teach sorting algorithms",
        "Small datasets where simplicity is more important than efficiency",
        "Nearly sorted arrays where only a few elements are out of place",
      ],
      pros: ["Simple to understand and implement", "Requires minimal extra memory (in-place sorting)"],
      cons: [
        "Very inefficient for large datasets",
        "Much slower than more advanced algorithms like Quick Sort or Merge Sort",
      ],
    },
    selection: {
      title: "Selection Sort",
      description: "A simple comparison-based sorting algorithm",
      overview:
        "Selection Sort is an in-place comparison sorting algorithm. It divides the input list into two parts: a sorted sublist of items which is built up from left to right, and a sublist of the remaining unsorted items. The algorithm repeatedly selects the smallest (or largest) element from the unsorted sublist, and moves it to the end of the sorted sublist.",
      timeComplexity: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      },
      pseudocode: `procedure selectionSort(A: list of sortable items)
    n = length(A)
    for i = 0 to n-1 inclusive do
        min_idx = i
        for j = i+1 to n inclusive do
            if A[j] < A[min_idx] then
                min_idx = j
            end if
        end for
        swap(A[i], A[min_idx])
    end for
end procedure`,
      pythonCode: `def selection_sort(arr):
    n = len(arr)
    
    # Traverse through all array elements
    for i in range(n):
        # Find the minimum element in remaining unsorted array
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
                
        # Swap the found minimum element with the first element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr

# Example usage
arr = [64, 25, 12, 22, 11]
sorted_arr = selection_sort(arr)
print("Sorted array:", sorted_arr)`,
      useCases: [
        "Educational purposes to teach sorting algorithms",
        "Small datasets where simplicity is more important than efficiency",
        "When memory usage is a concern (in-place sorting)",
      ],
      pros: [
        "Simple to understand and implement",
        "Performs well on small datasets",
        "Requires minimal extra memory (in-place sorting)",
        "Makes the minimum possible number of swaps (n-1 in the worst case)",
      ],
      cons: [
        "Inefficient for large datasets with O(n²) time complexity",
        "Does not adapt to the data in any way (always performs the same operations)",
        "Much slower than more advanced algorithms like Quick Sort or Merge Sort",
      ],
    },
    insertion: {
      title: "Insertion Sort",
      description: "A simple comparison-based sorting algorithm",
      overview:
        "Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as Quick Sort, Heap Sort, or Merge Sort. However, it provides several advantages: simple implementation, efficient for small datasets, and more efficient in practice than most other simple O(n²) algorithms such as Selection Sort or Bubble Sort.",
      timeComplexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      },
      pseudocode: `procedure insertionSort(A: list of sortable items)
    n = length(A)
    for i = 1 to n-1 inclusive do
        key = A[i]
        j = i-1
        while j >= 0 and A[j] > key do
            A[j+1] = A[j]
            j = j-1
        end while
        A[j+1] = key
    end for
end procedure`,
      pythonCode: `def insertion_sort(arr):
    # Traverse through 1 to len(arr)
    for i in range(1, len(arr)):
        key = arr[i]
        
        # Move elements of arr[0..i-1], that are greater than key,
        # to one position ahead of their current position
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    
    return arr

# Example usage
arr = [12, 11, 13, 5, 6]
sorted_arr = insertion_sort(arr)
print("Sorted array:", sorted_arr)`,
      useCases: [
        "Small datasets or nearly sorted datasets",
        "Online algorithms where items are coming in one at a time",
        "Auxiliary routine in more complex algorithms",
        "When simplicity of implementation is a concern",
      ],
      pros: [
        "Simple to implement",
        "Efficient for small datasets",
        "More efficient in practice than most other simple O(n²) algorithms",
        "Adaptive - efficient for datasets that are already substantially sorted",
        "Stable - does not change the relative order of elements with equal keys",
        "In-place - only requires a constant amount O(1) of additional memory space",
        "Online - can sort a list as it receives it",
      ],
      cons: [
        "Inefficient for large datasets",
        "Much slower than more advanced algorithms like Quick Sort, Heap Sort, or Merge Sort",
      ],
    },
    merge: {
      title: "Merge Sort",
      description: "An efficient, stable, comparison-based, divide and conquer sorting algorithm",
      overview:
        "Merge Sort is an efficient, stable, comparison-based, divide and conquer sorting algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
      timeComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
      },
      pseudocode: `procedure mergeSort(A: list of sortable items)
    if length(A) <= 1 then
        return A
    end if
    
    middle = length(A) / 2
    left = mergeSort(A[0...middle-1])
    right = mergeSort(A[middle...length(A)-1])
    
    return merge(left, right)
end procedure

procedure merge(left: list, right: list)
    result = []
    while length(left) > 0 and length(right) > 0 do
        if left[0] <= right[0] then
            append left[0] to result
            left = left[1...length(left)-1]
        else
            append right[0] to result
            right = right[1...length(right)-1]
        end if
    end while
    
    while length(left) > 0 do
        append left[0] to result
        left = left[1...length(left)-1]
    end while
    
    while length(right) > 0 do
        append right[0] to result
        right = right[1...length(right)-1]
    end while
    
    return result
end procedure`,
      pythonCode: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    # Finding the middle of the array
    mid = len(arr) // 2
    
    # Dividing the array elements into 2 halves
    left = arr[:mid]
    right = arr[mid:]
    
    # Sorting the first half
    left = merge_sort(left)
    
    # Sorting the second half
    right = merge_sort(right)
    
    # Merge the sorted halves
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    # Merge the two arrays into result[]
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result

# Example usage
arr = [38, 27, 43, 3, 9, 82, 10]
sorted_arr = merge_sort(arr)
print("Sorted array:", sorted_arr)`,
      useCases: [
        "When stability is required (maintaining the relative order of equal elements)",
        "External sorting of large datasets that don't fit in memory",
        "Linked list sorting (can be implemented without extra space for linked lists)",
        "Inversion count problem",
        "When worst-case performance is important (always O(n log n))",
      ],
      pros: [
        "Guaranteed O(n log n) performance regardless of input data",
        "Stable sort - preserves the order of equal elements",
        "Parallelizable - different parts of the array can be sorted in parallel",
        "Works well for external sorting where data doesn't fit in memory",
      ],
      cons: [
        "Requires O(n) extra space for the merge operation in typical implementations",
        "Not an in-place sorting algorithm in most implementations",
        "Overkill for small arrays (insertion sort is often faster for small arrays)",
        "Has a higher constant factor than quicksort in many implementations",
      ],
    },
    quick: {
      title: "Quick Sort",
      description: "An efficient divide and conquer sorting algorithm",
      overview:
        "Quick Sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. This can be done in-place, requiring small additional amounts of memory to perform the sorting.",
      timeComplexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)",
      },
      pseudocode: `procedure quickSort(A: list of sortable items, lo: int, hi: int)
    if lo < hi then
        p = partition(A, lo, hi)
        quickSort(A, lo, p - 1)
        quickSort(A, p + 1, hi)
    end if
end procedure

procedure partition(A: list of sortable items, lo: int, hi: int)
    pivot = A[hi]
    i = lo - 1
    for j = lo to hi - 1 do
        if A[j] <= pivot then
            i = i + 1
            swap A[i] with A[j]
        end if
    end for
    swap A[i + 1] with A[hi]
    return i + 1
end procedure`,
      pythonCode: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    def partition(arr, low, high):
        # Choose the rightmost element as pivot
        pivot = arr[high]
        
        # Pointer for greater element
        i = low - 1
        
        # Compare each element with pivot
        for j in range(low, high):
            if arr[j] <= pivot:
                # If element smaller than pivot is found
                # swap it with the greater element pointed by i
                i += 1
                
                # Swapping element at i with element at j
                arr[i], arr[j] = arr[j], arr[i]
        
        # Swap the pivot element with the greater element at i
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        
        # Return the position from where partition is done
        return i + 1
    
    def quick_sort_helper(arr, low, high):
        if low < high:
            # Find pivot element such that
            # element smaller than pivot are on the left
            # element greater than pivot are on the right
            pi = partition(arr, low, high)
            
            # Recursive call on the left of pivot
            quick_sort_helper(arr, low, pi - 1)
            
            # Recursive call on the right of pivot
            quick_sort_helper(arr, pi + 1, high)
    
    # Create a copy of the array to avoid modifying the original
    result = arr.copy()
    quick_sort_helper(result, 0, len(result) - 1)
    return result

# Example usage
arr = [10, 7, 8, 9, 1, 5]
sorted_arr = quick_sort(arr)
print("Sorted array:", sorted_arr)`,
      useCases: [
        "General-purpose sorting when average-case performance matters more than worst-case",
        "Systems with good cache locality benefit from Quick Sort's in-place nature",
        "When space complexity is a concern (uses O(log n) stack space)",
        "Internal sorting of arrays in memory",
      ],
      pros: [
        "Usually faster in practice than other O(n log n) algorithms like Merge Sort",
        "In-place sorting with low memory usage (O(log n) stack space)",
        "Cache-friendly due to good locality of reference",
        "Can be easily parallelized for multi-core systems",
        "Tail recursion can be optimized in many implementations",
      ],
      cons: [
        "Worst-case time complexity is O(n²) when poorly implemented or with bad pivot choices",
        "Not stable - relative order of equal elements may change",
        "Performance depends heavily on the pivot selection strategy",
        "Less efficient for arrays that are nearly sorted or have many duplicate elements",
      ],
    },
  }

  const currentAlgorithm = algorithmData[algorithm] || {
    title: "Algorithm",
    description: "No information available for this algorithm",
    overview: "No overview available.",
    timeComplexity: {
      best: "N/A",
      average: "N/A",
      worst: "N/A",
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
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">Best Case:</span> {currentAlgorithm.timeComplexity.best}
                      </li>
                      <li>
                        <span className="font-medium">Average Case:</span> {currentAlgorithm.timeComplexity.average}
                      </li>
                      <li>
                        <span className="font-medium">Worst Case:</span> {currentAlgorithm.timeComplexity.worst}
                      </li>
                    </ul>
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
                    {algorithm === "bubble" && (
                      <p>
                        Bubble Sort has O(n²) worst and average case because it uses nested loops to compare adjacent
                        elements. The best case of O(n) occurs when the array is already sorted and we use an optimized
                        version that can detect this.
                      </p>
                    )}
                    {algorithm === "selection" && (
                      <p>
                        Selection Sort always has O(n²) time complexity because it must scan the unsorted portion of the
                        array to find the minimum element in each pass, regardless of the input data's arrangement.
                      </p>
                    )}
                    {algorithm === "insertion" && (
                      <p>
                        Insertion Sort has O(n²) worst and average case due to nested loops, but achieves O(n) in the
                        best case when the array is already sorted because the inner loop doesn't execute.
                      </p>
                    )}
                    {algorithm === "merge" && (
                      <p>
                        Merge Sort consistently performs at O(n log n) for all cases because it always divides the array
                        in half and takes linear time to merge the halves. It requires O(n) extra space for the merging
                        process.
                      </p>
                    )}
                    {algorithm === "quick" && (
                      <p>
                        Quick Sort has O(n log n) best and average cases, but can degrade to O(n²) in the worst case
                        when the pivot selection consistently results in highly unbalanced partitions, such as with
                        already sorted arrays and poor pivot choices.
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
                    {algorithm === "bubble" && (
                      <p>
                        Use Bubble Sort when simplicity is more important than efficiency, such as for educational
                        purposes or very small datasets. It's also useful when the list is nearly sorted, as an
                        optimized version can detect when the list becomes sorted.
                      </p>
                    )}
                    {algorithm === "selection" && (
                      <p>
                        Use Selection Sort when memory writes are expensive but comparisons are not, as it makes the
                        minimum possible number of swaps (n-1 in the worst case). It's also simple to implement and
                        works well for small datasets.
                      </p>
                    )}
                    {algorithm === "insertion" && (
                      <p>
                        Use Insertion Sort for small datasets, nearly sorted arrays, or as part of more complex
                        algorithms. It's also useful in online scenarios where you receive one element at a time and
                        need to maintain a sorted list.
                      </p>
                    )}
                    {algorithm === "merge" && (
                      <p>
                        Use Merge Sort when stability is required, when dealing with linked lists, or when predictable
                        O(n log n) performance is needed regardless of input data. It's also useful for external sorting
                        where data doesn't fit in memory.
                      </p>
                    )}
                    {algorithm === "quick" && (
                      <p>
                        Use Quick Sort for general-purpose in-memory sorting when average-case performance is more
                        important than worst-case guarantees. It works well in systems with good cache locality and when
                        memory usage is a concern.
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
