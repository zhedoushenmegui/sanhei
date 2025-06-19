<script>
import {
  base64Decoder,
  base64Encoder,
  deepCopy,
} from "../utils/utils";
// 定义常量和工具函数
const DIM_BASE = 2;
/// assert (DIM_BASE >= 2);
const TOOL_UPPER = 401; // 道具升级一个元素
const TOOL_EXC = 402;  // 道具提取地图上的元素
const TOOL_ADD_HUB = 403 // 道具增加一个暂存区位置
const TOOL_DEL = 404;  // 道具删除地图上的元素
//
const lsNameArray = {
  map: 'map',
  best: 'best'
};

// 配置对象
const config = {
  prob: {
    1: 800,
    2: 200,
    3: 50,
    4: 13,
    5: 3,
    '-1': 81,
    '-2': 9,
    '-3': 3,
    [TOOL_EXC]: 10,  /// 道具
  },
  defaultDim: 2,
  gameStatus: {
    'ready': 0,
    'running': 1,
    'end': 2,
    'sys_pause': 3
  },
  upLimit: 9,                 // 数字上限
  downLimit: -4,              // 数字下限
  pauseTime: 100,             // 数字落下后暂停时间
  scoreFactor: 2,             // 每多一个增加2倍分数
  scoreFactorLevel: 3,        // 每多一层增加3倍分数
  curScoreMsg: '',
  mapSize: 7,                 // 地图尺寸
  tempHubNum: 3,              // 临时存储区大小
  alertTime: 3,               // 警告提示次数
};

// 随机生成棋盘内容
function generator(probs) {
  let all = 0;
  for (let i in probs) {
    all += probs[i];
  }
  let mod = Math.floor(Math.random() * all);
  for (let i in probs) {
    mod -= probs[i]
    if (mod < 0) {
      return parseInt(i);
    }
  }
  return 1;
}

/**
 * 坐标转换为键值
 * @param loc
 * @returns {*}
 */
