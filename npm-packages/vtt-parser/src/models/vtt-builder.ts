/**
 * Helper class to easily create VTT file from string
 */
export class VttBuilder {
  constructor(private counter: number = 0, private content: string = "WEBVTT\r\n") {}

  /**
   * Create a default block
   * @param {number} idx the sequence index
   * @returns {Block} the block instance
   */
  add(from: number, to: number, line: string, settings?: string): string {
    this.counter++;
    let lines: Array<string> = line.constructor === Array ? line : [line];

    this.content +=
      "\r\n" +
      this.counter.toString() +
      "\r\n" +
      secondsToTime(from) +
      " --> " +
      secondsToTime(to) +
      (settings ? " " + settings : "") +
      "\r\n";

    lines.forEach((line) => {
      this.content += line + "\r\n";
    });

    return this.content;
  }

  toString(): string {
    return this.content;
  }
}

function secondsToTime(sec: number) {
  function pad(num: number) {
    if (num < 10) {
      return "0" + num;
    }
    return num;
  }

  var seconds = +(sec % 60).toFixed(3).toString();
  var minutes = Math.floor(sec / 60) % 60;
  var hours = Math.floor(sec / 60 / 60);

  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + '.000';
}
