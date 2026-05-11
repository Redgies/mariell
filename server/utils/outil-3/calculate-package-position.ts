import type { FormulaireOutil3 } from '../../schemas/outil-3/formulaire'

export type Position = 'sous-marché' | 'fourchette basse' | 'milieu de fourchette' | 'haut+'

export type ProfilF4 =
  | 'SDR / BDR Junior'
  | 'SDR / BDR Confirmé'
  | 'Business Developer Full Cycle'
  | 'AE PME / SMB'
  | 'AE Mid-Market'
  | 'AE Enterprise'
  | 'Account Manager'
  | 'Customer Success Manager'
  | 'Sales Ops / RevOps'
  | 'Channel / Partner Manager'
  | 'Sales Manager / Team Lead'
  | 'Head of Sales'
  | 'VP Sales / CRO'
  | 'profil non standard'

// Bornes alignées strictement sur F4 V5 — table de positionnement chiffré
// Format : [sous-marché_max, fourchette_basse_max, milieu_max]
// Au-delà de milieu_max → haut+
const BORNES_FIXE: Record<ProfilF4, [number, number, number] | null> = {
  'SDR / BDR Junior':              [32, 35, 39],
  'SDR / BDR Confirmé':            [32, 35, 39],
  'Business Developer Full Cycle': [32, 36, 41],
  'AE PME / SMB':                  [41, 44, 48],
  'AE Mid-Market':                 [48, 53, 59],
  'AE Enterprise':                 [65, 74, 84],
  'Account Manager':               [43, 47, 52],
  'Customer Success Manager':      [38, 42, 47],
  'Sales Ops / RevOps':            [40, 49, 59],
  'Channel / Partner Manager':     [45, 53, 61],
  'Sales Manager / Team Lead':     [50, 63, 76],
  'Head of Sales':                 [90, 110, 131],
  'VP Sales / CRO':                [120, 146, 173],
  'profil non standard':           null,
}

const BORNES_OTE: Record<ProfilF4, [number, number, number] | null> = {
  'SDR / BDR Junior':              [42, 49, 55],
  'SDR / BDR Confirmé':            [42, 48, 54],
  'Business Developer Full Cycle': [52, 61, 70],
  'AE PME / SMB':                  [61, 70, 79],
  'AE Mid-Market':                 [86, 98, 111],
  'AE Enterprise':                 [124, 148, 173],
  'Account Manager':               [59, 67, 76],
  'Customer Success Manager':      [43, 50, 57],
  'Sales Ops / RevOps':            [46, 58, 71],
  'Channel / Partner Manager':     [65, 78, 92],
  'Sales Manager / Team Lead':     [77, 97, 118],
  'Head of Sales':                 [149, 189, 229],
  'VP Sales / CRO':                [210, 266, 323],
  'profil non standard':           null,
}

function calculatePosition(montantEuros: number, bornesK: [number, number, number] | null): Position {
  if (bornesK === null) return 'milieu de fourchette' // profil non standard → neutre
  const montantK = montantEuros / 1000
  const [sousMarcheMax, basseMax, milieuMax] = bornesK
  if (montantK < sousMarcheMax) return 'sous-marché'
  if (montantK <= basseMax) return 'fourchette basse'
  if (montantK <= milieuMax) return 'milieu de fourchette'
  return 'haut+'
}