function locToKey(loc) {
  return loc.join(',');
}
export default {
  name: "sanhe1",
  data() {
    return {
      EXC: TOOL_EXC,

      forbidLocInfoTime: config.alertTime,
      gameStatus: config.gameStatus.ready,
      map: [],  /// 最低是2维
      rangeLevel: 0,  // 临时计数器，用于追踪单次落子操作中连续合并的次数
      ////
      cols: [],
      sandbox: [],
      now: 0,
      score: 0,
      step: 0,
      tempHub: [],
      locations: [],
      ////
      best: {
        number: 0,
        score: 0,
        step: 0
      },
      settings: {
        soundPlay: true
      },
      dimBase: DIM_BASE,
      size: config.mapSize,
      dim: config.defaultDim,
      ////
      curScoreMsg: '',
      curTipMsg: '',
    }
  },
  methods: {
    init(restart) {
      this.curScoreMsg = ''
      this.gameStatus = config.gameStatus.ready;
      this.score = 0;
      this.step = 0;
      this.cols = [];
      this.locations = [];
      for (let i = 0; i < this.size; i++) {
        this.cols.push(String.fromCharCode(65 + i));
        this.sandbox.push([])
      }
      for (let i = 0; i < this.dim; i++) {
        this.locations.push(0);
      }
      // 暂存区初始化
      this.initTempHub();
      // 状态初始化
      if (restart || this.loadStatus() === null) {
        // 重新生成地图
        this.initMap(this.dim, this.size);
        this.generateNextChess();
      } else {
        // 从ls 里加载地图, 配置, 分数等
        this.loadStatus();
        if (this.map.length !== this.size) {
          this.initMap(this.dim, this.size);
        }
        if (this.tempHub === undefined) {
          this.tempHub = [];
          // 暂存区初始化
          this.initTempHub();
        }
        if (this.tempHub.length > config.tempHubNum) {
          let arr = []
          for (let i = 0; i < config.tempHubNum; i++) {
            arr.push(this.tempHub[i])
          }
          this.tempHub = arr;
        }
      }
      // 更新地图
      this.changePlane(this.map);
      // 保存地图状态
      this.saveStatus();
    },
    readScore() {
      if (localStorage.getItem(lsNameArray.best) === null) {
        return;
      }
      let str = localStorage.getItem(lsNameArray.best);
      let jsonBest = base64Decoder(str);
      this.best = JSON.parse(jsonBest);
    },
    initTempHub() {
      this.tempHub = [];
      for (let i = 0; i < config.tempHubNum; i++) {
        this.tempHub.push(0);
      }
    },
    /**
     *
     * @param level
     * @param location
     * @param dim
     * @param size
     * @returns {{val: (number|number), loc}|*[]}
     */
    generateMap(level, location, dim, size) {
      if (level === dim) {
        let probs = deepCopy(config.prob);
        probs[0] = probs[1] * 2;  // 空白的概率是 1 的2倍
        probs[TOOL_EXC] = 0;           // 地图上不会刷新EXC
        let number = generator(probs);
        this.updateBest(number);
        return {
          val: number,
          loc: location
        };
      } else {
        let tmpMap = [];
        for (let i = 0; i < size; i++) {
          let tmpLoc = deepCopy(location);
          tmpLoc.push(i);
          tmpMap[i] = this.generateMap(level + 1, tmpLoc, dim, size)
        }
        return tmpMap;
      }
    },
    /**
     *
     * @param dim
     * @param size
     */
    initMap(dim, size) {
      // 生成地图
      this.map = this.generateMap(0, [], dim, size);
      this.changePlane(this.map)
    },
    onPut(pot){
      if(this.gameStatus === config.gameStatus.end) {
        if(!confirm("重新开始?")) {
          return;
        }else {
          this.init(true);
        }
      }
      // 提取地图元素
      if (this.now === TOOL_EXC) {
        if(pot.val === 0) {
          // 空地不能提取
          return;
        }
        this.now = pot.val;
        pot.val = 0;
      } else {
        this.gameStatus = config.gameStatus.running;
        if(pot.val !== 0) {
          // 非空地不能放置
          return;
        }
        this.step ++;
        this.chessIn(pot.loc)
        this.updateBest(pot.val)
      }
      this.genTipMsg()
    },
    /**
     * 计算分数, 跟当前合成的元素和合成的个数有关
     * @param val
     * @param size
     */
    countScore(val, size) {
      let _size = size - 3
      let factor = 5 + config.scoreFactor * (size - 3) + config.scoreFactorLevel * this.rangeLevel;
      if(val < 0) {
        val *= -1
      }
      let delta = factor * val
      this.score += delta
      return '(基础倍率{0} + 连续倍率{1} * 连续数量{2} + 连升奖励{3} * 连升数量{4}) x 元素分{5}={6}'.format(5, config.scoreFactor, _size, config.scoreFactorLevel, this.rangeLevel, val, delta)
    },
    /**
     * 每个棋子的进阶
     * @param target
     * @returns {*|number}
     */
    chessNextLevel(target) {
      if (target < 0) {
        target--;
      } else {
        target++;
      }
      if (target > config.upLimit || target < config.downLimit) {
        return 0;
      }
      return target;
    },
    generateNextChess(){
      let probs = deepCopy(config.prob);
      this.now = generator(probs);
    },
    /**
     * 将棋子放入指定位置并处理相关逻辑
     * @param location
     */
    chessIn(location) {
      this.curScoreMsg = '';
      this.rangeLevel = 0
      let chessNum = deepCopy(this.now)
      // 生成
      this.generateNextChess();
      this.setTargetChess(location, chessNum)
      this.changePlane(this.map);
      ///
      this.gameStatus = config.gameStatus.sys_pause;
      let v = this;
      setTimeout(function () {
        v.gameStatus = config.gameStatus.running;
        if (!v.checkAlive()) {
          v.gameStatus = config.gameStatus.end;
          alert('游戏结束!');
        }
      }, 20)
      ////
      this.curScoreMsg = '';
      while(true) {
        let val = this.getTargetChess(location);
        let scorePoints = this.chessInProcess(location, val);
        let len = scorePoints.length;
        if (len < 3) {
          break;
        }
        for (let i = 0; i < len; i++) {
          this.setTargetChess(scorePoints[i], 0);
        }
        // 计算分数
        let msg = this.countScore(val, len);
        this.curScoreMsg += msg + ';'
        // 计算进阶数字
        let next = this.chessNextLevel(val);
        this.setTargetChess(location, next);
        this.rangeLevel++;
        // 更新最好成绩
        this.updateBest(next);
      }
      ///
      this.changePlane(this.map);
      ///
      this.genTipMsg()
    },
    changePlane(map) {
      let location = this.locations;
      let tmpMap = map;
      for (let i = 0, len = location.length - DIM_BASE; i < len; i++) {
        tmpMap = tmpMap[location[i]];
      }
      this.sandbox = tmpMap;
    },
    onChangePlane(index, ifUp){
      let t = this.locations[index];
      if (ifUp) {
        t++;
      } else {
        t--;
      }
      this.locations[index] = (t + config.mapSize * 10) % config.mapSize;
      this.changePlane(this.map);
    },
    chessInProcess(location, val) {
      // 周围相邻的点, 已经出现过
      let seeds = {};
      let key = locToKey(location);
      seeds[key] = location;
      // 相同的点
      let score = {};
      // 周围相邻的点, 未使用
      let unusedPoints = {};
      unusedPoints[key] = location;
      while (true) {
        for (let name in unusedPoints) {
          let loc = unusedPoints[name];
          delete unusedPoints[name];
          // 指定位置的数字与当前落子位置的数字相同
          if (this.getTargetChess(loc) === val) {
            let locStr = locToKey(loc);
            score[locStr] = loc;
            for (let i = 0; i < this.dim; i++) {
              let a = loc[i] - 1, b = loc[i] + 1;
              // 相邻的位置在范围内
              if (a >= 0 && a < this.size) {
                let tmpLoc = deepCopy(loc);
                tmpLoc[i] = a;
                let keyStr = locToKey(tmpLoc);
                if (seeds[keyStr] === undefined) {
                  seeds[keyStr] = tmpLoc;
                  unusedPoints[keyStr] = tmpLoc;
                }
              }
              if (b >= 0 && b < this.size) {
                let tmpLoc = deepCopy(loc);
                tmpLoc[i] = b;
                let keyStr = locToKey(tmpLoc);
                if (seeds[keyStr] === undefined) {
                  seeds[keyStr] = tmpLoc;
                  unusedPoints[keyStr] = tmpLoc;
                }
              }
            }
          }
        }
        let size = 0;
        for (let item in unusedPoints) {
          size++;
        }
        if (size < 1) {
          break;
        }
      }

      let scorePoints = [];
      for (let item in score) {
        scorePoints.push(score[item]);
      }
      return scorePoints;
    },
    checkAlive() {
      this.saveStatus();
      let alive = false;
      function traversal(node) {
        if (alive) {
          return;
        }
        if (node['val'] === undefined) {
          for (let i = 0, len = node.length; i < len; i++) {
            traversal(node[i]);
            if (alive) {
              return;
            }
          }
        } else {
          if (node['val'] === 0) {
            alive = true;
          }
        }
      }
      traversal(this.map);
      return alive;
    },
    setTargetChess(location, val) {
      let tmpMap = this.map;
      let len = location.length;
      for (let i = 0; i < len - DIM_BASE; i++) {
        tmpMap = tmpMap[location[i]];
      }
      let x = location[len - 2], y = location[len - 1];
      tmpMap[x][y]['val'] = val;
    },
    getTargetChess(location) {
      let tempMap = deepCopy(this.map);
      if (location.length !== this.dim) {
        alert('系统bug!建议刷新重试');
      }
      for (let i = 0, len = location.length; i < len; i++) {
        tempMap = tempMap[location[i]]
      }
      return tempMap.val;
    },
    swapTempHub(index) {
      let temp = this.tempHub[index];
      this.tempHub[index] = this.now;
      if (temp === 0) {
        // 原来暂存区是空的, 则重新生成一个棋子
        this.generateNextChess()
      } else {
        this.now = temp;
      }
      this.saveStatus();
      this.genTipMsg()
    },
    changeDim(dim) {
      if (this.gameStatus === config.gameStatus.running) {
        let ret = confirm("将重新开始, 确认?");
        if (!ret) {
          return;
        }
      }
      this.dim = dim;
      this.init(true);
    },
    changeSoundState() {
      this.settings.soundPlay = !this.settings.soundPlay;
      this.saveStatus()
    },
    saveStatus() {
      let mapObj = {
        map: this.map,
        next: this.now,
        score: this.score,
        step: this.step,
        tempHub: this.tempHub,
        settings: this.settings,
        forbidLocInfoTime: this.forbidLocInfoTime,
        gameStatus: this.gameStatus,
      };
      let jsonMap = JSON.stringify(mapObj);
      let mapStr = base64Encoder(jsonMap);
      localStorage.setItem(lsNameArray.map, mapStr);
      return localStorage.getItem(lsNameArray.map) === null;
    },
    loadStatus() {
      if (localStorage.getItem(lsNameArray.map) === null) {
        return null;
      }
      let mapStr = localStorage.getItem(lsNameArray.map);
      let jsonMap = base64Decoder(mapStr);
      let obj = JSON.parse(jsonMap);
      this.map = obj.map;
      this.now = obj.next;
      this.score = obj.score;
      this.step = obj.step;
      this.tempHub = obj.tempHub;
      this.settings = obj.settings;
      if (obj['forbidLocInfoTime'] !== undefined) {
        this.forbidLocInfoTime = obj.forbidLocInfoTime;
      } else {
        this.forbidLocInfoTime = 1;
      }
      if (obj['gameStatus'] !== undefined) {
        this.gameStatus = obj.gameStatus;
      } else {
        this.gameStatus = config.gameStatus.running;
      }
    },
    updateBest(number) {
      if (this.step > this.best.step) {
        this.best.step = this.step;
      }
      if (this.score > this.best.score) {
        this.best.score = this.score;
      }
      if (number > this.best.number) {
        this.best.number = number;
      }
      let jsonBest = JSON.stringify(this.best);
      let strBest = base64Encoder(jsonBest);
      localStorage.setItem(lsNameArray.best, strBest);
    },
    genTipMsg() {
      this.curTipMsg = '';
      if(this.now === TOOL_EXC) {
        this.curTipMsg = '小吊车可以提取地图上元素,并任意放置.'
      }
      if(this.now === -1) {
        this.curTipMsg = '小兔子咕叽咕叽就来了.'
      }
      if(this.now === -2) {
        this.curTipMsg = '小兔子带来了玩具.'
      }
      if(this.now === -3) {
        this.curTipMsg = '小兔子在玩什么游戏呢？'
      }
      if(this.now === 1) {
        this.curTipMsg = '四叶草代表幸运'
      }
      if(this.now === 2) {
        this.curTipMsg = '胡萝卜为伞形科胡萝卜属'
      }
      if(this.now === 3) {
        this.curTipMsg = '胡萝卜为什么变成了大树呢?'
      }
      if(this.now === 4) {
        this.curTipMsg = '这棵大树是从戴夫后花园里搬来的'
      }
      if(this.now === 5) {
        this.curTipMsg = '幸运得没边了!'
      }
    }
  },
  mounted() {
    this.readScore();
    this.init(false);
    this.genTipMsg();
  }
}
</script>

