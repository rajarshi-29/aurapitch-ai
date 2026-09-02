// LocalStorage Helper for Sessions, Leads and Custom Data

const SESSIONS_KEY = 'aurapitch_user_sessions_v1';
const LEADS_KEY = 'aurapitch_waitlist_leads_v1';

export function getSavedSessions() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading sessions from storage:', e);
    return [];
  }
}

export function saveSession(session) {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getSavedSessions();
    const updated = [session, ...sessions];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated.slice(0, 50)));
    return updated;
  } catch (e) {
    console.error('Error saving session to storage:', e);
  }
}

export function getSavedLeads() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading leads from storage:', e);
    return [];
  }
}

export function saveLead(lead) {
  if (typeof window === 'undefined') return;
  try {
    const leads = getSavedLeads();
    const updated = [{ ...lead, createdAt: new Date().toISOString() }, ...leads];
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving lead to storage:', e);
  }
}
