export interface StorageAdapter {
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T): Promise<void>;
	remove(key: string): Promise<void>;
	list(prefix: string): Promise<string[]>;
}

export class LocalStorageAdapter implements StorageAdapter {
	async get<T>(key: string): Promise<T | null> {
		const raw = localStorage.getItem(key);
		if (raw === null) return null;
		return JSON.parse(raw) as T;
	}

	async set<T>(key: string, value: T): Promise<void> {
		localStorage.setItem(key, JSON.stringify(value));
	}

	async remove(key: string): Promise<void> {
		localStorage.removeItem(key);
	}

	async list(prefix: string): Promise<string[]> {
		const keys: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key !== null && key.startsWith(prefix)) {
				keys.push(key);
			}
		}
		return keys;
	}
}
