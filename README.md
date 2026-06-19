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


## Attributes

| Attribute | When fires | Description |
|---|---|---|
| `data-track="key"` | click | Track click on element |
| `data-track-on="event"` | custom DOM event | Track on a specific event |
| `data-track-value="val"` | — | Optional value sent with the event |
| `data-track-init="key"` | page load | Track immediately on init |
| `data-track-init-value="val"` | — | Optional value for init event |

```html
<!-- click -->
<button data-track="signup-click">Sign up</button>

<!-- click with value -->
<button data-track="plan-click" data-track-value="pro">Pro</button>

<!-- custom event (Bootstrap modal) -->
<div data-track-on="show.bs.modal" data-track="modal-open"></div>

<!-- on page load -->
<div data-track-init="page-view"></div>
```

## JS API

```js
BeaconTrack.track("key");
BeaconTrack.track("key", "value");
```
