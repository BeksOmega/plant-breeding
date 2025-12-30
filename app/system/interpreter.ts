/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIS
 */

import { Segment } from "./segment";
import { Turtle } from "../turtle/turtle";

export class Interpreter {
  constructor(public readonly turtle: Turtle) {}

  /** Recursively interprets the segment. */
  interpret(segment: Segment): void {}
}
