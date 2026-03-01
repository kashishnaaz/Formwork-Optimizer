import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, location, totalFloors, floors } = body

    const project = await prisma.project.create({
      data: {
        name,
        location,
        totalFloors,
        floors: {
          create: floors.map(f => ({
            floorNumber: f.floorNumber,
            length: parseFloat(f.length),
            width: parseFloat(f.width),
            height: parseFloat(f.height),
          })),
        },
      },
      include: { floors: true },
    })

    return NextResponse.json({ success: true, project })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { floors: true, analysis: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}