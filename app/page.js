'use client'
import { useState, useEffect } from 'react'
import { Building2, Plus, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

 useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/project', { cache: 'no-store' })
        const data = await res.json()
        if (data.success) setProjects(data.projects)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const deleteProject = async (e, projectId) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this project?')) return
    try {
      await fetch(`/api/project/${projectId}`, { method: 'DELETE' })
      setProjects(projects.filter(p => p.id !== projectId))
    } catch (err) {
      alert('Error deleting project!')
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 className="text-orange-500" size={28} />
            <div>
              <h1 className="text-xl font-bold text-white">FormworkAI</h1>
              <p className="text-xs text-gray-400">BoQ Optimization System</p>
            </div>
          </div>
          <Link href="/project/new">
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition">
              <Plus size={18} />
              New Project
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Projects</h2>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No projects yet</p>
            <p className="text-gray-600 mb-6">Create your first project to get started</p>
            <Link href="/project/new">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition">
                Create First Project
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <Link href={`/project/${project.id}`} key={project.id}>
                <div className="bg-gray-900 border border-gray-800 hover:border-orange-500 rounded-xl p-5 cursor-pointer transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-white">{project.name}</h3>
                      <p className="text-gray-400 text-sm">{project.location}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${project.analysis ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
                      {project.analysis ? 'Analyzed' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{project.totalFloors} Floors</span>
                    <span>{project.floors.length} Floor Data</span>
                  </div>
                  {project.analysis && (
  <div className="mt-3 pt-3 border-t border-gray-800">
    <p className="text-green-400 text-sm font-medium">
      ₹{project.analysis.costSaved.toLocaleString()} Saved
    </p>
    <button
      onClick={(e) => deleteProject(e, project.id)}
      className="mt-2 text-red-400 hover:text-red-300 text-xs transition"
    >
      🗑️ Delete Project
    </button>
  </div>
)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}