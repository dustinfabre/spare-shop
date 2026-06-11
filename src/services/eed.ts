import MD5 from 'crypto-js/md5'

const EED_BASE = '/eed-api'
const EED_ID = import.meta.env.VITE_EED_ID as string

const SESSION_KEY = 'eed_session'
const SESSION_TS_KEY = 'eed_session_ts'
const SESSION_TTL_MS = 3 * 60 * 60 * 1000 // 3 hours

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EEDArticle {
  artikelnummer: string
  artikelbezeichnung: string
  artikelhersteller: string
  ekpreis: string
  bild: 'J' | 'N'
  thumbnailurl?: string
  bestellbar: 'J' | 'N'
  morepics?: 'J' | 'N'
  artikeltext?: string
  vgruppenname?: string
  vgruppenbaumarray?: unknown[]
}

export interface EEDSearchResponse {
  fehlernummer: string
  fehlermeldung?: string
  treffer: Record<string, EEDArticle>
  gesamtanzahltreffer: string
  trefferproseite: string
  seite: number
  anzahlseiten: number
}

export interface EEDDetailResponse {
  fehlernummer: string
  fehlermeldung?: string
  artikelnummer: string
  artikelbezeichnung: string
  artikelhersteller: string
  ekpreis: string
  bild: 'J' | 'N'
  thumbnailurl?: string
  bestellbar: 'J' | 'N'
  artikeltext?: string
  technischedaten?: string
  morepics?: 'J' | 'N'
  vgruppenname?: string
}

export interface EEDImageResponse {
  fehlernummer: string
  fehlermeldung?: string
  tempurl?: string
}

// ─── Visitor IP (cached per page load) ───────────────────────────────────────

let cachedIpHash: string | null = null

async function getCustomerIpHash(): Promise<string> {
  if (cachedIpHash) return cachedIpHash
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json() as { ip: string }
    cachedIpHash = MD5(data.ip).toString()
    return cachedIpHash
  } catch {
    // Fall back to a zeroed hash — API won't reject it, just logs unknown
    cachedIpHash = MD5('0.0.0.0').toString()
    return cachedIpHash
  }
}

// ─── Session management ───────────────────────────────────────────────────────

async function getSession(): Promise<string> {
  const stored = sessionStorage.getItem(SESSION_KEY)
  const ts = sessionStorage.getItem(SESSION_TS_KEY)

  if (stored && ts && Date.now() - Number(ts) < SESSION_TTL_MS) {
    return stored
  }

  return 'auto'
}

function storeSessionIfNew(data: Record<string, unknown>) {
  const newId = data['neuesessionid'] as string | undefined
  if (newId) {
    sessionStorage.setItem(SESSION_KEY, newId)
    sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()))
  }
}

// ─── URL builder ─────────────────────────────────────────────────────────────

function buildUrl(
  params: Record<string, string | number>,
  sessionid: string,
): string {
  const p = new URLSearchParams()
  p.set('format', 'json')
  p.set('id', EED_ID)
  p.set('sessionid', sessionid)
  for (const [k, v] of Object.entries(params)) {
    p.set(k, String(v))
  }
  return `${EED_BASE}?${p.toString()}`
}

// ─── Core caller ──────────────────────────────────────────────────────────────

async function callEED<T extends { fehlernummer: string; fehlermeldung?: string }>(
  params: Record<string, string | number>,
): Promise<T> {
  const [sessionid, customerip] = await Promise.all([
    getSession(),
    getCustomerIpHash(),
  ])

  const fullParams = {
    ...params,
    shopurl: window.location.href,
    customerip,
  }

  const url = buildUrl(fullParams, sessionid)
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Network error: ${res.status}`)
  }

  const data = await res.json() as T

  if (data.fehlernummer !== '0') {
    throw new Error(data.fehlermeldung ?? `EED error ${data.fehlernummer}`)
  }

  storeSessionIfNew(data as Record<string, unknown>)

  return data
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function searchArticles(keyword: string, page = 1): Promise<EEDSearchResponse> {
  return callEED<EEDSearchResponse>({
    art: 'artikelsuche',
    suchbg: keyword.toUpperCase(),
    anzahl: 50,
    seite: page,
  })
}

export async function getArticleDetail(artnr: string): Promise<EEDDetailResponse> {
  return callEED<EEDDetailResponse>({
    art: 'artikeldetails',
    artnr,
  })
}

export async function getImageUrl(artnr: string): Promise<string | null> {
  try {
    const data = await callEED<EEDImageResponse>({
      art: 'bild',
      artnr,
    })
    return data.tempurl ?? null
  } catch {
    return null
  }
}
