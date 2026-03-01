'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Building2, ArrowLeft, Zap, TrendingDown, BarChart3, Calendar } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function ProjectPage() {
  const { id } = useParams()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [inventory, setInventory] = useState({ currentInventory: '', panelCost: '' })

  useEffect(() => {
    fetch('/api/project')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.projects.find(p => p.id === id)
          setProject(found)
          if (found?.analysis) setAnalysis(found.analysis)
        }
        setLoading(false)
      })
  }, [id])

  const handleAnalyze = async () => {
    if (!inventory.currentInventory || !inventory.panelCost) {
      alert('Please fill inventory details!')
      return
    }
    setAnalyzing(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: id,
          currentInventory: parseInt(inventory.currentInventory),
          panelCost: parseFloat(inventory.panelCost),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Something went wrong!')
    }
    setAnalyzing(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!project) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Project not found</p>
    </div>
  )

  const chartData = analysis ? [
    { name: 'Current Inventory', panels: analysis.currentInventory, fill: '#ef4444' },
    { name: 'Optimal Panels', panels: analysis.optimalPanels, fill: '#22c55e' },
  ] : []

  const pieData = analysis ? [
    { name: 'Savings', value: analysis.costSaved },
    { name: 'Remaining Cost', value: analysis.currentInventory * 5000 - analysis.costSaved },
  ] : []

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/">
            <button className="text-gray-400 hover:text-white transition">
              <ArrowLeft size={22} />
            </button>
          </Link>
          <Building2 className="text-orange-500" size={24} />
          <div>
            <h1 className="text-xl font-bold">{project.name}</h1>
            <p className="text-sm text-gray-400">{project.location} • {project.totalFloors} Floors</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Floor Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-orange-400 mb-4">Floor Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {project.floors.map(floor => (
              <div key={floor.id} className="bg-gray-800 rounded-lg p-3 text-center">
                <p className="text-orange-400 font-bold text-sm">F-{floor.floorNumber}</p>
                <p className="text-white text-xs mt-1">{floor.length}x{floor.width}m</p>
                <p className="text-gray-400 text-xs">H: {floor.height}m</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analyze Section */}
        {!analysis && (
          <div className="bg-gray-900 border border-orange-500 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-orange-400 mb-4">
              <Zap size={20} className="inline mr-2" />
              Run AI Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Current Formwork Panels</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={inventory.currentInventory}
                  onChange={e => setInventory({ ...inventory, currentInventory: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Cost Per Panel (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={inventory.panelCost}
                  onChange={e => setInventory({ ...inventory, panelCost: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-xl font-bold transition"
            >
              {analyzing ? '🤖 AI Analyzing... Please wait...' : '⚡ Analyze with AI'}
            </button>
          </div>
        )}

       

        {/* Results */}
        {analysis && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Current Panels</p>
                <p className="text-3xl font-bold text-red-400">{analysis.currentInventory}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Optimal Panels</p>
                <p className="text-3xl font-bold text-green-400">{analysis.optimalPanels}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Cost Saved</p>
                <p className="text-3xl font-bold text-orange-400">₹{(analysis.costSaved/100000).toFixed(1)}L</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400 text-sm">Repetition Score</p>
                <p className="text-3xl font-bold text-blue-400">{analysis.repetitionScore}%</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <BarChart3 size={18} /> Panel Comparison
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                    <Bar dataKey="panels" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <TrendingDown size={18} /> Cost Savings Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      <Cell fill="#22c55e" />
                      <Cell fill="#374151" />
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-green-400 font-bold">₹{analysis.costSaved.toLocaleString()} Saved</p>
              </div>
            </div>

            {/* Kitting Schedule */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
                <Calendar size={18} /> Kitting Schedule
              </h3>
              <div className="space-y-3">
                {Array.isArray(analysis.kittingSchedule) && analysis.kittingSchedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 bg-gray-800 rounded-lg p-3">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Week {item.week}
                    </span>
                    <span className="text-gray-300 text-sm flex-1">{item.action}</span>
                    <span className="text-white font-bold text-sm">{item.panelsNeeded} panels</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Repetition Groups */}
{analysis.repetitionGroups && (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
    <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
      🔄 Repetition Groups
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {JSON.parse(JSON.stringify(analysis.repetitionGroups)).map((group, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-400 font-bold">{group.groupName}</span>
            <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
              {group.floors.length} Floors
            </span>
          </div>
          <p className="text-gray-300 text-sm mb-2">{group.reason}</p>
          <div className="flex flex-wrap gap-2">
            {group.floors.map((floor, i) => (
              <span key={i} className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
                F-{floor}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{/* BoQ Table */}
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
  <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
    📋 Bill of Quantities (BoQ)
  </h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="text-left text-gray-400 py-3 px-4">Item</th>
          <th className="text-right text-gray-400 py-3 px-4">Current</th>
          <th className="text-right text-gray-400 py-3 px-4">Optimal</th>
          <th className="text-right text-gray-400 py-3 px-4">Savings</th>
          <th className="text-right text-gray-400 py-3 px-4">Cost Saved</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-800 hover:bg-gray-800 transition">
          <td className="py-3 px-4 text-white font-medium">Formwork Panels</td>
          <td className="py-3 px-4 text-right text-red-400">{analysis.currentInventory}</td>
          <td className="py-3 px-4 text-right text-green-400">{analysis.optimalPanels}</td>
          <td className="py-3 px-4 text-right text-blue-400">
            {analysis.currentInventory - analysis.optimalPanels} panels
          </td>
          <td className="py-3 px-4 text-right text-orange-400">
            ₹{((analysis.currentInventory - analysis.optimalPanels) * 5000).toLocaleString()}
          </td>
        </tr>
        <tr className="border-b border-gray-800 hover:bg-gray-800 transition">
          <td className="py-3 px-4 text-white font-medium">Storage Cost</td>
          <td className="py-3 px-4 text-right text-red-400">
            ₹{(analysis.currentInventory * 200).toLocaleString()}
          </td>
          <td className="py-3 px-4 text-right text-green-400">
            ₹{(analysis.optimalPanels * 200).toLocaleString()}
          </td>
          <td className="py-3 px-4 text-right text-blue-400">
            {analysis.currentInventory - analysis.optimalPanels} units
          </td>
          <td className="py-3 px-4 text-right text-orange-400">
            ₹{((analysis.currentInventory - analysis.optimalPanels) * 200).toLocaleString()}
          </td>
        </tr>
        <tr className="hover:bg-gray-800 transition">
          <td className="py-3 px-4 text-white font-medium">Labor Cost</td>
          <td className="py-3 px-4 text-right text-red-400">
            ₹{(analysis.currentInventory * 150).toLocaleString()}
          </td>
          <td className="py-3 px-4 text-right text-green-400">
            ₹{(analysis.optimalPanels * 150).toLocaleString()}
          </td>
          <td className="py-3 px-4 text-right text-blue-400">
            {analysis.currentInventory - analysis.optimalPanels} units
          </td>
          <td className="py-3 px-4 text-right text-orange-400">
            ₹{((analysis.currentInventory - analysis.optimalPanels) * 150).toLocaleString()}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr className="border-t-2 border-orange-500">
          <td className="py-3 px-4 text-white font-bold">Total</td>
          <td className="py-3 px-4"></td>
          <td className="py-3 px-4"></td>
          <td className="py-3 px-4"></td>
          <td className="py-3 px-4 text-right text-orange-400 font-bold text-lg">
            ₹{analysis.costSaved.toLocaleString()}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

            {/* AI Suggestions */}
            <div className="bg-gray-900 border border-green-800 rounded-xl p-6">
              <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                🤖 AI Suggestions
              </h3>
              <p className="text-gray-300 leading-relaxed">{analysis.aiSuggestions}</p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}