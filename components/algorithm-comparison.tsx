"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlgorithmExplanation } from "@/components/algorithm-explanation"

export function AlgorithmComparison() {
  const [tabValue, setTabValue] = useState("comparison")

  return (
    <Card className="mt-8 border border-slate-200 dark:border-slate-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-800 dark:text-slate-200">Algorithm Comparison & Details</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Compare different sorting algorithms and understand their implementations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="bubble">Bubble</TabsTrigger>
            <TabsTrigger value="selection">Selection</TabsTrigger>
            <TabsTrigger value="insertion">Insertion</TabsTrigger>
            <TabsTrigger value="merge">Merge</TabsTrigger>
            <TabsTrigger value="quick">Quick</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="text-slate-700 dark:text-slate-300">Algorithm</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Time Complexity (Best)</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Time Complexity (Average)</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Time Complexity (Worst)</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Space Complexity</TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">Stable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Bubble Sort</TableCell>
                  <TableCell>O(n)</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(1)</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Selection Sort</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(1)</TableCell>
                  <TableCell>No</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Insertion Sort</TableCell>
                  <TableCell>O(n)</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(1)</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Merge Sort</TableCell>
                  <TableCell>O(n log n)</TableCell>
                  <TableCell>O(n log n)</TableCell>
                  <TableCell>O(n log n)</TableCell>
                  <TableCell>O(n)</TableCell>
                  <TableCell>Yes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Quick Sort</TableCell>
                  <TableCell>O(n log n)</TableCell>
                  <TableCell>O(n log n)</TableCell>
                  <TableCell>O(n²)</TableCell>
                  <TableCell>O(log n)</TableCell>
                  <TableCell>No</TableCell>
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
                      <strong>Bubble Sort:</strong> Educational purposes, very small datasets, or nearly sorted data.
                    </li>
                    <li>
                      <strong>Selection Sort:</strong> Small datasets where memory writes are expensive.
                    </li>
                    <li>
                      <strong>Insertion Sort:</strong> Small datasets, online algorithms (sorting as data arrives), or
                      nearly sorted data.
                    </li>
                    <li>
                      <strong>Merge Sort:</strong> Large datasets, stable sorting is required, or external sorting.
                    </li>
                    <li>
                      <strong>Quick Sort:</strong> General-purpose sorting, large datasets, or when average performance
                      matters more than worst-case scenarios.
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
                      <strong>Stable Sort:</strong> Preserves the relative order of equal elements.
                    </li>
                    <li>
                      <strong>In-place Sort:</strong> Requires O(1) extra space.
                    </li>
                    <li>
                      <strong>Adaptive Sort:</strong> Takes advantage of existing order in the input.
                    </li>
                    <li>
                      <strong>Comparison Sort:</strong> Based on comparing elements.
                    </li>
                    <li>
                      <strong>Divide and Conquer:</strong> Breaks the problem into smaller subproblems.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bubble">
            <AlgorithmExplanation algorithm="bubble" />
          </TabsContent>

          <TabsContent value="selection">
            <AlgorithmExplanation algorithm="selection" />
          </TabsContent>

          <TabsContent value="insertion">
            <AlgorithmExplanation algorithm="insertion" />
          </TabsContent>

          <TabsContent value="merge">
            <AlgorithmExplanation algorithm="merge" />
          </TabsContent>

          <TabsContent value="quick">
            <AlgorithmExplanation algorithm="quick" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
