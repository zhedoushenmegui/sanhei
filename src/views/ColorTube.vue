<script>
import {
  deepCopy
} from "@/utils/utils.js";
//// 0 未开始， 1游戏中， 2结束
const PRE = 0;
const PLAYING = 1;
const END = 2;

const ORDER = 4; // 一个试管几种颜色
const SIZE = 14;
const EMPTY = 2;

const navy = '#000033';
const junlv = '#006633';
const qianlv = '#00FF99';
const qing = '#33FFFF';
const zise = '#660099';
const qiezi = '#6633CC';
const kaqise = '#666633';
const lan = '#6699FF';
const suliao = '#66FFFF';
const kafei = '#993300';
const zaohongse = '#996666'
const shuinihui = '#99CCCC';
const hong = '#CC0033';
const yinghuase = '#FF99CC';
const qianhuang = '#FFFF66';
const juhuang = '#FF6600';
const colors = [hong, lan, kaqise, qing, qianhuang, qianlv, zise, yinghuase, shuinihui, junlv, kafei, juhuang, navy, qiezi, suliao, zaohongse];

const CTTUBES = 'cttubes'


export default {
  name: "ColorTube",
  data() {
    return {
      //
      size: SIZE,
      selected: -1,
      selectColor: null,
      clickIndex: '-',
      colors: colors,
      ORDER: ORDER,

      ///
      tubes: [],
      showTubes: [],
      //
      gameStatus: 0,  // 0 未开始， 1游戏中， 2结束
      //
      backupPlayground: [],
      cnt: 0, // 记录总步数
      ts: 0, // 记录时间
      _tsInter: null,
    }
  },
  methods: {
    startTimer(){
      if(this._tsInter === null) {
        let v = this;
        this._tsInter = setInterval(_=>{v.ts += .1}, 100)
      }
    },
    stopTimer(){
      if(this._tsInter) {
        clearInterval(this._tsInter);
        this._tsInter = null;
      }
    },
    saveToLS() {
      let obj = {
        tubes: this.tubes,
        backupPlayground: this.backupPlayground,
        gameStatus: this.gameStatus,
        cnt:this.cnt,
        ts: this.ts};
      localStorage.setItem(CTTUBES, JSON.stringify(obj));
    },
    loadFromLS() {
      let _s = localStorage.getItem(CTTUBES);
      if(_s) {
        try {
          let obj = JSON.parse(_s);
          this.tubes = obj.tubes;
          this.backupPlayground = obj.backupPlayground;
          this.gameStatus = obj.gameStatus;
          this.cnt = obj.cnt;
          this.ts = obj.ts;
          if(obj.ts>0) {
            this.startTimer();
          }
          return true;
        }catch (e) {}
      }
      return false;
    },
    initProcess: function () {
      this.tubes = []
      this.showTubes = [];
      this.backupPlayground = []
      this.cnt = 0;
      for (let i = 0; i < EMPTY; i++) {
        this.tubes.push([]);
      }
      for (let i = 0; i < SIZE - EMPTY; i++) {
        let cs = [];
        for (let j = 0; j < ORDER; j++) {
          //cs.push(colors[Math.floor(Math.random() * SIZE)]);
          cs.push(colors[i]);
        }
        this.tubes.push(cs);
      }
      this.shuffle(2);
      this.saveToLS();
    },

    init(reinit) {
      let flag = false;
      if(!reinit) {
        flag = this.loadFromLS();
      }
      ///
      if(!flag) {
        this.initProcess();
      }
      ///
      this.show();
    },
    range(size) {
      let rst = [];
      for (let i = 0; i < size; i++) {
        rst.push(i);
      }
      return rst;
    },
    clickOne(index) {
      this.startTimer();
      this.clickIndex = index;
      // 如果是 未开始 则开始
      if (this.gameStatus === PRE) {
        this.gameStatus = PLAYING;
      }
      // 如果不是 playing 则不继续
      if (this.gameStatus !== PLAYING) {
        return;
      }
      // 第一次点击
      if (this.selected === -1) {
        // 如果试管不为空， 则记录当前试管序号
        if (this.tubes[index].length > 0) {
          this.selected = index;
        }
        return;
      }
      // 两次点击同一个试管， 取消
      if (this.selected === index) {
        this.selected = -1;
        return;
      }
      // 第二次的试管满了
      if (this.tubes[index].length === ORDER) {
        return;
      }
      let color0 = this.tubes[this.selected].slice(-1)[0];

      if (this.tubes[index].length === 0) {
        this.backupData();
        let color = this.tubes[this.selected].pop();
        this.tubes[index].push(color);
        this.selected = -1;
        this.saveToLS();
        this.show();
        this.cnt ++;
        return;
      }
      let color1 = this.tubes[index].slice(-1)[0];
      if (color0 === color1) {
        this.backupData();
        let color = this.tubes[this.selected].pop();
        this.tubes[index].push(color);
        this.selected = -1;
        this.saveToLS();
        this.show();
        this.cnt ++;
        return;
      }
    },
    backupData() {
      console.log("backup start", this.backupPlayground.length)
      let arr = deepCopy(this.tubes);
      this.backupPlayground.push(arr);
      console.log("backup end", this.backupPlayground.length)
    },
    restart(clearTimeFlag) {
      let flag = confirm("确定重开？");
      if (!flag) {
        return;
      }
      this.clickIndex = -1;
      this.cnt = 0;
      if(clearTimeFlag) {
        this.ts = 0;
      }
      this.gameStatus = PLAYING;
      let arr = this.backupPlayground[0];
      this.backupPlayground = [];
      this.selected = -1;
      this.tubes = arr;
      this.saveToLS();
      this.show();
    },
    giveup() {
      if(this.gameStatus === PLAYING) {
        let flag = confirm("确定换一局？ 跟现在不是一局哦！")
        if (!flag) {
          return;
        }
      }
      localStorage.removeItem(CTTUBES)
      this.gameStatus = PRE;
      this.backupPlayground = [];
      this.selected = -1;
      this.cnt =0;
      this.ts = 0;
      this.stopTimer();
      // 换一局
      this.init(true);
      this.shuffle(2);
      this.saveToLS();
      this.show();
    },
    goback() {
      console.log("size", this.backupPlayground.length)
      if (this.backupPlayground.length === 0) {
        return;
      }
      console.log("goback start", this.backupPlayground.length);
      let arr = this.backupPlayground.pop();
      this.selected = -1;
      this.tubes = arr;
      this.saveToLS();
      this.show();
      console.log("goback end", this.backupPlayground.length);
    },
    shuffle(r) {
      if (this.gameStatus !== 0) {
        return;
      }
      if (r < ORDER * 30) {
        r = ORDER * 30;
      }
      let last = -1;
      for (let i = 0; i < r; i++) {
        let a = -1;
        while (a < 0) {
          let tmp = Math.floor(Math.random() * SIZE);
          if (this.tubes[tmp].length > 0 && tmp !== last) {
            a = tmp;
          }
        }
        //
        let b = -1;
        while (b < 0) {
          let tmp = Math.floor(Math.random() * SIZE);
          if (this.tubes[tmp].length < ORDER && tmp !== a) {
            b = tmp;
          }
        }
        //
        let color = this.tubes[a].pop();
        this.tubes[b].push(color);
      }
      // 对齐
      while (true) {
        let cadi = [];
        for (let i = 0; i < SIZE; i++) {
          if (this.tubes[i].length < ORDER && this.tubes[i].length > 0) {
            cadi.push(i);
          }
        }
        let size = cadi.length;
        if (size < 2) {
          break;
        }
        for (let j = 0; j < Math.floor(size / 2); j++) {
          let k = size - j - 1;
          let mj = cadi[j];
          let mk = cadi[k];
          while (this.tubes[mj].length > 0 && this.tubes[mk].length < ORDER) {
            this.tubes[mk].push(this.tubes[mj].pop());
          }
        }
      }
      // 平移
      for (let i = 0, j = EMPTY; i < EMPTY, j < SIZE;) {
        if (this.tubes[i].length > 0 && this.tubes[j].length === 0) {
          this.tubes[j] = this.tubes[i];
          this.tubes[i] = [];
        }
        if (this.tubes[i].length === 0) {
          i++;
        }
        if (this.tubes[j].length > 0) {
          j++;
        }
      }
      //
    },
    show() {
      // 检查是否获胜
      let flag = true;
      this.tubes.forEach(function (v) {
        let b = new Set(v);
        flag &= (b.size === 1 && v.length === ORDER) || v.length === 0
      })
      // 反转
      this.showTubes = deepCopy(this.tubes);
      this.showTubes.forEach(function (v) {
        v.reverse()
      });
      //
      if (flag) {
        this.gameStatus = END;
        localStorage.removeItem(CTTUBES);
        this.stopTimer();
        setTimeout(_ => {
          alert("恭喜获胜！")
        }, 200)
      }
    }
  },
  created() {
    this.init(false);
  }
}
</script>

