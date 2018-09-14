const boxes = makeBoxes(0, 10)

/*
 * converts a hex string of form #RRGGBB to a object of RGBA values, where A is all maxed out
 *
 * @param hex the hex string to be converted
 * @return an object containing rgb values in integer form
 */
function hexToRGBA(hex){
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
    a: 255
  }
}

function RBGtoHex([r, g, b]){
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
}

function constrainToHueVariance(rgb){
  const [h, s, v] = rgbToHsv(rgb.r, rgb.g, rgb.b)

  boxes.forEach(box => box.match(h))

  const [r, g, b] = hsvToRgb(h, 1, 1)
  return {r, g, b, a:rgb.a}
}

function colourCodeToConstrainedHue(colourCode){
    const rgb = hexToRGBA(colourCode)
    return constrainToHueVariance(rgb)
}


//retrieved from https://gist.github.com/mjackson/53112564
function rgbToHsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, v ];
}

function hsvToRgb(h, s, v) {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}
