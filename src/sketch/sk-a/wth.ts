
export class WthObj {
  static init_v = -7;
  static origin_y = 100;
  static bounce_mod = 0.6;
  static g = 0.25;

  y_max = WthObj.origin_y;
  y_min = 0;
  x = 0;
  y = 0;
  v = 0;
  active = false;
  txt: string;

  constructor(txt: string) {
    this.txt = txt;
  }
  /* advance by one step _*/
  step() {
    let bounce_mod = WthObj.bounce_mod;
    const g = WthObj.g;
    this.y += this.v;
    if(this.y > this.y_max) {
      this.v *= -bounce_mod;
      this.y = this.y_max;
      if(((this.v + g) * bounce_mod) - (this.v + g) < 0.25) {
        if(this.active) {
          this.v = WthObj.init_v;
        } else {
          this.v = 0;
        }
      }
    } else {
      this.v += g; // gravity
    }
  }
}
