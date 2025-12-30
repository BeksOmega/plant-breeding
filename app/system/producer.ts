/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIS
 */

import { Segment } from "./segment";

export class Producer<S extends Segment> {
  /** She default production is identity. */
  produce(segment: S): S {
    return segment;
  }

  save(): Record<string, any> {
    return Object.create(null);
  }

  load(data: Record<string, any>) {
    for (const key in this) {
      if (
        Object.prototype.hasOwnProperty.call(data, key) &&
        data[key] !== undefined
      ) {
        (this as any)[key] = data[key];
      }
    }
  }

  saveString(): string {
    return JSON.stringify(this.save(), undefined, 2);
  }

  loadString(data: string) {
    this.load(JSON.parse(data));
  }
}
