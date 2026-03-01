import { prisma } from '@/lib/db'
import { analyzeFormwork } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { projectId, currentInventory, panelCost } = body

    // Validate input
    if (!projectId || !currentInventory || !panelCost) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { floors: true },
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' }, 
        { status: 404 }
      )
    }

    // Get AI analysis
    const analysis = await analyzeFormwork({
      projectName: project.name,
      location: project.location,
      floors: project.floors,
      currentInventory,
      panelCost,
    })

    // Save to database
    const saved = await prisma.analysis.create({
      data: {
        projectId,
        optimalPanels: analysis.optimalPanels,
        currentInventory,
        costSaved: analysis.costSaved,
        repetitionScore: analysis.repetitionScore,
        kittingSchedule: analysis.kittingSchedule,
        repetitionGroups: analysis.repetitionGroups || {}, // Handle if null/undefined
        aiSuggestions: analysis.suggestions,
      },
    })

    return NextResponse.json({ success: true, analysis: saved })
    
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    )
  }
}