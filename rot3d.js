export class rot3d {
  constructor(conf = {id = 'rot3d', imageDir, image, fps, cursor, from = 1}) {
    this.init(conf);
  }

  init(conf) {
    if (!this._setVars(conf)) return;
    this._setEvents();
  }

  _setVars(conf) {
    let _this = this;
    
    _this._confg = conf;

    _this._app = document.getElementById(this._conf.id);
    if (!this._app) return false;

    _this._img = this._app.querySelector(this._conf.image) || this._app.getElementsByTagName('img')[0];
    if (!this._img && !isImage(this._img)) return false;

    _this._ev = {};
    _this._move = 0;

    _this._fps = this._conf.fps || parseInt(this._app.getAttribute('data-fps'));

    _this._prev = this._conf.from || 1;
    _this._cur = this._conf.from || 1;

    _this._dir = this._conf.imageDir || this._app.getAttribute('data-dir');
    _this._imgArr = [];

    return true;
  }

  _setEvents() {
    this._app.style.cursor = cursor || 'grab';
    this._setRenders();
  }

  _setRenders() {
    this._img.src = `${this._dir}${this._cur}.png`;

    this._imgArr = [];

    for (let i = this._conf.from || 1; i <= this._fps; i++) {
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
      this._cur >= this._fps + 1 ? this._cur = this._conf.from : this._cur < this._conf.from ? this._cur = this._conf.from;

      this._prev = this._cur;
      this._img.src = `${this._dir}${this._cur}.png`;
      this._cur += 1;
    }

    if (dir === 'left') {

      if (this._cur === this._conf.from) {
        this._cur = this._fps;
        this._prev = this._cur + 1;
      }

      this._cur -= 1;
      this._prev = this._cur + 1;
      this._img.src = `${this._dir}${this._cur}.png`;
    }
  }

}