<template>
  <div id="content" class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-md-offset-3 col-lg-offset-4" >
    <div style="height: 1rem; width: 100%"></div>
    <div id="head" >
      <div style="display: flex; justify-content: space-evenly; align-items: center">
        <div>
            <span class="pot" :class="'cl' + now" style="width: 40px; height: 40px">
              <span class="pot-val">{{ now }}</span>
            </span>
        </div>
        <el-button
            class="btn button dim button-border button-rounded button-primary"
            @click="changeDim(2)">
          重新开始
        </el-button>
      </div>

      <!-- 提示 -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 panel" v-if="curTipMsg">
        <el-tag class="tips">
          <el-icon><InfoFilled /></el-icon>
          {{curTipMsg}}
        </el-tag>
        <p></p>
      </div>
    </div>



    <div id="playground">
      <div id="tbody">
        <div class="line" v-for="(line, rowIndex) in sandbox" :key="rowIndex">
            <span
                class="pot"
                :class="'cl' + pot.val"
                v-for="(pot, potIndex) in line"
                :key="potIndex"
                @click="onPut(pot)">
              <span class="pot-val">{{ pot.val }}</span>
            </span>
        </div>
      </div>
    </div>

    <!-- temp hub -->
    <div v-if="tempHub.length > 0" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 panel temp-hub">
      <div>
        暂存区:
        <div
            v-for="(item, index) in tempHub"
            :key="index"
            class="pot"
            :class="'cl' + item"
            @click="swapTempHub(index)">
          <span class="pot-val">{{ item }}</span>
        </div>
      </div>
    </div>
    <!-- 得分提示 -->
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 panel" v-if="curScoreMsg">
      <p class="score-panel" id="scoreMsg">
        得分: {{ curScoreMsg }}
      </p>
    </div>    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 panel" id="scorePanel">
      <p class="score-panel">
        本局成绩:
        <el-tag class="col-xs-4 col-sm-4 col-md-4 col-lg-4">得分:{{ score }}</el-tag>
        <el-tag type="success" class="col-xs-4 col-sm-4 col-md-4 col-lg-4">步数:{{ step }}</el-tag>
      </p>
    </div>
    <!-- best score -->
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 panel">
      <p class="score-panel">
        最好成绩:
        <el-tag class="col-xs-4 col-sm-4 col-md-4 col-lg-4">得分:{{ best.score }}</el-tag>
        <el-tag type="success" class="col-xs-4 col-sm-4 col-md-4 col-lg-4">步数:{{ best.step }}</el-tag>
        <el-tag type="warning" class="col-xs-4 col-sm-4 col-md-4 col-lg-4">数字:{{ best.number }}</el-tag>
      </p>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: blanchedalmond;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  margin-top: 10px;
}

