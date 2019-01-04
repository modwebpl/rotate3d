export class rot3d {
  constructor({id = 'rot3d', imageDir, image, fps, cursor = 'grab', from = 1}) {
    this.init(id, imageDir, image, fps, cursor, from);
  }

  init(id, imageDir, image, fps, cursor, from) {
    if (!this._setVars(id, imageDir, image, fps, from)) return;
    this._setEvents(cursor);
  }

  _setVars(id, imageDir, image, fps, from) {
    var _this = this;

    _this._app = document.getElementById(id);
    if (!_this._app) return false;

    _this._img = _this._app.querySelector(image) || _this._app.getElementsByTagName('img')[0];
    if (!_this._img && !isImage(_this._img)) return false;

    // rotate on click
    /*_this._box = document.querySelectorAll('.prodBox');
    if (!_this._box.length) return false;*/
    //

    this._ev = {};
    _this._move = 0;

    _this._fps = fps || parseInt(_this._app.getAttribute('data-fps'));

    _this._startFrom = from;
    _this._prev = from;
    _this._cur = from;

    _this._dir = imageDir || _this._app.getAttribute('data-dir');
    _this._imgArr = [];

    return true;
  }

  _setEvents(cursor) {
    //this._changeAnim();
    this._app.style.cursor = cursor;
    this._setRenders();
  }

  /*_changeAnim() {
      var _this = this;

      this._box._fn = this._box._fn || {};
      this._box._fn.click = function () {

        each(_this._box, (key, val) => {
          val.classList.remove('active');
          this.classList.add('active');
        });

        _this._ev.destroy();
        _this._dir = this.getAttribute('data-dir');
        _this._fps = parseInt(this.getAttribute('data-fps')) || _this._fps;
        _this._setRenders();
      };

      each(this._box, (key, val) => {
        val.addEventListener('click', this._box._fn.click);
      });
    }*/

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
      if (this._cur >= this._fps + 1) this._cur = this._startFrom;
      else if (this._cur < this._startFrom) this._cur = this._startFrom;

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
