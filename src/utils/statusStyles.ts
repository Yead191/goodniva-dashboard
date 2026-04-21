import { colors } from './colors'

/**
 * Returns badge style for a given status.
 * Used across multiple tables for consistent semantics.
 */
export const getStatusStyle = (
  status: string,
): { bg: string; text: string; dot: string } => {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    // Generic
    Active: { bg: colors.successLight, text: colors.successText, dot: colors.success },
    Cancelled: { bg: colors.dangerLight, text: colors.dangerText, dot: colors.danger },
    Expired: { bg: colors.bgInput, text: colors.textMuted, dot: colors.textMuted },
    'Past Due': { bg: colors.warningLight, text: colors.warningText, dot: colors.warning },
    Inactive: { bg: colors.bgInput, text: colors.textMuted, dot: colors.textMuted },
    Completed: { bg: colors.infoLight, text: colors.infoText, dot: colors.info },
    Hidden: { bg: colors.bgInput, text: colors.textMuted, dot: colors.textMuted },

    // Triage
    PENDING: { bg: colors.warningLight, text: colors.warningText, dot: colors.warning },
    REVIEWED: { bg: colors.successLight, text: colors.successText, dot: colors.success },
    RESOLVED: { bg: colors.successLight, text: colors.successText, dot: colors.success },

    // Support
    Open: { bg: colors.warningLight, text: colors.warningText, dot: colors.warning },
    'In Progress': { bg: colors.infoLight, text: colors.infoText, dot: colors.info },
    Resolved: { bg: colors.successLight, text: colors.successText, dot: colors.success },

    // Broadcast
    Sent: { bg: colors.successLight, text: colors.successText, dot: colors.success },
    Scheduled: { bg: colors.infoLight, text: colors.infoText, dot: colors.info },
    Failed: { bg: colors.dangerLight, text: colors.dangerText, dot: colors.danger },
  }
  return map[status] || { bg: colors.bgInput, text: colors.textSecondary, dot: colors.textMuted }
}

/**
 * Priority pill styles (High/Medium/Low)
 */
export const getPriorityStyle = (priority: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    High: { bg: colors.dangerLight, text: colors.dangerText },
    Medium: { bg: colors.warningLight, text: colors.warningText },
    Low: { bg: colors.bgInput, text: colors.textSecondary },
  }
  return map[priority] || { bg: colors.bgInput, text: colors.textSecondary }
}

/**
 * Urgency pills for safety triage (HIGH is solid red for emphasis)
 */
export const getUrgencyStyle = (urgency: string) => {
  const map: Record<string, { bg: string; text: string }> = {
    HIGH: { bg: colors.danger, text: '#FFFFFF' },
    MEDIUM: { bg: colors.warningLight, text: colors.warningText },
    LOW: { bg: colors.successLight, text: colors.successText },
  }
  return map[urgency] || { bg: colors.bgInput, text: colors.textSecondary }
}
