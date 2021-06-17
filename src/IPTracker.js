class IPTracker {
  constructor () {
    this.MAX_TOP_IP_COUNT = 100;
    this.clear();
  }

  request_handled (ip) {
    const value = this.ips.has(ip)
      ? this.ips.get(ip)
      : { ip, count: 0 };
    value.count++;
    this.ips.set(ip, value);

    const isInTop = this.topIps.includes(value);
    const maxIsMet = this.topIps.length === this.MAX_TOP_IP_COUNT;
    const shouldBeInTop = !isInTop && (this.topIps.length >= this.MAX_TOP_IP_COUNT && value.count > this.topIps[this.MAX_TOP_IP_COUNT - 1].count);

    if (!maxIsMet || shouldBeInTop) {
      this.topIps.push(value);
    }
    if (!maxIsMet || shouldBeInTop || isInTop) {
      this.topIps.sort((a, b) => b.count - a.count);
    }
    if (maxIsMet && shouldBeInTop) {
      this.topIps.pop();
    }
  }

  top100 () {
    return this.topIps.map(({ ip }) => ip);
  }

  clear () {
    this.ips = new Map();
    this.topIps = [];
  }
}

// Using non-export syntax for out-of-the-box jest compatibility
module.exports.IPTracker = IPTracker;
