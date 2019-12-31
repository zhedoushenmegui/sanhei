# Sanhei
[![License](https://img.shields.io/badge/license-BSD-blue.svg)](LICENSE)
### 还是三合一呀(Another Threes Game)

传送门: http://www.rrc-big-data.bid/game/sanhei/index.html?fr=github

![game-screen-shot][2]
#### Rules
 - 把`下一个` 显示的数字放在地图没有数字的空地上, 或者暂存区临时存放
 - 三个及以上相邻的元素可以合成一个高级元素
 - 正数往上合, 负数往下合. 比如三个1 可以合成2 , 而三个-1 则合成-2
 - 地图上放满数字游戏结束, 尽量获得更高分数和更高的数字吧

#### History
之前玩过一款叫兔子来了的小游戏, 就是三个相邻的元素合成一个新元素.
很可惜, 这个游戏后来不运营了.<br>

我在学java 的时候写过一版java的兔子来了, 但是运行环境依赖java, 界面比较丑, 不是很满意.
后来, 试着写了一版html+js+css的, 移动端支持不好.
同时这两个在合成时, 都是通过遍历一个点周围固定的12个点, 来判断是否合成新元素.这个算法比较丑陋.

#### ThisTime
我在春节前, 试着重写了这个游戏. 与之前的区别主要在于:
 - 语言使用HTML5 Javascript, 跨平台且对移动端支持较好
 - 使用AngularJS, 让我彻底从界面同步数据的中解脱了
 - 算法使用双重循环, 判断一个周围有多少相同的点, 稍微高端一点点...
 - 同时没有使用图片, 仅使用数字, 降低理解游戏的成本
 - 支持更高维度
 - 使用了H5的新特性:
    - [Audio](http://www.runoob.com/html/html5-audio.html) 播放声音
    - [LocalStorage](http://www.runoob.com/html/html5-webstorage.html) 存储游戏数据
    - [Application Cache](http://www.runoob.com/html/html5-app-cache.html) 离线缓存, 只要访问过一次, 以后在没网的时候也能打开

#### Hint
iPhone/iPad 可以把网页用Safari 打开, 添加快捷方式到屏幕上, 就能像原生App一样使用.<br>
![save-to-screen][1]

#### Todo
待改进升级的点有:
 - 使用图片代替数字
 - 增加服务端交互, 记录最好成绩
 - 增加分享功能

我的邮箱是: chaoy9413@163.com
有问题和建议可以提给我. 反正也不一定有时间改.

以上.

[1]: http://149.129.100.246/sanhei_pic/save-to-screen.min.png
[2]: https://static.oschina.net/uploads/space/2017/0207/162352_IIgU_1035928.png