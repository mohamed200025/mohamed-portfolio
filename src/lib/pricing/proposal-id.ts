const PROPOSAL_ID_PREFIX = "MO";

export function formatProposalId(year: number, suffix: number): string {
  return `${PROPOSAL_ID_PREFIX}-${year}-${String(suffix).padStart(6, "0")}`;
}

export function generateProposalIdCandidate(year = new Date().getFullYear()): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return formatProposalId(year, suffix);
}
