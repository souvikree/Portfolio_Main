// ============================================================
// TESTIMONIALS DATA
// ============================================================
// When you receive a LinkedIn recommendation:
// 1. Replace a placeholder entry below with real data
// 2. Set FEATURES.testimonials = true in lib/feature-flags.ts
// 3. Optionally add a photo to public/images/testimonials/
// ============================================================

export interface Testimonial {
  id:          string
  name:        string
  role:        string
  company:     string
  relation:    string       
  text:        string
  date:        string
  linkedinUrl: string
  photoUrl?:   string        
  placeholder: boolean       
}

export const testimonials: Testimonial[] = [
  {
    id:          'placeholder-1',
    name:        'Your Manager / Colleague',
    role:        'Role · Company',
    company:     'Company Name',
    relation:    'Worked together at ___',
    text:        'Your LinkedIn recommendation will appear here. Once you receive a recommendation, paste the text here and set placeholder: false.',
    date:        'Coming soon',
    linkedinUrl: 'https://linkedin.com/in/linkwithsouvik',
    placeholder: true,
  },
  {
    id:          'placeholder-2',
    name:        'Your Mentor / Peer',
    role:        'Role · Company',
    company:     'Company Name',
    relation:    'Collaborated on ___',
    text:        'Your second LinkedIn recommendation will appear here. Great work speaks for itself — this space is reserved for someone who witnessed yours.',
    date:        'Coming soon',
    linkedinUrl: 'https://linkedin.com/in/linkwithsouvik',
    placeholder: true,
  },
]