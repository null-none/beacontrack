const BeaconTrack = {
  endpoint: null,
  defaultEvents: ["click"],
  events: [],
  _lastSent: {},

  init(options = {}) {
    this.endpoint = options.endpoint || "/api/v1/stats/track/";
    this.events = options.events
      ? [...this.defaultEvents, ...options.events]
      : [...this.defaultEvents];

    this._bindClick();
    this.events.forEach((e) => this._bindEvent(e));
    this._bindPreInit();
  },

  track(key, value = null) {
    const now = Date.now();
    if (this._lastSent[key] && now - this._lastSent[key] < 300) return;
    this._lastSent[key] = now;

    const payload = { event: key };
    if (value !== null) payload.value = value;

    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.endpoint, blob);
    } else {
      fetch(this.endpoint, { method: "POST", body: blob, keepalive: true });
    }
  },

  _getTrackData(el) {
    return {
      key: el.dataset.track,
      value: el.dataset.trackValue || null,
    };
  },

  _bindClick() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-track]:not([data-track-on])");
      if (!el) return;
      const { key, value } = this._getTrackData(el);
      this.track(key, value);
    });
  },

  _bindEvent(eventName) {
    document.addEventListener(eventName, (e) => {
      const el = e.target.closest(`[data-track-on="${eventName}"]`);
      if (!el) return;
      const { key, value } = this._getTrackData(el);
      this.track(key, value);
    });
  },

  _bindPreInit() {
    document.querySelectorAll("[data-track-init]").forEach((el) => {
      const value = el.dataset.trackInitValue || null;
      this.track(el.dataset.trackInit, value);
    });
  },
};
