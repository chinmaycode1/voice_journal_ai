import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Entry } from '../types'
import { MOOD_CONFIG } from './moodConfig'
import { AI_MODES } from './aiModes'

export async function exportJournalAsPDF(entries: Entry[], username: string) {
  // Create hidden container
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.width = '800px'
  container.style.padding = '40px'
  container.style.backgroundColor = '#ffffff'
  container.style.fontFamily = 'Inter, sans-serif'
  document.body.appendChild(container)

  // Build HTML content
  let html = `
    <div style="margin-bottom: 40px;">
      <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 32px; color: #09090F; margin-bottom: 8px;">
        ${username}'s Journal
      </h1>
      <p style="color: #666; font-size: 14px;">
        Exported on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 4px;">
        Total Entries: ${entries.length}
      </p>
    </div>
  `

  entries.forEach((entry, index) => {
    const mood = MOOD_CONFIG[entry.mood]
    const mode = AI_MODES.find((m) => m.id === entry.ai_mode)
    const date = new Date(entry.created_at)

    html += `
      <div style="margin-bottom: 32px; padding: 20px; border-left: 4px solid ${mood.color}; background: #f9f9f9; border-radius: 8px;">
        <div style="margin-bottom: 12px;">
          <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 18px; color: #09090F; margin: 0 0 4px 0;">
            Entry ${entries.length - index}
          </h2>
          <p style="font-size: 12px; color: #666; margin: 0;">
            ${date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <div style="margin-top: 8px; display: flex; gap: 8px; align-items: center;">
            <span style="display: inline-block; padding: 4px 12px; background: ${mood.color}20; color: ${mood.color}; border-radius: 12px; font-size: 11px; font-weight: 600;">
              ${mood.emoji} ${mood.label}
            </span>
            <span style="display: inline-block; padding: 4px 12px; background: ${mode?.color}20; color: ${mode?.color}; border-radius: 12px; font-size: 11px; font-weight: 600;">
              ${mode?.emoji} ${mode?.name}
            </span>
          </div>
        </div>
        
        <div style="margin-bottom: 16px;">
          <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600;">
            Your Words
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #333;">
            ${entry.transcript}
          </p>
        </div>
        
        <div>
          <p style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600;">
            AI Response
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #333; font-style: italic;">
            ${entry.ai_response}
          </p>
        </div>
        
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999;">
          ${entry.word_count} words • ${entry.xp_earned} XP earned
        </div>
      </div>
    `
  })

  container.innerHTML = html

  try {
    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: '#ffffff'
    })

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= 297 // A4 height in mm

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297
    }

    // Download
    const filename = `voicejournal-export-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(filename)
  } catch (error) {
    console.error('PDF export error:', error)
    throw error
  } finally {
    // Clean up
    document.body.removeChild(container)
  }
}
