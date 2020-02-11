let tinycolor = require("tinycolor2");
let color = tinycolor("#f0f0f6");
console.log(color.getBrightness())
let hsv = color.toHsvString()
console.log(hsv)