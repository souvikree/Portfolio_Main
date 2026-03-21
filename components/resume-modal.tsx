'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Document, Page, pdfjs } from 'react-pdf'
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Maximize2, Loader } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDF_PATH = '/resume/Souvik__Ghosh__Resume.pdf'
const DOWNLOAD_NAME = 'Souvik_Ghosh_Resume.pdf'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: Props) {
  const [numPages, setNumPages]   = useState<number>(0)
  const [pageNumber, setPage]     = useState(1)
  const [scale, setScale]         = useState(1.0)
  const [loading, setLoading]     = useState(true)
  const [pageWidth, setPageWidth] = useState(700)

  // Responsive page width
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      if (vw < 640)       setPageWidth(vw - 48)
      else if (vw < 1024) setPageWidth(560)
      else                setPageWidth(700)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Keyboard shortcuts
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === 'Escape')      onClose()
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      setPage((p) => Math.min(p + 1, numPages))
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      setPage((p) => Math.max(p - 1, 1))
    if (e.key === '+' || e.key === '=')
      setScale((s) => Math.min(s + 0.15, 2.0))
    if (e.key === '-')
      setScale((s) => Math.max(s - 0.15, 0.5))
  }, [isOpen, numPages, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Reset on open
  useEffect(() => {
    if (isOpen) { setPage(1); setScale(1.0); setLoading(true) }
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const prevPage = () => setPage((p) => Math.max(p - 1, 1))
  const nextPage = () => setPage((p) => Math.min(p + 1, numPages))
  const zoomIn   = () => setScale((s) => Math.min(parseFloat((s + 0.15).toFixed(2)), 2.0))
  const zoomOut  = () => setScale((s) => Math.max(parseFloat((s - 0.15).toFixed(2)), 0.5))
  const zoomFit  = () => setScale(1.0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(3,3,8,0.92)', backdropFilter: 'blur(14px)' }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="relative z-10 flex flex-col m-auto w-full"
            style={{
              maxWidth: pageWidth + 80,
              maxHeight: '96vh',
              background: 'var(--background)',
              border: '1px solid rgba(0,245,255,0.2)',
              borderRadius: 20,
              boxShadow: '0 0 80px rgba(0,245,255,0.1), 0 32px 80px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
            initial={{ scale: 0.9, y: 32, opacity: 0, filter: 'blur(6px)' }}
            animate={{ scale: 1, y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 0.9, y: 16, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-[3px] w-full flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), var(--highlight))' }} />

            {/* ── Toolbar ── */}
            <div
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--card-border)' }}
            >
              {/* Mac dots */}
              <div className="flex items-center gap-1.5 mr-2">
                {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
                  <span key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>

              {/* Title */}
              <span className="text-xs font-bold flex-1"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                Souvik_Ghosh_Resume.pdf
              </span>

              {/* Page info */}
              {numPages > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg"
                  style={{ background: 'var(--muted)', border: '1px solid var(--card-border)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-jetbrains)' }}>
                    {pageNumber}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                    / {numPages}
                  </span>
                </div>
              )}

              {/* Zoom controls */}
              <div className="flex items-center gap-1">
                <button type="button" onClick={zoomOut}
                  title="Zoom out (-)"
                  aria-label="Zoom out"
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}>
                  <ZoomOut size={13} />
                </button>

                <button type="button" onClick={zoomFit}
                  title="Reset zoom"
                  aria-label="Reset zoom"
                  className="px-2 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)', minWidth: 48 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}>
                  {Math.round(scale * 100)}%
                </button>

                <button type="button" onClick={zoomIn}
                  title="Zoom in (+)"
                  aria-label="Zoom in"
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}>
                  <ZoomIn size={13} />
                </button>
              </div>

              {/* Fit width */}
              <button type="button" onClick={zoomFit}
                title="Fit to width"
                aria-label="Fit to width"
                className="w-8 h-8 items-center justify-center rounded-lg transition-all hidden sm:flex"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}>
                <Maximize2 size={13} />
              </button>

              {/* Download */}
              <a
                href={PDF_PATH}
                download={DOWNLOAD_NAME}
                title="Download PDF"
                aria-label="Download PDF"
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                style={{ background: 'rgba(0,245,255,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,245,255,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#050508'; e.currentTarget.style.boxShadow = '0 0 16px var(--glow)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,245,255,0.08)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.boxShadow = 'none' }}>
                <Download size={13} />
              </a>

              {/* Close */}
              <button type="button" onClick={onClose}
                title="Close (Esc)"
                aria-label="Close modal"
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--card-border)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FF5F57'; e.currentTarget.style.borderColor = '#FF5F57' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.borderColor = 'var(--card-border)' }}>
                <X size={13} />
              </button>
            </div>

            {/* ── PDF viewer ── */}
            <div
              className="flex-1 overflow-auto flex items-start justify-center"
              style={{ background: 'rgba(0,0,0,0.3)', padding: '24px 16px' }}
            >
              <Document
                file={PDF_PATH}
                onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false) }}
                onLoadError={() => setLoading(false)}
                loading={
                  <div className="flex flex-col items-center gap-4 py-20">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Loader size={28} style={{ color: 'var(--accent)' }} />
                    </motion.div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                      Loading resume...
                    </span>
                  </div>
                }
              >
                <motion.div
                  key={pageNumber}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth * scale}
                    renderTextLayer
                    renderAnnotationLayer
                  />
                </motion.div>
              </Document>
            </div>

            {/* ── Page navigation footer ── */}
            {numPages > 1 && (
              <div
                className="flex items-center justify-center gap-4 py-3 flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--card-border)' }}
              >
                <motion.button
                  type="button"
                  onClick={prevPage}
                  disabled={pageNumber <= 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: pageNumber <= 1 ? 'transparent' : 'var(--muted)',
                    color: pageNumber <= 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
                    border: '1px solid var(--card-border)',
                    opacity: pageNumber <= 1 ? 0.4 : 1,
                    cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                  whileHover={pageNumber > 1 ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
                  whileTap={pageNumber > 1 ? { scale: 0.97 } : {}}
                >
                  <ChevronLeft size={14} /> Prev
                </motion.button>

                {/* Page dots */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: numPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i + 1)}
                      aria-label={`Go to page ${i + 1}`}
                      className="rounded-full transition-all"
                      style={{
                        width: i + 1 === pageNumber ? 20 : 6,
                        height: 6,
                        background: i + 1 === pageNumber ? 'var(--accent)' : 'var(--card-border)',
                        boxShadow: i + 1 === pageNumber ? '0 0 8px var(--glow)' : 'none',
                      }}
                    />
                  ))}
                </div>

                <motion.button
                  type="button"
                  onClick={nextPage}
                  disabled={pageNumber >= numPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: pageNumber >= numPages ? 'transparent' : 'var(--muted)',
                    color: pageNumber >= numPages ? 'var(--muted-foreground)' : 'var(--foreground)',
                    border: '1px solid var(--card-border)',
                    opacity: pageNumber >= numPages ? 0.4 : 1,
                    cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-jetbrains)',
                  }}
                  whileHover={pageNumber < numPages ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
                  whileTap={pageNumber < numPages ? { scale: 0.97 } : {}}
                >
                  Next <ChevronRight size={14} />
                </motion.button>
              </div>
            )}

            {/* Keyboard hints */}
            <div className="flex items-center justify-center gap-4 py-2 flex-shrink-0"
              style={{ borderTop: '1px solid var(--card-border)' }}>
              {[
                { key: '← →', label: 'navigate' },
                { key: '+ −', label: 'zoom' },
                { key: 'Esc', label: 'close' },
              ].map(({ key, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{ background: 'var(--muted)', color: 'var(--accent)', border: '1px solid var(--card-border)', fontFamily: 'var(--font-jetbrains)' }}>
                    {key}
                  </span>
                  <span className="text-[9px]" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-jetbrains)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}