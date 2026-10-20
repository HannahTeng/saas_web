/**
 * The free workflow check: the choices the panel offers, as the codes the Flowact app accepts (its leads/parse.ts).
 * Labels live here so the panel, the email to support@ and the FAQ say the same thing.
 */
export const PAINS = [
  { id: 'wms_export', en: 'Daily WMS exports', zh: '每天从 WMS 导表' },
  { id: 'billing_reconciliation', en: 'Reconciliation / storage billing', zh: '对账 / 仓租计费' },
  { id: 'inventory_alerts', en: 'Inventory levels / stock-out alerts', zh: '库存水位 / 断货预警' },
  { id: 'exception_tracking', en: 'Chasing lost or late parcels', zh: '异常件追踪（丢件 / 延误）' },
  { id: 'seller_reports', en: 'Reports for sellers', zh: '给卖家发报表' },
  { id: 'receiving', en: 'Inbound appointments / receiving checks', zh: '入库预约 / 到仓核对' },
  { id: 'other', en: 'Something else', zh: '其他' },
] as const

export const WMS = [
  { id: 'eccang', en: '易仓 ECCANG', zh: '易仓' },
  { id: 'lingxing', en: '领星 Lingxing', zh: '领星' },
  { id: 'mabang', en: '马帮 / 极风', zh: '马帮 / 极风' },
  { id: 'extensiv', en: 'Extensiv', zh: 'Extensiv' },
  { id: 'shiphero', en: 'ShipHero', zh: 'ShipHero' },
  { id: 'in_house', en: 'Built in-house', zh: '自己开发的' },
  { id: 'other', en: 'Other', zh: '其他' },
] as const

export const DAILY_ORDERS = [
  { id: '<500', en: 'Under 500', zh: '500 以下' },
  { id: '500-2000', en: '500–2,000', zh: '500–2,000' },
  { id: '2000-10000', en: '2,000–10,000', zh: '2,000–10,000' },
  { id: '10000+', en: '10,000+', zh: '10,000 以上' },
] as const

export const WAREHOUSES = [
  { id: '1', en: '1', zh: '1 个' },
  { id: '2-3', en: '2–3', zh: '2–3 个' },
  { id: '4-10', en: '4–10', zh: '4–10 个' },
  { id: '10+', en: '10+', zh: '10 个以上' },
] as const

export type CheckProfile = {
  pains: string[]
  wms?: string
  wms_other?: string
  daily_orders?: string
  warehouses?: string
  language?: 'zh' | 'en'
}

const ids = (list: readonly { id: string }[]) => new Set(list.map((x) => x.id))
const PAIN_IDS = ids(PAINS), WMS_IDS = ids(WMS), ORDER_IDS = ids(DAILY_ORDERS), WH_IDS = ids(WAREHOUSES)

/** Keeps only known codes, so a tampered request can't put anything else into the lead. */
export function cleanProfile(v: unknown): CheckProfile | undefined {
  if (!v || typeof v !== 'object') return undefined
  const p = v as Record<string, unknown>
  const pick = (x: unknown, ok: Set<string>) => (typeof x === 'string' && ok.has(x) ? x : undefined)
  const pains = Array.isArray(p.pains) ? p.pains.filter((x): x is string => typeof x === 'string' && PAIN_IDS.has(x)).slice(0, 7) : []
  const wms = pick(p.wms, WMS_IDS)
  const other = typeof p.wms_other === 'string' ? p.wms_other.trim().slice(0, 80) : ''
  return {
    pains: Array.from(new Set(pains)),
    wms,
    wms_other: wms === 'other' && other ? other : undefined,
    daily_orders: pick(p.daily_orders, ORDER_IDS),
    warehouses: pick(p.warehouses, WH_IDS),
    language: p.language === 'zh' || p.language === 'en' ? p.language : undefined,
  }
}

/** The answers as plain lines (English), for the email to support@. */
export function profileText(p: CheckProfile): string[] {
  const label = (list: readonly { id: string; en: string }[], id?: string) => list.find((x) => x.id === id)?.en
  return [
    p.pains.length ? `Takes time: ${p.pains.map((id) => label(PAINS, id)).join(', ')}` : null,
    p.wms ? `WMS: ${label(WMS, p.wms)}${p.wms_other ? ` (${p.wms_other})` : ''}` : null,
    p.daily_orders ? `Orders per day: ${label(DAILY_ORDERS, p.daily_orders)}` : null,
    p.warehouses ? `Warehouses: ${label(WAREHOUSES, p.warehouses)}` : null,
    p.language ? `Reply in: ${p.language === 'zh' ? 'Chinese' : 'English'}` : null,
  ].filter((l): l is string => l !== null)
}