#content {
  margin: 20px auto 0;
  max-width: 600px;
  min-width: 390px;
}
#scoreMsg {
  font-size: 14px;
  color: red;
}
#soundControl {
  width: 26px;
  height: 26px;
  border: 2px solid black;
  border-radius: 50%;

  float: right;
  right: 40px;
  top: 30px;
  margin-top: 5px;

  text-align: center;
  line-height: 160%;
  cursor: pointer;
}

.disable {
  color: grey;
}

.cl0 {
  background-color: greenyellow;
  color: greenyellow !important;
}

.cl1 {
  background-color: #FFFF99;
  background: url("../img/game/101_96.png");
}

.cl2 {
  background-color: #FFCC99;
  background: url("../img/game/102_96.png");
}

.cl3 {
  background-color: #FF9999;
  background: url("../img/game/103_64.png");
}

.cl4 {
  background-color: #CCCC99;
  background: url("../img/game/104_128.png");
}

.cl5 {
  background-color: #CC9999;
  background: url("../img/game/107_128.png");
}

.cl6 {
  background-color: #99CC99;
  background: url("../img/game/109_128.png");
}

.cl7 {
  background-color: #9999CC;
  background: url("../img/game/110_128.png");
}

.cl8 {
  background-color: #99CCFF;
  background: url("../img/game/112_128.png");
}

