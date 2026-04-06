import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/generate-content';
import { buildHTML } from '@/lib/build-html';
import { renderPDF } from '@/lib/render-pdf';
import type { PropertyData } from '@/lib/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let property: PropertyData;

  try {
    property = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!property.name || !property.type) {
    return NextResponse.json({ error: 'Property name and type are required' }, { status: 400 });
  }

  try {
    const content = await generateContent(property);
    const html    = buildHTML(property, content);
    const pdf     = await renderPDF(html);

    const slug = property.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return new NextResponse(pdf.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slug}-brochure.pdf"`,
        'Content-Length': String(pdf.length),
      },
    });
  } catch (err: unknown) {
    console.error('[generate]', err);
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
