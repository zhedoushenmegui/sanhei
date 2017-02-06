# Sanhei
[![License](https://img.shields.io/badge/license-BSD-blue.svg)](LICENSE)
### 还是三合一呀(Another Threes Game)

在线试玩: [http://game.ofchao.bid](http://game.ofchao.bid)<br>
微信访问: [http://game.catech.top](http://game.catech.top)

#### History
之前玩过一款叫兔子来了的小游戏, 就是三个相邻的元素合成一个新元素.
很可惜, 这个游戏后来不运营了.

我在学java 的时候写过一版java的兔子来了, 但是运行环境依赖java, 界面比较丑, 不是很满意.
后来, 试着写了一版html+js+css的, 移动端支持不好.
同时这两个在合成时, 都是通过遍历一个点周围固定的12个点, 来判断是否合成新元素.这个算法比较丑陋.

#### ThisTime
我在春节前, 试着重写了这个游戏. 与之前的区别主要在于:<br>
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
iPhone/iPad 可以把网页用Safari 打开, 添加快捷方式到屏幕上, 就可以想App 一样使用.
![save-to-screen][1]

#### Todo
待改进升级的点有:
 - 使用图片代替数字
 - 增加服务端交互, 记录最好成绩
 - 增加分享功能

我的邮箱是:lemon@ofchao.bid
有问题和建议可以提给我. 反正也不一定有时间改.

以上.

[1]: https://raw.githubusercontent.com/zhedoushenmegui/sanhei/master/rm.pic/save-to-screen.min.jpg