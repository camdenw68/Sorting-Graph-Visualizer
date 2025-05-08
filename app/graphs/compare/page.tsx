"use client"

import { GraphComparison } from "@/components/graph-comparison"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CompareGraphAlgorithmsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/graphs">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Graph Visualizer
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Graph Algorithm Comparison</h1>
        <p className="text-muted-foreground mt-2">Compare different graph algorithms and their characteristics</p>
      </div>

      <GraphComparison />
    </div>
  )
}
