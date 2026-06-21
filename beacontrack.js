const BeaconTrack = {
  endpoints: [],
  defaultEvents: ["click"],
  events: [],
  _lastSent: {},

  init(options = {}) {
    const ep = options.endpoint || "/api/v1/stats/track/";
    this.endpoints = Array.isArray(ep) ? ep : [ep];

    this.events = options.events
      ? [...this.defaultEvents, ...options.events]
      : [...this.defaultEvents];

    this._bindClick();
    this.events.forEach((e) => this._bindEvent(e));
    this._bindPreInit();
  },

  track(key, value = null, apiIndex = 0) {
    const now = Date.now();
    const dedupeKey = `${apiIndex}:${key}`;
    if (this._lastSent[dedupeKey] && now - this._lastSent[dedupeKey] < 300) return;
    this._lastSent[dedupeKey] = now;

    const endpoint = this.endpoints[apiIndex] ?? this.endpoints[0];
    const payload = { event: key };
    if (value !== null) payload.value = value;

    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, { method: "POST", body: blob, keepalive: true });
    }
  },

  _getTrackData(el) {
    return {
      key: el.dataset.track,
      value: el.dataset.trackValue || null,
      apiIndex: parseInt(el.dataset.api ?? "0", 10),
    };
  },

  _bindClick() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-track]:not([data-track-on])");
      if (!el) return;
      const { key, value, apiIndex } = this._getTrackData(el);
      this.track(key, value, apiIndex);
    });
  },

  _bindEvent(eventName) {
    document.addEventListener(eventName, (e) => {
      const el = e.target.closest(`[data-track-on="${eventName}"]`);
      if (!el) return;
      const { key, value, apiIndex } = this._getTrackData(el);
      this.track(key, value, apiIndex);
    });
  },

  _bindPreInit() {
    document.querySelectorAll("[data-track-init]").forEach((el) => {
      const value = el.dataset.trackInitValue || null;
      const apiIndex = parseInt(el.dataset.api ?? "0", 10);
      this.track(el.dataset.trackInit, value, apiIndex);
    });
  },
};
