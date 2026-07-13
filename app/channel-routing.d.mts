export function toggleChannelManager(
  selectedManagerIds: string[],
  managerId: string,
): string[];

export function selectChannelManager(
  selectedManagerIds: string[],
  availableManagerIds: string[],
  lastAssignedMinutes: Record<string, number>,
): string | null;
