export function toggleChannelManager(selectedManagerIds, managerId) {
  if (!selectedManagerIds.includes(managerId)) {
    return [...selectedManagerIds, managerId];
  }

  if (selectedManagerIds.length === 1) {
    return [...selectedManagerIds];
  }

  return selectedManagerIds.filter((selectedManagerId) => selectedManagerId !== managerId);
}

export function selectChannelManager(selectedManagerIds, availableManagerIds, lastAssignedMinutes) {
  const availableSet = new Set(availableManagerIds);
  const eligibleManagerIds = selectedManagerIds.filter((managerId) => availableSet.has(managerId));

  if (eligibleManagerIds.length === 0) return null;

  return [...eligibleManagerIds].sort((a, b) => {
    const assignmentDifference = (lastAssignedMinutes[a] ?? 0) - (lastAssignedMinutes[b] ?? 0);
    if (assignmentDifference !== 0) return assignmentDifference;
    return selectedManagerIds.indexOf(a) - selectedManagerIds.indexOf(b);
  })[0];
}