.cl9 {
  background-color: #999966;
  background: url("../img/game/113_128.png");
}

.cl402 {
  background-color: #999966;
  background: url("../img/game/402_128.png");
}

.cl-1 {
  background-color: #336699;
  background: url("../img/game/203_128.png");
  color: #ffffff;
}

.cl-2 {
  background-color: #336666;
  background: url("../img/game/202_128.png");
  color: #ffffff;
}

.cl-3 {
  background-color: #333333;
  background: url("../img/game/201_128.png");
  color: #ffffff;
}

.cl-4 {
  background-color: #000033;
  background: url("../img/game/304_1218.png");
  color: #ffffff;
}

#nextOne {
  line-height: 36px;
  border: 2px solid #000000;
  font-weight: 300;
  font-size: 16px;
  font-family: "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  text-decoration: none;
  text-align: center;
  vertical-align: middle;
  padding: 0 20px;
  margin: 0 10px;
  transition-duration: .3s;
}

.button {
  padding: 0 20px;
}

/* 地图样式 */
#playground {
  cursor: pointer;
  width: 100%;
}

#playground > div {
  width: 100%;
}

.line {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.pot {
  min-width: 50px;
  min-height: 50px;
  display: inline-block;
  border: 1px solid whitesmoke;
  font-weight: 300;
  font-size: 16px;
  text-align: right;
  transition-duration: .3s;
  background-repeat: no-repeat;
  background-size: contain;
}

.pot p {
  position: relative;
  bottom: -15px;
  font-weight: bolder;
}

.pot-val {
  background-color: white;
  color: #1d9c9c;
  margin-top: 28px;
  display: inline-block;
  font-size: 12px;
  border-radius: 8px;
  min-width: 18px;
  text-align: center;
}

.cl0 .pot-val {
  background-color: greenyellow;
  color: greenyellow !important;
}


.temp-hub .cl0 {
  background-color: #e6a23c;
  color: #e6a23c !important;
}

.temp-hub .cl0 .pot-val{
  background-color: #e6a23c;
  color: #e6a23c !important;
}

/* 分数显示区域 */
.panel {
  font-weight: 300;
  font-size: 16px;
  font-family: "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  text-decoration: none;
  text-align: center;
  vertical-align: middle;
  padding: 0 2px;
  margin: 10px 1px 0;
}

#scorePanel {
  margin-bottom: 10px;
}

/* 暂存区 */
.temp-hub {
  text-align: left;
  font-weight: bold;
  padding: 5px 10px;
  background-color: white;
}

.temp-hub > p {
  margin-bottom: 0;
}
</style>