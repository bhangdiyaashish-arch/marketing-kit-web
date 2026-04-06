'use client';

import { useState } from 'react';
import type { PropertyData } from '@/lib/types';

const EMPTY_UNIT    = { name: '', type: 'tent', capacity: 2, price: 0, description: '' };
const EMPTY_EXP     = { name: '', duration: '', price: 0, description: '' };
const EMPTY_REVIEW  = { author: '', text: '', featured: false };

const DEFAULT_FORM: PropertyData = {
  name: '',
  type: 'glamping',
  location: { area: '', description: '', how_to_reach: '' },
  description: '',
  colors: { dark: '', accent: '', tint: '' },
  units: [{ ...EMPTY_UNIT }],
  experiences: [{ ...EMPTY_EXP }],
  reviews: [{ ...EMPTY_REVIEW, featured: true }],
  contact: { phone: '', email: '', website: '', instagram: '' },
  images: [],
};

type Step = 'idle' | 'content' | 'render' | 'done' | 'error';

export default function HomePage() {
  const [form, setForm] = useState<PropertyData>(DEFAULT_FORM);
  const [step, setStep] = useState<Step>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Field helpers ────────────────────────────────────────────────────────────
  const set = (path: string, value: unknown) => {
    setForm(prev => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const addUnit    = () => setForm(f => ({ ...f, units:       [...f.units,       { ...EMPTY_UNIT }] }));
  const addExp     = () => setForm(f => ({ ...f, experiences: [...f.experiences, { ...EMPTY_EXP }] }));
  const addReview  = () => setForm(f => ({ ...f, reviews:     [...f.reviews,     { ...EMPTY_REVIEW }] }));

  const removeUnit   = (i: number) => setForm(f => ({ ...f, units:       f.units.filter((_,idx) => idx !== i) }));
  const removeExp    = (i: number) => setForm(f => ({ ...f, experiences: f.experiences.filter((_,idx) => idx !== i) }));
  const removeReview = (i: number) => setForm(f => ({ ...f, reviews:     f.reviews.filter((_,idx) => idx !== i) }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setUnit   = (i: number, k: string, v: any) => setForm(f => ({ ...f, units:       f.units.map((u,idx) => idx===i ? {...u,[k]:v} : u) }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setExp    = (i: number, k: string, v: any) => setForm(f => ({ ...f, experiences: f.experiences.map((e,idx) => idx===i ? {...e,[k]:v} : e) }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setReview = (i: number, k: string, v: any) => setForm(f => ({ ...f, reviews:     f.reviews.map((r,idx) => idx===i ? {...r,[k]:v} : r) }));

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('content');
    setErrorMsg('');

    try {
      // Strip empty colors so defaults kick in
      const payload: PropertyData = {
        ...form,
        colors: form.colors.dark ? form.colors : { dark: '', accent: '', tint: '' },
      };

      setStep('render');
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${form.name.toLowerCase().replace(/\s+/g, '-')}-brochure.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setStep('done');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{ background: '#0D0F14' }}>

      {/* Header */}
      <header className="border-b border-border px-8 py-5 flex items-center justify-between">
        <div>
          <span className="text-xs tracking-widest uppercase text-gold font-medium">Marketing Kit</span>
          <h1 className="text-white font-medium text-lg mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
            Brochure Generator
          </h1>
        </div>
        <span className="text-xs text-muted">10-page A4 PDF · AI-generated copy · Instant download</span>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Loading overlay */}
        {(step === 'content' || step === 'render') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(13,15,20,0.92)' }}>
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-block w-10 h-10 border-2 rounded-full animate-spin"
                     style={{ borderColor: '#C4A24A', borderTopColor: 'transparent' }}/>
              </div>
              <p className="text-white text-base font-medium mb-2">
                {step === 'content' ? 'Generating copy with AI…' : 'Rendering 10-page brochure…'}
              </p>
              <p className="text-muted text-sm">
                {step === 'content' ? 'Writing tagline, story, experiences, archetypes…' : 'PDF will download automatically when ready'}
              </p>
            </div>
          </div>
        )}

        {/* Done banner */}
        {step === 'done' && (
          <div className="mb-6 rounded-lg px-5 py-4 flex items-center gap-3"
               style={{ background: 'rgba(196,162,74,0.12)', border: '1px solid rgba(196,162,74,0.3)' }}>
            <span className="text-gold text-lg">✓</span>
            <div>
              <p className="text-white text-sm font-medium">Brochure downloaded</p>
              <p className="text-muted text-xs mt-0.5">Check your Downloads folder.</p>
            </div>
            <button onClick={() => setStep('idle')} className="ml-auto text-xs text-muted hover:text-white transition-colors">
              Generate another
            </button>
          </div>
        )}

        {/* Error banner */}
        {step === 'error' && (
          <div className="mb-6 rounded-lg px-5 py-4"
               style={{ background: 'rgba(220,60,60,0.10)', border: '1px solid rgba(220,60,60,0.3)' }}>
            <p className="text-red-400 text-sm font-medium">Generation failed</p>
            <p className="text-muted text-xs mt-1">{errorMsg}</p>
            <button onClick={() => setStep('idle')} className="mt-2 text-xs text-gold hover:underline">Try again</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── SECTION 1: PROPERTY ── */}
          <Section title="The Property" subtitle="Basic details about the property">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Property Name" required>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Mist & Moss" required/>
              </Field>
              <Field label="Property Type" required>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="glamping">Glamping</option>
                  <option value="villa">Villa</option>
                  <option value="hotel">Hotel / Resort</option>
                  <option value="eco-lodge">Eco-Lodge</option>
                  <option value="campsite">Campsite</option>
                </select>
              </Field>
            </div>
            <Field label="Location Area">
              <input value={form.location.area} onChange={e => set('location.area', e.target.value)} placeholder="Coorg, Karnataka"/>
            </Field>
            <Field label="Short Description (context for AI — not printed)">
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="A boutique glamping retreat on a 40-acre coffee estate in the Western Ghats…"/>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Location Description">
                <textarea rows={2} value={form.location.description} onChange={e => set('location.description', e.target.value)}
                  placeholder="Tucked into a private coffee estate, 4km from Madikeri town"/>
              </Field>
              <Field label="How to Reach">
                <textarea rows={2} value={form.location.how_to_reach} onChange={e => set('location.how_to_reach', e.target.value)}
                  placeholder="5.5 hours from Bangalore via NH275. Transfers available from Madikeri."/>
              </Field>
            </div>
          </Section>

          {/* ── SECTION 2: UNITS ── */}
          <Section title="Accommodation" subtitle="Your stay options">
            {form.units.map((u, i) => (
              <div key={i} className="rounded-lg p-4 space-y-3 relative" style={{ background: '#1A1D27', border: '1px solid #252836' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gold tracking-widest uppercase">Unit {i + 1}</span>
                  {form.units.length > 1 && (
                    <button type="button" onClick={() => removeUnit(i)} className="text-xs text-muted hover:text-red-400 transition-colors">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name"><input value={u.name} onChange={e => setUnit(i,'name',e.target.value)} placeholder="Forest Tent"/></Field>
                  <Field label="Type">
                    <select value={u.type} onChange={e => setUnit(i,'type',e.target.value)}>
                      <option value="tent">Tent</option>
                      <option value="treehouse">Treehouse</option>
                      <option value="cabin">Cabin</option>
                      <option value="villa">Villa</option>
                      <option value="suite">Suite / Room</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Capacity (persons)"><input type="number" min={1} value={u.capacity} onChange={e => setUnit(i,'capacity',Number(e.target.value))}/></Field>
                  <Field label="Price per night (₹)"><input type="number" min={0} value={u.price || ''} onChange={e => setUnit(i,'price',Number(e.target.value))} placeholder="8500"/></Field>
                </div>
                <Field label="Description (optional)">
                  <input value={u.description} onChange={e => setUnit(i,'description',e.target.value)} placeholder="Canvas tent on elevated platform, king bed, private deck facing the valley"/>
                </Field>
              </div>
            ))}
            <AddButton onClick={addUnit} label="Add another unit"/>
          </Section>

          {/* ── SECTION 3: EXPERIENCES ── */}
          <Section title="Experiences & Add-ons" subtitle="Activities and things to do">
            {form.experiences.map((exp, i) => (
              <div key={i} className="rounded-lg p-4 space-y-3 relative" style={{ background: '#1A1D27', border: '1px solid #252836' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gold tracking-widest uppercase">Experience {i + 1}</span>
                  {form.experiences.length > 1 && (
                    <button type="button" onClick={() => removeExp(i)} className="text-xs text-muted hover:text-red-400 transition-colors">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name"><input value={exp.name} onChange={e => setExp(i,'name',e.target.value)} placeholder="Dawn Estate Walk"/></Field>
                  <Field label="Duration"><input value={exp.duration} onChange={e => setExp(i,'duration',e.target.value)} placeholder="90 min"/></Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price (₹, 0 = complimentary)">
                    <input type="number" min={0} value={exp.price || ''} onChange={e => setExp(i,'price',Number(e.target.value))} placeholder="800"/>
                  </Field>
                  <Field label="Description">
                    <input value={exp.description} onChange={e => setExp(i,'description',e.target.value)} placeholder="Walk through the coffee rows at first light…"/>
                  </Field>
                </div>
              </div>
            ))}
            <AddButton onClick={addExp} label="Add another experience"/>
          </Section>

          {/* ── SECTION 4: REVIEWS ── */}
          <Section title="Guest Reviews" subtitle="Real reviews printed in the brochure">
            {form.reviews.map((r, i) => (
              <div key={i} className="rounded-lg p-4 space-y-3" style={{ background: '#1A1D27', border: '1px solid #252836' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gold tracking-widest uppercase">Review {i + 1}</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer mb-0 normal-case tracking-normal text-xs text-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>
                      <input type="checkbox" checked={r.featured} onChange={e => setReview(i,'featured',e.target.checked)}
                             className="w-3 h-3 accent-amber-500" style={{ width: '14px', height: '14px' }}/>
                      Featured (shown large)
                    </label>
                    {form.reviews.length > 1 && (
                      <button type="button" onClick={() => removeReview(i)} className="text-xs text-muted hover:text-red-400 transition-colors">Remove</button>
                    )}
                  </div>
                </div>
                <Field label="Author Name">
                  <input value={r.author} onChange={e => setReview(i,'author',e.target.value)} placeholder="Ananya S., Bangalore"/>
                </Field>
                <Field label="Review Text">
                  <textarea rows={2} value={r.text} onChange={e => setReview(i,'text',e.target.value)}
                    placeholder="I came for a long weekend and extended by three days…"/>
                </Field>
              </div>
            ))}
            <AddButton onClick={addReview} label="Add another review"/>
          </Section>

          {/* ── SECTION 5: COLORS ── */}
          <Section title="Brand Colors" subtitle="Leave blank to use intelligent defaults based on property type">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Dark (background)">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.colors.dark || '#1C2B1C'}
                         onChange={e => set('colors.dark', e.target.value)}
                         style={{ width: '36px', height: '36px', padding: '2px', cursor: 'pointer', background: 'transparent', border: '1px solid #252836', borderRadius: '6px' }}/>
                  <input value={form.colors.dark} onChange={e => set('colors.dark', e.target.value)} placeholder="#1C2B1C"/>
                </div>
              </Field>
              <Field label="Accent (gold / highlight)">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.colors.accent || '#C4A24A'}
                         onChange={e => set('colors.accent', e.target.value)}
                         style={{ width: '36px', height: '36px', padding: '2px', cursor: 'pointer', background: 'transparent', border: '1px solid #252836', borderRadius: '6px' }}/>
                  <input value={form.colors.accent} onChange={e => set('colors.accent', e.target.value)} placeholder="#C4A24A"/>
                </div>
              </Field>
              <Field label="Tint (light fill)">
                <div className="flex items-center gap-2">
                  <input type="color" value={form.colors.tint || '#F2EDE0'}
                         onChange={e => set('colors.tint', e.target.value)}
                         style={{ width: '36px', height: '36px', padding: '2px', cursor: 'pointer', background: 'transparent', border: '1px solid #252836', borderRadius: '6px' }}/>
                  <input value={form.colors.tint} onChange={e => set('colors.tint', e.target.value)} placeholder="#F2EDE0"/>
                </div>
              </Field>
            </div>
          </Section>

          {/* ── SECTION 6: CONTACT ── */}
          <Section title="Contact Details" subtitle="Printed on the closing page">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone"><input value={form.contact.phone} onChange={e => set('contact.phone', e.target.value)} placeholder="+91 98440 00000"/></Field>
              <Field label="Email"><input type="email" value={form.contact.email} onChange={e => set('contact.email', e.target.value)} placeholder="hello@property.in"/></Field>
              <Field label="Website"><input value={form.contact.website} onChange={e => set('contact.website', e.target.value)} placeholder="www.property.in"/></Field>
              <Field label="Instagram"><input value={form.contact.instagram} onChange={e => set('contact.instagram', e.target.value)} placeholder="@propertyhandle"/></Field>
            </div>
          </Section>

          {/* ── GENERATE BUTTON ── */}
          <div className="pt-4 pb-12">
            <button type="submit" disabled={step === 'content' || step === 'render'}
              className="w-full py-4 rounded-lg text-sm font-medium tracking-widest uppercase transition-all"
              style={{
                background: step === 'content' || step === 'render' ? '#2A2D3A' : '#C4A24A',
                color: step === 'content' || step === 'render' ? '#6B7080' : '#0D0F14',
                cursor: step === 'content' || step === 'render' ? 'not-allowed' : 'pointer',
              }}>
              {step === 'content' ? 'Generating Copy…' : step === 'render' ? 'Rendering PDF…' : 'Generate Brochure PDF'}
            </button>
            <p className="text-center text-xs text-muted mt-3">
              Takes ~30 seconds · 10-page A4 PDF · Downloads automatically
            </p>
          </div>

        </form>
      </div>
    </main>
  );
}

// ── Small components ──────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 space-y-4" style={{ background: '#13151C', border: '1px solid #1E2130' }}>
      <div className="mb-2">
        <h2 className="text-white font-medium text-base">{title}</h2>
        <p className="text-muted text-xs mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label>{label}{required && <span className="text-gold ml-1">*</span>}</label>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full py-3 rounded-lg text-xs text-muted tracking-wider uppercase transition-colors hover:text-gold"
      style={{ background: 'transparent', border: '1px dashed #252836' }}>
      + {label}
    </button>
  );
}
