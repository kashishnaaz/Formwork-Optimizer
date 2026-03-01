'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [projectData, setProjectData] = useState({
    name: '',
    location: '',
    totalFloors: '',
  })
  const [floors, setFloors] = useState([
    { floorNumber: 1, length: '', width: '', height: '' }
  ])

  const addFloor = () => {
    setFloors([...floors, {
      floorNumber: floors.length + 1,
      length: '',
      width: '',
      height: ''
    }])
  }

  const removeFloor = (index) => {
    const updated = floors.filter((_, i) => i !== index)
      .map((f, i) => ({ ...f, floorNumber: i + 1 }))
    setFloors(updated)
  }

  const updateFloor = (index, field, value) => {
    const updated = [...floors]
    updated[index][field] = value
    setFloors(updated)
  }

  const handleSubmit = async () => {
    if (!projectData.name || !projectData.location || !projectData.totalFloors) {
      alert('Please fill all project details!')
      return
    }
    if (floors.some(f => !f.length || !f.width || !f.height)) {
      alert('Please fill all floor details!')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projectData, totalFloors: parseInt(projectData.totalFloors), floors }),
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/project/${data.project.id}`)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Something went wrong!')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/">
            <button className="text-gray-400 hover:text-white transition">
              <ArrowLeft size={22} />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <Building2 className="text-orange-500" size={24} />
            <h1 className="text-xl font-bold">New Project</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Project Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 text-orange-400">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Project Name</label>
              <input
                type="text"
                placeholder="e.g. L&T Tower Mumbai"
                value={projectData.name}
                onChange={e => setProjectData({ ...projectData, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Maharashtra"
                value={projectData.location}
                onChange={e => setProjectData({ ...projectData, location: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Total Floors</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={projectData.totalFloors}
                onChange={e => setProjectData({ ...projectData, totalFloors: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Floor Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-orange-400">Floor Details</h2>
            <button
              onClick={addFloor}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition"
            >
              <Plus size={16} />
              Add Floor
            </button>
          </div>

          <div className="space-y-3">
            {floors.map((floor, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                <span className="text-orange-400 font-bold w-16 text-sm">F-{floor.floorNumber}</span>
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Length (m)</label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      value={floor.length}
                      onChange={e => updateFloor(index, 'length', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Width (m)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={floor.width}
                      onChange={e => updateFloor(index, 'width', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Height (m)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={floor.height}
                      onChange={e => updateFloor(index, 'height', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
                {floors.length > 1 && (
                  <button
                    onClick={() => removeFloor(index)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-xl font-bold text-lg transition"
        >
          {loading ? 'Creating Project...' : 'Create Project →'}
        </button>
      </div>
    </main>
  )
}