import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function analyzeFormwork(projectData) {
  const { projectName, location, floors, currentInventory, panelCost } = projectData

  const floorDetails = floors
    .map(f => `Floor ${f.floorNumber}: ${f.length}m x ${f.width}m x ${f.height}m`)
    .join('\n')

  const prompt = `
You are an expert construction engineer specializing in formwork optimization.

Analyze this construction project and optimize formwork usage:

PROJECT: ${projectName}
LOCATION: ${location}
TOTAL FLOORS: ${floors.length}
CURRENT FORMWORK INVENTORY: ${currentInventory} panels
COST PER PANEL: ₹${panelCost}

FLOOR DETAILS:
${floorDetails}

Respond in this EXACT JSON format only, no extra text, no markdown, no backticks:
{
  "optimalPanels": <minimum panels needed as number>,
  "repetitionScore": <percentage of floors that are similar as number 0-100>,
  "costSaved": <money saved in rupees as number>,
  "repetitionGroups": [
    {
      "groupName": "Group A",
      "floors": [1,2,3],
      "reason": "Same dimensions"
    }
  ],
  "kittingSchedule": [
    {
      "week": 1,
      "floors": [1,2],
      "panelsNeeded": 50,
      "action": "Setup initial formwork"
    }
  ],
  "suggestions": "Your optimization suggestions here as plain text"
}
`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  })

  const responseText = response.choices[0].message.content
  const cleanResponse = responseText.replace(/```json|```/g, '').trim()
  return JSON.parse(cleanResponse)
}