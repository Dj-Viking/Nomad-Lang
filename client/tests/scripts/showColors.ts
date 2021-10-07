import {
  backgroundColors,
  lightBackgroundNames,
  lightTextNames,
  textColors,
} from "../constants";
import {
  BackgroundColor,
  LightBackGroundName,
  LightTextName,
  TextColor,
} from "../types";

let styleName:
  | TextColor
  | BackgroundColor
  | LightBackGroundName
  | LightTextName = "";
(function () {
  function determineStyleString(loopInput: number): void {
    for (let m = 30; m < 36; m++) {
      switch (true) {
        case m === loopInput:
          {
            styleName = textColors[loopInput - 30] as TextColor;
            console.log("option#: ", m + 1, styleName);
          }
          break;
        default:
          styleName = "";
      }
    }

    for (let k = 40; k < 47; k++) {
      switch (true) {
        case k === loopInput:
          {
            styleName = backgroundColors[loopInput - 40] as BackgroundColor;
            console.log("option #: ", k + 1, styleName);
          }
          break;
        default:
          styleName = "";
      }
    }

    for (let j = 90; j < 96; j++) {
      switch (true) {
        case j === loopInput:
          {
            styleName = lightTextNames[loopInput - 90] as LightTextName;
            console.log("option #:", j + 1, styleName);
          }
          break;
        default:
      }
    }
    for (let i = 100; i < 108; i++) {
      switch (true) {
        //when input equals a number in this loop start iterating through an array of style names to return a string of
        case i === loopInput:
          {
            styleName = lightBackgroundNames[
              loopInput - 100
            ] as LightBackGroundName;
            console.log("option #: ", i + 1, styleName);
          }
          break;
        default:
          styleName = "";
      }
    }
    return undefined;
  }
  console.log("hellow world");

  console.log("here are text colors: \n");
  for (let i = 30; i < 36; i++) {
    determineStyleString(i);
    console.log(`\x1b[${i + 1}m`, `option # ${i + 1}`, "\x1b[00m");
  }
  console.log("\n");
  console.log("background colors");
  for (let i = 40; i < 47; i++) {
    determineStyleString(i);
    console.log(`\x1b[${i + 1}m`, `option # ${i + 1} `, "\x1b[00m");
  }
  console.log("\n");

  console.log("lighter text colors");
  for (let i = 90; i < 96; i++) {
    determineStyleString(i);
    console.log(`\x1b[${i + 1}m`, `option # ${i + 1}`, "\x1b[00m");
  }
  console.log("\n");
  console.log("lighter background colors");

  for (let i = 100; i < 107; i++) {
    determineStyleString(i);
    console.log(`\x1b[${i + 1}m`, `option # ${i + 1}`, "\x1b[00m");
  }
})();
