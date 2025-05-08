"use client"

import { useParams } from "next/navigation"
import { AlgorithmExplanation } from "@/components/algorithm-explanation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AlgorithmPage() {
  const params = useParams()
  const algorithm = params.algorithm as string

  const algorithmNames: Record<string, string> = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort",
    merge: "Merge Sort",
    quick: "Quick Sort",
  }

  const algorithmName = algorithmNames[algorithm] || "Algorithm"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Visualizer
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{algorithmName}</h1>
        <p className="text-muted-foreground mt-2">Detailed explanation, implementation, and analysis</p>
      </div>

      <AlgorithmExplanation algorithm={algorithm} />
    </div>
  )
}
