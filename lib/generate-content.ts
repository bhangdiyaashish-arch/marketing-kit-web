import type { PropertyData, GeneratedContent } from './types';

const SYSTEM_PROMPT = `You are a world-class hospitality brand writer creating content for a premium marketing brochure.

Your writing is specific, evocative, and never generic. You write as if you have lived at this property.

Hard rules:
- Never use "experience" as a noun — show, don't name
- Never use phrases like "perfect getaway", "luxurious retreat", "world-class", "nestled"
- Taglines must be specific enough they could only be about this one property
- Pullquote must stand alone — the soul of the property in under 15 words
- Closing line creates quiet longing — never urgency, never a command
- Guest archetypes must be so specific the right person thinks "they are talking about me"
- Sensory writing: smell, light, sound, texture — not adjective stacking
- Return ONLY valid JSON. No explanation, no markdown, no code blocks.`;

export async function generateContent(property: PropertyData): Promise<GeneratedContent> {
  const prompt = `Generate premium marketing brochure content for this property. Return ONLY a valid JSON object matching the schema exactly.

PROPERTY DATA:
${JSON.stringify(property, null, 2)}

RETURN THIS EXACT JSON STRUCTURE (fill every field):
{
  "tagline": "under 12 words, specific to this property only",
  "story": {
    "p1": "founding moment — where this place came from, 3-4 sentences",
    "p2": "the philosophy, not the features — what is different here, 3-4 sentences",
    "p3": "what guests carry home — transformation not memory, 3-4 sentences"
  },
  "pullquote": "one sentence from the story that stands alone, under 15 words",
  "experience": {
    "p1": "morning — what it smells like at 6am, what sounds exist here that cities have forgotten, 3-4 sentences of pure sensory writing",
    "p2": "afternoon into evening — what the light does, what the air feels like, what changes when dusk comes, 3-4 sentences"
  },
  "experience_pillars": [
    { "label": "DAWN", "headline": "3-5 word serif headline", "body": "2 sentences of sensory writing" },
    { "label": "AFTERNOON", "headline": "3-5 word serif headline", "body": "2 sentences of sensory writing" },
    { "label": "DUSK", "headline": "3-5 word serif headline", "body": "2 sentences of sensory writing" }
  ],
  "units": [
    { "name": "exact unit name from property data", "tagline": "one line of desire — not spec, not features" }
  ],
  "hero_experience": {
    "name": "the single most evocative experience from the property data",
    "narrative": "3 sentences of pure sensory writing about this specific experience"
  },
  "add_ons": [
    { "name": "experience name", "line1": "what it feels like, not what it includes", "line2": "what it opens up in you" }
  ],
  "archetypes": [
    { "title": "The [specific archetype name]", "invitation": "If you are the kind of person who [specific, recognizable, 2-3 sentences of warm invitation]" },
    { "title": "The [specific archetype name]", "invitation": "If you are the kind of person who [specific, recognizable, 2-3 sentences]" },
    { "title": "The [specific archetype name]", "invitation": "If you are the kind of person who [specific, recognizable, 2-3 sentences]" }
  ],
  "closing_line": "under 20 words, an invitation, quiet longing, something they will feel"
}

Generate units array from the property's units. Generate add_ons from the property's experiences. Use actual review text where reviews are provided.`;

  // Support both Azure OpenAI and Anthropic based on env vars
  if (process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT) {
    return generateWithAzure(prompt);
  }
  return generateWithAnthropic(prompt);
}

async function generateWithAzure(prompt: string): Promise<GeneratedContent> {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT!.replace(/\/$/, '');
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-01`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.AZURE_OPENAI_API_KEY!,
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: prompt },
      ],
      max_tokens: 4096,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure OpenAI error: ${res.status} — ${err}`);
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  const raw   = data.choices[0].message.content.trim();
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(clean) as GeneratedContent;
}

async function generateWithAnthropic(prompt: string): Promise<GeneratedContent> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw   = (message.content[0] as { text: string }).text.trim();
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(clean) as GeneratedContent;
}
