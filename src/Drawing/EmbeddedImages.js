export default class EmbeddedImages {
    static Loading = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAgCAYAAACVf3P1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdBMjhENTI4OEZEQzExRUFBMTU2RDZEMDMwNkUxRTRFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdBMjhENTI5OEZEQzExRUFBMTU2RDZEMDMwNkUxRTRFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0EyOEQ1MjY4RkRDMTFFQUExNTZENkQwMzA2RTFFNEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0EyOEQ1Mjc4RkRDMTFFQUExNTZENkQwMzA2RTFFNEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5L6WocAAAFrUlEQVR42uxcvY4UORBurwgGEUFASn7SCZEgERAQIiGhDTYhQvMYPACPgS6aBCSEhLQhAQGCBCEkctILLjvtBkh9XV5/npqasl3unl/OJc32tO0ql6u/LrvKnnV933eNGu2LrtGfe3/ereUj1Lpw7dh3VyPk6/dv7Qk0AF7Rsw8fTQyLRw97akvXt18++bLT+w9i2XB1RjnN+o2WACR69fOfIsNs+JzdGNgGwD3+8bcvmw/fqWxhlDG/c6tZvtE6AC10+dc7Rx7Pe78AJALfUObrmkkb1dBJ1ts9f9rzqwBh9Joa+FK8jRqZPCABh7wcvB1dATKAik+3VMbrU7w1NARHPQtY3IhgyQc6XI5SX5Sbk5HjL/Vt1cEqh8vSeFL9yLZTbSL7rAYgAPT631/k2dbqqOz8j9txDUht6TsHYfCUXsYYENLgEOQwMLpa4JEhuRytn5LBpS5W/hyf9qJNlcPtpPGkdLXamoOuZFfZZxUAsc4D0AhEvI6A9jjUEQXwrUzDxAOQLkTdtgmGshiI2lhAWOKvTUFJGdaXYQpN0bXGppOnYHhAAAlRL6VZCEgchKF9x6ffZyEqBgi7kdMwB35NqogMRW0lf4qobeBxqZQRl0X3UhdNN8k3QQ/vELS+ZDoLvLm+pa5aW9mm1qaTAAgPGAuCMuQRsf4jZbAGRA4QbQAeGtiCydyF90OeUhq49CBq85gjdRutBwNWr/C7GpDXjlOzaW48k9eAEjDB860Yiwcg9H3Oyukz2/G0m3voGc/Wl7yqbAN5vLzmoWptLHocEgF4lueLgKiYhiEjyJQJ7sOU6xPIHGA0vdKHvqOc2sgpWcrU3uJteb8a4p58n7RtPWrkp2y6KecCDxjXbVirIdqVkS1f82Ga5u21iBkyeHQdDJAdxEqapyvvsszWU0NetyTfUMe9uyojcT8z6DezjsGgR63MhC3U+pzMlE03vQb0BqC1HlImVOij2AAgrPm4AiLl4gH2amg/XwYsXsapSO0EF37wuybaS5VZsqgv64GNJ4Jwk/rmNhusa8AeuTzaXoOSdA8Q4i1I5fQAMOLxbXmukEA5yCXwUd35EuRHtXUnX74agP6uVLJBKQ+obsVt47CA5ZDCsRgcn2PTHWt56bX3qdM1nmeaL9eBfu5nOxwx7ZI6dBDXhMHb0TSLZDX2jc/CAYZw747wAXaNVFD3Y+10ogQhEWB8h4MANQ/TMz9owL9fMvDhbcN2HQ4wUB8hquoP3dPVAu4QPMoYL7gJmfhMCkIWLLBgaxyXMjQ/kKoNRMoQCW63C4+VW2gfyhpu33rss29+InotXcFzeZchEMH6kKJdeDdMu3Gtxx68fPh0Dy9ZoptvPsfvF+JepScvXDf0e/3JCxOfrLt4/7IbeN31oUyrS1GqvwvDGAa5fZfRo6hzYnzZdoqdkryyLV2v7p3JplYA5kJrvvsB4MzZVtwKoABGkezcRLiPh5UBgtPAkeJLPoChvVanyZey0V/yASntj5FyYxzlAbWUChEOI9CVpyE8uILrxpovAjesJ+N1OU2PVtjyoGAUCSAjb5cBTbJO62/iGExAT9VZQVGp90pbXEsOYTQAteNYEmSX/DiWmHKR1CbwaUe1tk01xi0BbMdeJQm+1Fhk+aY8k8Wmm/DeJzkPSFMpAQheTIKP6pCslhEgwEcySNauo8NgsOIDPwTw7UsPi4209lYeajfqNAz/4REdJu3YIUREtqdhvRemV5831PaMz652Pao9YDiY2Y/gMctAe2lQyWc4Mq+2t44hpccYW6T6zhzHd9aj+8he1P7UIHcaxtF/RqBG/Hyf8HYucSBhLe9n5QVP+2F6o5NSgrHTPVucoom0KTbF26iRKQ2TS8/gVEv0mGGdNzXSbfQ/B6DlEMKiWx63P1/uhMRj++2/HjSqobgGrKT2z4kabQ6AjRrti/4TYAAqP+PJ/ErO9gAAAABJRU5ErkJggg=="
}