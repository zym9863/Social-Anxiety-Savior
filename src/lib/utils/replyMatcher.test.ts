import { describe, it, expect } from 'vitest';
import { matchReplies } from './replyMatcher';
import type { ReplyData } from './replyMatcher';

const testData: ReplyData = {
	tones: [
		{ id: 'friendly', label: '友好热情', emoji: '😊' },
		{ id: 'polite', label: '礼貌得体', emoji: '🤝' }
	],
	intents: [
		{
			id: 'accept_invite',
			label: '接受邀请',
			patterns: ['一起.*吃', '约.*饭', '聚餐'],
			replies: {
				friendly: [
					{ text: '好呀！你有想去的地方吗？', tip: '热情回应' },
					{ text: '太好了！我正好饿了～', tip: '积极回应' },
					{ text: '好的好的，走起！', tip: '爽快回应' }
				],
				polite: [
					{ text: '好的，谢谢邀请。', tip: '得体回应' }
				]
			}
		},
		{
			id: 'respond_greeting',
			label: '回应问候',
			patterns: ['你好', '嗨', '在吗'],
			replies: {
				friendly: [
					{ text: '嗨嗨！好久不见～', tip: '热情问候' }
				],
				polite: [
					{ text: '你好，最近还好吗？', tip: '礼貌问候' }
				]
			}
		}
	],
	generic: {
		friendly: [
			{ text: '哈哈是这样的～', tip: '万能回应' },
			{ text: '嗯嗯好的呀！', tip: '万能回应' }
		],
		polite: [
			{ text: '嗯嗯，了解了。', tip: '万能回应' }
		]
	}
};

describe('matchReplies', () => {
	it('should match invite-related messages', () => {
		const results = matchReplies('要不要一起吃个饭呀', 'friendly', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
		expect(results.length).toBeLessThanOrEqual(3);
		results.forEach(r => {
			expect(r).toHaveProperty('text');
			expect(r).toHaveProperty('tip');
		});
	});

	it('should match greeting messages', () => {
		const results = matchReplies('你好呀', 'polite', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
		expect(results[0].text).toContain('你好');
	});

	it('should fall back to generic when no pattern matches', () => {
		const results = matchReplies('今天天气真不错啊', 'friendly', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
		expect(results.some(r => r.text.includes('哈哈') || r.text.includes('嗯嗯'))).toBe(true);
	});

	it('should return at most 3 results', () => {
		const results = matchReplies('一起吃饭吧', 'friendly', testData);
		expect(results.length).toBeLessThanOrEqual(3);
	});

	it('should return at least 1 result even from generic', () => {
		const results = matchReplies('啊啊啊啊啊', 'polite', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
	});

	it('should handle empty message gracefully', () => {
		const results = matchReplies('', 'friendly', testData);
		expect(results.length).toBeGreaterThanOrEqual(1);
	});
});
