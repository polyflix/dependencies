import { SplittedTimestamp } from "../types/time.type";

export class Timestamp {
  constructor(
    public readonly startTime: number,
    public readonly endTime: number
  ) {}

  /**
   * Parse à timestamp from a raw and return an instance of Timestamp.
   * @param {string} timestamp the timestamp to parse
   * @param {string} marker the marker for split timestamp
   * @returns {Timestamp} the timestamp parsed
   */
  static fromRaw(timestamp: string, marker: string): Timestamp {
    const [startTimeRaw, endTimeRaw] = timestamp.split(marker);

    if (!endTimeRaw) return;

    const startTimeValues = Timestamp.splitTimestamp(startTimeRaw);
    const endTimeValues = Timestamp.splitTimestamp(
      endTimeRaw.trim().split(" ")[0]
    );

    return new Timestamp(
      Timestamp.toMilliseconds(startTimeValues),
      Timestamp.toMilliseconds(endTimeValues)
    );
  }

  /**
   * Split a raw timestamp to a SplittedTimestamp.
   * @param {string} timestamp the raw timestamp
   * @returns {SplittedTimestamp} the splitted timestamp
   */
  private static splitTimestamp(timestamp: string): SplittedTimestamp {
    const [hours, minutes, secondsAndMilliseconds = ""] = timestamp.split(":");
    const millisecondSeparator = secondsAndMilliseconds.includes(",")
      ? ","
      : secondsAndMilliseconds.includes(".")
      ? "."
      : "";

    const [seconds, milliseconds] =
      secondsAndMilliseconds.split(millisecondSeparator);

    return {
      h: Number(hours),
      m: Number(minutes),
      s: Number(seconds),
      ms: Number(milliseconds),
    };
  }

  /**
   * Convert a splitted timestamp to a milliseconds timestamp
   * @param param0
   * @returns
   */
  private static toMilliseconds = ({
    h = 0,
    m = 0,
    s = 0,
    ms = 0,
  }: SplittedTimestamp): number => h * 3600000 + m * 60000 + s * 1000 + ms;
}
