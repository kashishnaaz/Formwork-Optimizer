import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const { id } = await  params
    await prisma.analysis.deleteMany({ where: { projectId: id } })
    await prisma.floor.deleteMany({ where: { projectId: id } })
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}