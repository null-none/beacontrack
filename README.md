# beacontrack

Tiny declarative event tracker. Sends events via `sendBeacon` (fallback: `fetch`). No dependencies.

## Setup

```html
<script src="beacontrack.min.js"></script>
<script>
  BeaconTrack.init({
    endpoint: "/api/track/",
    events: ["mouseover", "focusin"], // added on top of defaults
  });
</script>
```

Multiple endpoints:

```html
<script>
  BeaconTrack.init({
    endpoint: ["/api/track/", "/api/v2/track/", "/api/legacy/"],
  });
</script>
```


## Attributes

| Attribute | When fires | Description |
|---|---|---|
| `data-track="key"` | click | Track click on element |
| `data-track-on="event"` | custom DOM event | Track on a specific event |
| `data-track-value="val"` | — | Optional value sent with the event |
| `data-track-init="key"` | page load | Track immediately on init |
| `data-track-init-value="val"` | — | Optional value for init event |
| `data-api="N"` | — | Index of endpoint to use (default: `0`) |

```html
<!-- click → endpoints[0] (default) -->
<button data-track="signup-click">Sign up</button>

<!-- click with value → endpoints[1] -->
<button data-track="plan-click" data-track-value="pro" data-api="1">Pro</button>

<!-- custom event (Bootstrap modal) → endpoints[2] -->
<div data-track-on="show.bs.modal" data-track="modal-open" data-api="2"></div>

<!-- on page load → endpoints[1] -->
<div data-track-init="page-view" data-api="1"></div>
```

## JS API

```js
BeaconTrack.track("key");
BeaconTrack.track("key", "value");
BeaconTrack.track("key", "value", 1); // send to endpoints[1]
```