<template>
  <div id="main">
    <div class="box-canvas" id="playground">
      <div id="tubes">
        <div v-for="(tube, index) in showTubes" class="tube" @click="clickOne(index)">
          <div style="width:100%; height: 30px;">
            <p v-if="selected === index">
              >_&ang;
            </p>
            <p v-else-if="selected >= 0 && showTubes[selected][0] === tube[0] && tube.length < ORDER">
              -_-|
            </p>
          </div>

          <div class="tube-color" v-for="i in range(ORDER - tube.length)">
          </div>
          <div class="tube-color" v-for="(color, j) in tube"
               :style="{background: color}">
          </div>
        </div>
      </div>

      <div style="width: 100%; min-width: 390px; text-align: center">
            <span style="padding-left: 20px; color:white">Click: {{clickIndex}} |
                <span v-if="selected >= 0"  :style="{background: tubes[selected].slice(-1)[0]}" style="height: 10px; width: 10px; display: inline-block"></span>
                <span v-else style="height: 10px; width: 10px; display: inline-block; background-color: white"></span>
            </span>
        <span style="padding-left: 20px; color:white">Step: {{cnt}}/{{ts.toFixed(1)}}s </span>
      </div>
      <div style="display: flex; justify-content: center">
        <div v-show="gameStatus === 1">
          <button @click="goback()">Back</button>
          <button @click="giveup()">New</button>
          <button @click="restart(false)">RE</button>
        </div>
        <div v-show="gameStatus === 2">
          <button @click="restart(true)">RE</button>
          <button @click="giveup()">New</button>
        </div>
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
  margin: 0 auto;
  background-color: #333642;
}

#playground {
  margin: auto;
  display: block;
  margin-bottom: 8%;
  padding-bottom: 30px;
  background: var(--background-color);
}

#tubes {
  width: 380px;
  margin: 0 auto;
  overflow: hidden;
}

.tube {
  height: 192px;
  margin: 30px 5px;
  border: 3px #ffffff solid;
  display: inline-block;
  vertical-align: middle;
  background-color: white;
  border-radius: 0 0 30px 30px;
}

.tube-color {
  width: 36px;
  height: 40px;
}

.tube > .tube-color:last-child {
  border-radius: 0 0 30px 30px;
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

.tube:hover {
  cursor: pointer;
}

#tubes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>