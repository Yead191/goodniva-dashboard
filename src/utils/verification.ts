import { colors } from '@/utils/colors'
import type {
  IdentityVerification,
  VerificationCheckResult,
  VerificationChecks,
  VerificationStatus,
} from '@/types'

interface BadgeStyle {
  text: string
  bg: string
  color: string
}

/** Badge props for a verification status, each state visually distinct. */
export const verificationStatusStyle = (status: VerificationStatus): BadgeStyle => {
  switch (status) {
    case 'Verified':
      return { text: '• Verified', bg: colors.successLight, color: colors.successText }
    case 'Pending':
      return { text: '• Pending', bg: colors.infoLight, color: colors.infoText }
    case 'Failed':
      return { text: '• Failed', bg: colors.dangerLight, color: colors.dangerText }
    case 'Expired':
      return { text: '• Expired', bg: colors.warningLight, color: colors.warningText }
    default:
      return { text: '• Not Verified', bg: colors.bgInput, color: colors.textSecondary }
  }
}

const checkLabels: Record<keyof VerificationChecks, string> = {
  document: 'Document',
  faceMatch: 'Face match',
  liveness: 'Liveness',
  age: 'Age',
}

const checkOrder = ['document', 'faceMatch', 'liveness', 'age'] as const

/** The checks a provider actually reported, in a stable display order. */
export const reportedChecks = (checks?: VerificationChecks) =>
  checkOrder.flatMap((key) => {
    const result = checks?.[key]
    return result ? [{ key, label: checkLabels[key], result }] : []
  })

export const verificationCheckStyle = (result: VerificationCheckResult): BadgeStyle => {
  if (result === 'Passed') return { text: 'Passed', bg: colors.successLight, color: colors.successText }
  if (result === 'Failed') return { text: 'Failed', bg: colors.dangerLight, color: colors.dangerText }
  return { text: 'Not provided', bg: colors.bgInput, color: colors.textSecondary }
}

/** The trust badge is only meaningful while verification is currently valid. */
export const activeTrustBadge = (v: IdentityVerification): string | undefined =>
  v.status === 'Verified' ? v.badge : undefined
