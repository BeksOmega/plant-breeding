/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import p5 from "p5";

interface State {
  x: number;
  y: number;
  d: number;
  r: number;
  g: number;
  b: number;
}

export interface Point {
  x: number;
  y: number;
}

export class Turtle {
  x = 0;
  y = 0;
  d = 0;

  r = 0;
  g = 0;
  b = 0;

  stateStack: State[] = [];

  constructor(private readonly p: InstanceType<typeof p5>) {}

  forward(dist: number) {
    const x1 = this.x + dist * this.p.cos(this.p.radians(this.d));
    const y1 = this.y + dist * this.p.sin(this.p.radians(this.d));
    this.p.line(this.x, this.y, x1, y1);
    this.x = x1;
    this.y = y1;
  }

  /**
   * Move the turtle forward by the given distance without drawing.
   */
  jumpForward(dist: number) {
    this.x += dist * this.p.cos(this.p.radians(this.d));
    this.y += dist * this.p.sin(this.p.radians(this.d));
  }

  /** Turn left by the given angle in degrees. */
  left(angle: number) {
    this.d -= angle;
  }

  /** Turn right by the given angle in degrees. */
  right(angle: number) {
    this.d += angle;
  }

  setPosition(x = null, y = null, d = null) {
    if (x !== null) this.x = x;
    if (y !== null) this.y = y;
    if (d !== null) this.d = d;
  }

  pushState() {
    this.stateStack.push({
      x: this.x,
      y: this.y,
      d: this.d,
      r: this.r,
      g: this.g,
      b: this.b,
    });
  }

  popState() {
    const state = this.stateStack.pop();
    if (!state) return;
    this.x = state.x;
    this.y = state.y;
    this.d = state.d;
    this.r = state.r;
    this.g = state.g;
    this.b = state.b;
  }

  setColour(r: number, g: number, b: number) {
    this.p.fill(r, g, b);
    this.p.stroke(r, g, b);
  }

  circle(r: number) {
    this.p.circle(this.x, this.y, r * 2);
  }
}
