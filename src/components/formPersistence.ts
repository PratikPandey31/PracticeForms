export function saveFormState(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFormState<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function clearFormState(key: string) {
  localStorage.removeItem(key);
} 