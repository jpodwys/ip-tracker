const { describe, beforeEach, test, expect } = require('@jest/globals');
const { IPTracker } = require('./IPTracker');

describe('IPTracker', () => {
  test('should compile without error', () => {
    expect(() => new IPTracker()).not.toThrow();
  });

  describe('API', () => {
    const IP1 = '127.0.0.1';
    const IP2 = '127.0.0.2';
    const IP3 = '127.0.0.3';
    const IP4 = '127.0.0.4';
    let tracker;

    beforeEach(() => {
      tracker = new IPTracker();
    });

    describe('request_handled', () => {
      beforeEach(() => {
        tracker.MAX_TOP_IP_COUNT = 2;
      });

      test('adds a new entry', () => {
        expect(tracker.ips.size).toBe(0);
        tracker.request_handled(IP1);
        expect(tracker.ips.size).toBe(1);
        expect(tracker.ips.get(IP1)).toEqual({ ip: IP1, count: 1 });
      });

      test('increments an existing entry', () => {
        tracker.ips.set(IP1, { ip: IP1, count: 1 });
        tracker.request_handled(IP1);
        expect(tracker.ips.size).toBe(1);
        expect(tracker.ips.get(IP1)).toEqual({ ip: IP1, count: 2 });
      });

      test('adds new values to topIps when there are fewer than the limit', () => {
        tracker.request_handled(IP1);
        tracker.request_handled(IP2);
        tracker.request_handled(IP3);
        expect(tracker.ips.size).toBe(3);
        expect(tracker.topIps.length).toBe(2);
        expect(tracker.top100()).toEqual([ IP1, IP2 ]);
      });

      test('replaces an existing top entry when another entry\'s count becomes higher', () => {
        tracker.request_handled(IP1);
        tracker.request_handled(IP2);
        tracker.request_handled(IP3);
        tracker.request_handled(IP3);
        expect(tracker.ips.size).toBe(3);
        expect(tracker.topIps.length).toBe(2);
        expect(tracker.top100()).toEqual([ IP3, IP1 ]);
      });

      test('topIps never MAX_TOP_IP_COUNT the max', () => {
        tracker.request_handled(IP1);
        tracker.request_handled(IP2);
        tracker.request_handled(IP3);
        tracker.request_handled(IP4);
        expect(tracker.ips.size).toBe(4);
        expect(tracker.topIps.length).toBe(2);
      });
    });

    describe('top100', () => {
      test('returns an empty array by default', () => {
        expect(tracker.top100()).toHaveLength(0);
      });

      test('returns an array of numbers sorted high-to-low', () => {
        tracker.MAX_TOP_IP_COUNT = 3;
        tracker.request_handled(IP1);
        tracker.request_handled(IP2);
        tracker.request_handled(IP3);
        tracker.request_handled(IP3);
        tracker.request_handled(IP2);
        tracker.request_handled(IP3);
        tracker.request_handled(IP4);
        const top100 = tracker.top100();
        expect(top100).toHaveLength(3);
        top100.every((str) => typeof str === 'string');
        expect(top100).toEqual([ IP3, IP2, IP1 ]);
      });
    });

    describe('clear', () => {
      test('clears ips and topIps', () => {
        tracker.request_handled(IP1);
        tracker.request_handled(IP2);
        tracker.request_handled(IP3);
        tracker.request_handled(IP4);
        tracker.clear();
        expect(tracker.top100()).toHaveLength(0);
        expect(tracker.ips.size).toBe(0);
      });
    });
  });
});
