/**
 * Normally, a server should operate as a mere executor and should not hold state.
 * In this specific case, data is stored here for mere seconds, and should be cleared
 * when the server restarts anyway.
 */

import ShortUniqueId from 'short-unique-id'
const { randomUUID } = new ShortUniqueId({ length: 4, dictionary: 'alpha_upper' })

type State = {
  from: string // href to return to
}
const state = new Map<string, State>;

export const newState = (from: string): string => {
  const id = randomUUID();
  state.set(id, { from });
  return id;
}

export const getState = (id: string): State | null => {
  const s = state.get(id)
  if (!s) return null
  state.delete(id);
  return s;
}