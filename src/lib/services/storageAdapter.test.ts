import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageAdapter } from './storageAdapter';

describe('LocalStorageAdapter', () => {
	let adapter: LocalStorageAdapter;

	beforeEach(() => {
		localStorage.clear();
		adapter = new LocalStorageAdapter();
	});

	it('should return null for non-existent key', async () => {
		const result = await adapter.get('nonexistent');
		expect(result).toBeNull();
	});

	it('should set and get a value', async () => {
		await adapter.set('key1', { name: 'test' });
		const result = await adapter.get<{ name: string }>('key1');
		expect(result).toEqual({ name: 'test' });
	});

	it('should overwrite existing value', async () => {
		await adapter.set('key1', 'old');
		await adapter.set('key1', 'new');
		const result = await adapter.get('key1');
		expect(result).toBe('new');
	});

	it('should remove a value', async () => {
		await adapter.set('key1', 'value');
		await adapter.remove('key1');
		const result = await adapter.get('key1');
		expect(result).toBeNull();
	});

	it('should list keys with prefix', async () => {
		await adapter.set('topic:1', 'a');
		await adapter.set('topic:2', 'b');
		await adapter.set('reply:1', 'c');
		const keys = await adapter.list('topic:');
		expect(keys).toEqual(['topic:1', 'topic:2']);
	});

	it('should return empty array when no keys match prefix', async () => {
		await adapter.set('topic:1', 'a');
		const keys = await adapter.list('reply:');
		expect(keys).toEqual([]);
	});
});
