export class rot3d {
  constructor({id = 'rot3d', imageDir, image, fps, cursor = 'grab', from = 1}) {
    this.init(id, imageDir, image, fps, cursor, from);
  }

  init(id, imageDir, image, fps, cursor, from) {
    if (!this._setVars(id, imageDir, image, fps, from)) return;
    this._setEvents(cursor);
  }

  _setVars(id, imageDir, image, fps, from) {
    let _this = this;

    _this._app = document.getElementById(id);
    if (!this._app) return false;

    _this._img = this._app.querySelector(image) || this._app.getElementsByTagName('img')[0];
    if (!this._img && !isImage(this._img)) return false;

    this._ev = {};
    _this._move = 0;

    _this._fps = fps || parseInt(this._app.getAttribute('data-fps'));

    _this._startFrom = from;
    _this._prev = from;
    _this._cur = from;

    _this._dir = imageDir || this._app.getAttribute('data-dir');
    _this._imgArr = [];

    return true;
  }

  _setEvents(cursor) {
    this._app.style.cursor = cursor;
    this._setRenders();
  }

  _setRenders() {
    this._img.src = `${this._dir}${this._cur}.png`;

    this._imgArr = [];

    for (let i = this._startFrom; i <= this._fps; i++) {
      let img = new Image();
      img.src = `${this._dir}${i}.png`;

      img.onload = () => {
        this._imgArr.push(i);
        this._imgArr.length === this._fps ? this._setDrag() : '';
      };
    }
  }

  _setDrag() {
    this._ev = new Hammer(this._app);

    this._ev.get('pan').set({
      direction: Hammer.DIRECTION_ALL
    });

    this._ev.on('pan panend press panleft panright', (e) => {
      e.type === 'panleft' ? this._moveLeft() : e.type === 'panright' ? this._moveRight() : e.type === 'panend' ? this._move = 0 : '';
    });
  }

  _moveLeft() {
    this._move += 1;
    if (this._move === 1) this._loadImage('left');
  }

  _moveRight() {
    this._move += 1;
    if (this._move === 1) this._loadImage('right');
  }

  _loadImage(dir) {
    this._move = 0;

    if (dir === 'right') {
      this._cur >= this._fps + 1 ? this._cur = this._startFrom : this._cur < this._startFrom ? this._cur = this._startFrom;

      this._prev = this._cur;
      this._img.src = `${this._dir}${this._cur}.png`;
      this._cur += 1;
    }

    if (dir === 'left') {

      if (this._cur === this._startFrom) {
        this._cur = this._fps;
        this._prev = this._cur + 1;
      }

      this._cur -= 1;
      this._prev = this._cur + 1;
      this._img.src = `${this._dir}${this._cur}.png`;
    }
  }

}
