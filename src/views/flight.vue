<script>
//// 0 未开始， 1游戏中， 2结束
const PRE = 0;
const PLAYING = 1;
const END = 2;
const LSKEY = 'LS_FLIGHT';


export default {
  name: "flight",
  data() {
    return {
      size: 5,
      clicked: 1,
      unclick: 0,
      failed: 2,
      //
      playground: [],
      current: 0,
      //
      _tsInter: null,
      ts: 0,
      //
      gs_pre: PRE,
      gs_playing: PLAYING,
      gs_end: END,
      gameStatus: PRE,
      //
      best: 9999,
    }
  },
  methods: {
    loadFromLS() {
      let s = localStorage.getItem(LSKEY);
      if (s !== null) {
        try {
          let obj = JSON.parse(s);
          this.best = obj.best;

        } catch (e) {
          console.error(e)
        }
      }
    },

    saveToLS() {
      let obj = {
        best: this.best < this.ts ? this.best : this.ts
      }
      localStorage.setItem(LSKEY, JSON.stringify(obj))
    },

    reload() {
      this.current = 0;
      this.ts = 0;
      this.stopTimer();
      this.gameStatus = PRE;
      this.init();

    },
    startTimer() {
      if (this._tsInter === null) {
        let v = this;
        this._tsInter = setInterval(_ => {
          v.ts += .1
        }, 100)
      }
    },
    stopTimer() {
      if (this._tsInter) {
        clearInterval(this._tsInter);
        this._tsInter = null;
      }
    },
    init() {
      this.loadFromLS();
      this.current = 0;
      let o = this.size * this.size;
      this.playground = []
      for (let i = 0; i < this.size; i++) {
        this.playground.push([])
      }
      let seq = []
      let cnt = 0;
      while (seq.length < o) {
        cnt++;
        let cur = Math.round(Math.random() * (o + 2))
        if (0 < cur && cur <= o && seq.indexOf(cur) === -1) {
          this.playground[Math.floor(seq.length / this.size)][seq.length % this.size] = {
            s: this.unclick,
            w: cur
          }
          seq.push(cur);
        }
      }
      this.startTimer();
    },
    clickOne(row, col) {
      if (this.gameStatus === PRE) {
        this.gameStatus = PLAYING;
      }
      if (this.gameStatus === END) {
        return false;
      }
      this.startTimer();
      ///
      let max = this.size * this.size;
      let o = this.playground[row][col];
      if (o.w === this.current + 1) {
        // 点对了
        this.current++;
        o.s = this.clicked;
        if (this.current === max) {
          this.gameStatus = END;
          this.stopTimer();
          if (this.ts < this.best) {
            this.best = this.ts;
          }
          this.saveToLS();
        }
      } else {
        if (o.s === this.unclick) {
          o.s = this.failed;
        }
      }

    },
  },
  created() {
    this.init();
  }
}
</script>

<template>
  <div id="main">
  <div class="box-canvas" id="playground">
    <div style="width: 100%; min-width: 390px; text-align: center; color:white">
      TIME: {{ts.toFixed(1)}}s | BEST: {{best.toFixed(1)}}s
    </div>

    <div style="display: flex;flex-wrap: wrap; justify-content: center; margin-top: 20px; user-select: none">
      <div v-for="(row, rowIndex) in playground" style="display: block; width: 100%">
        <div style="margin: 0 auto; width: fit-content">
          <div v-for="(word, colIndex) in row" class="pot" @click="clickOne(rowIndex, colIndex)">
            <span v-if="word.s === unclick">{{word.w}}</span>
            <span v-else-if="word.s === failed" style="color: red">{{word.w}}</span>
            <span v-else style="color: #CCCCCC">{{word.w}}</span>
          </div>

        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 2rem">
      <button @click="reload">RE</button>
    </div>
  </div>
  </div>
</template>

<style scoped>
:root {
  --background-color: #333642;
}

* {
  margin: 0;
  padding: 0;
}

#main {
  width: 100%;
  min-width: 390px;
  max-width: 420px;
  margin: 20px auto;
  background-color: #333642;
}

#playground {
  margin: 8% auto;
  display: block;
  padding-top: 20px;
  background: var(--background-color);
}

button {
  width: 120px;
  height: 40px;
  margin: 5px 10px;
  color: #ffffff;
  background-color: #336699;
  border: 2px #ffffff solid;
  border-radius: 5px;
}

button:hover {
  cursor: pointer;
}

.pot {
  display: inline-block;
  width: 60px;
  height: 60px;
  font-size: 30px;
  text-align: center;
  line-height: 2.0;
  background-color: white;
  border: #000033 1px solid;
}

.cur .pot {
  width: 40px;
  height: 40px;
  font-size: 20px;
  vertical-align: top;
}

</style>