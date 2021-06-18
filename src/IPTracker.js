class IPTracker {
  constructor () {
    this.MAX_TOP_IP_COUNT = 100;
    this.ips = new Map();
    this.topIps = [];
  }

  request_handled (ip) {
    // Get the map value or create one then increment
    const value = this.ips.has(ip)
      ? this.ips.get(ip)
      : { ip, count: 0 };
    value.count++;
    this.ips.set(ip, value);

    // Prepare some booleans to determine what action to take
    const isInTop = this.topIps.includes(value);
    const maxIsMet = this.topIps.length === this.MAX_TOP_IP_COUNT;
    const countExceedsMinTop = maxIsMet && value.count > this.topIps[this.MAX_TOP_IP_COUNT - 1].count;
    const shouldBeInTop = !isInTop && countExceedsMinTop;

    // If there is space in topIps or value.count exceeds the minimum topIps value
    if (!maxIsMet || shouldBeInTop) {
      this.topIps.push(value);
    }

    // If the updated entry was added to topIps or was already in topIps
    if (!maxIsMet || shouldBeInTop || isInTop) {
      this.topIps.sort((a, b) => b.count - a.count);
    }

    // If a new entry was added to topIps causing topIps.length to exceed its limit
    if (shouldBeInTop) {
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