function mapToProfilF4(
  intitulePoste: FormulaireOutil3['intitule_poste'],
  intitulePrecision: string | undefined,
  seniorite: FormulaireOutil3['seniorite'],
): ProfilF4 {
  switch (intitulePoste) {
    case 'SDR / BDR':
      return seniorite === 'Junior 0-2 ans' ? 'SDR / BDR Junior' : 'SDR / BDR Confirmé'
    case 'Inside Sales':
    case 'Business Developer Full Cycle':
      return 'Business Developer Full Cycle'
    case 'Field Sales / Outside Sales':
      return seniorite === 'Junior 0-2 ans' ? 'AE PME / SMB' : 'AE Mid-Market'
    case 'Account Executive — PME / SMB':
      return 'AE PME / SMB'
    case 'Account Executive — Mid-Market':
      return 'AE Mid-Market'
    case 'Account Executive — Enterprise':
      return 'AE Enterprise'
    case 'Sales Engineer / Pre-Sales':
      return 'AE Mid-Market' // hors scope F4 → fourchette indicative
    case 'Account Manager':
      return 'Account Manager'
    case 'Strategic Account Manager / Key Account Manager':
      return 'AE Enterprise'
    case 'Customer Success Manager':
      return 'Customer Success Manager'
    case 'Sales Ops / RevOps':
      return 'Sales Ops / RevOps'
    case 'Channel / Partner Manager':
      return 'Channel / Partner Manager'
    case 'Sales Manager / Team Lead':
      return 'Sales Manager / Team Lead'
    case 'Head of Sales':
      return 'Head of Sales'
    case 'VP Sales / CRO':
      return 'VP Sales / CRO'
    case 'Autre':
      return mapAutreToProfilF4(intitulePrecision, seniorite)
    default:
      return 'profil non standard'
  }
}

function mapAutreToProfilF4(
  precision: string | undefined,
  seniorite: FormulaireOutil3['seniorite'],
): ProfilF4 {
  if (!precision) return 'profil non standard'
  const p = precision.toLowerCase()

  if (p.includes('sdr') || p.includes('bdr')) {
    return seniorite === 'Junior 0-2 ans' ? 'SDR / BDR Junior' : 'SDR / BDR Confirmé'
  }
  if (p.includes('csm') || p.includes('customer success')) return 'Customer Success Manager'
  if (p.includes('account manager') || p.includes('am ')) return 'Account Manager'
  if (p.includes('enterprise') || p.includes('grands comptes')) return 'AE Enterprise'
  if (p.includes('mid-market') || p.includes('mid market')) return 'AE Mid-Market'
  if (p.includes('pme') || p.includes('smb')) return 'AE PME / SMB'
  if (p.includes('director') || p.includes('directeur')) return 'Head of Sales'
  if (p.includes('vp') || p.includes('cro')) return 'VP Sales / CRO'
  if (p.includes('partner') || p.includes('channel')) return 'Channel / Partner Manager'
  if (p.includes('sales ops') || p.includes('revops')) return 'Sales Ops / RevOps'

  return 'profil non standard'
}

function calculatePositionGlobale(
  positionFixe: Position,
  positionOte: Position,
): { position: Position; incoherence: boolean } {
  const positionToIndex: Record<Position, number> = {
    'sous-marché': 0,
    'fourchette basse': 1,
    'milieu de fourchette': 2,
    'haut+': 3,
  }
  const indexToPosition: Position[] = [
    'sous-marché',
    'fourchette basse',
    'milieu de fourchette',
    'haut+',
  ]

  const idxFixe = positionToIndex[positionFixe]
  const idxOte = positionToIndex[positionOte]
  const ecart = Math.abs(idxFixe - idxOte)

  if (ecart === 0) return { position: positionFixe, incoherence: false }
  if (ecart === 1) return { position: indexToPosition[Math.min(idxFixe, idxOte)]!, incoherence: false }
  return { position: indexToPosition[Math.min(idxFixe, idxOte)]!, incoherence: true }
}

export interface PackagePositionResult {
  profil: ProfilF4
  positionFixe: Position
  positionOte: Position
  positionGlobale: Position
  incoherenceFixeOte: boolean
}

export function calculatePackagePosition(data: FormulaireOutil3): PackagePositionResult {
  const profil = mapToProfilF4(data.intitule_poste, data.intitule_poste_precision_autre, data.seniorite)
  const positionFixe = calculatePosition(data.package_fixe, BORNES_FIXE[profil])
  const positionOte = calculatePosition(data.package_ote, BORNES_OTE[profil])
  const { position: positionGlobale, incoherence: incoherenceFixeOte } = calculatePositionGlobale(
    positionFixe,
    positionOte,
  )
  return { profil, positionFixe, positionOte, positionGlobale, incoherenceFixeOte }
}
