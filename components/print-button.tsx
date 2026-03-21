'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Printer, CheckCircle, FileDown } from 'lucide-react'

export function PrintButton() {
  const [state, setState] = useState<'idle' | 'success'>('idle')

  const handlePrint = () => {
    setState('success')
    setTimeout(() => {
      window.print()
      setTimeout(() => setState('idle'), 2000)
    }, 300)
  }

  return (
    <div className="print-button fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {/* Tooltip */}
      <AnimatePresence>
        {state === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
            style={{
              background: 'rgba(0,255,135,0.1)',
              border: '1px solid rgba(0,255,135,0.25)',
              color: '#00FF87',
              fontFamily: 'var(--font-jetbrains)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <CheckCircle size={11} />
            Opening print dialog…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        type="button"
        onClick={handlePrint}
        title="Export as PDF (Ctrl+P)"
        aria-label="Export portfolio as PDF"
        className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--card-border)',
          color: 'var(--muted-foreground)',
          fontFamily: 'var(--font-jetbrains)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
        whileHover={{
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
          boxShadow: '0 0 20px var(--glow)',
          scale: 1.04,
        }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Shimmer on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.06), transparent)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
        />

        <AnimatePresence mode="wait">
          {state === 'idle' ? (
            <motion.span key="idle" className="flex items-center gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FileDown size={13} />
              Export PDF
            </motion.span>
          ) : (
            <motion.span key="success" className="flex items-center gap-2"
              style={{ color: '#00FF87' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
                <Printer size={13} />
              </motion.div>
              Printing…
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}