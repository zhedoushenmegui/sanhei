<script>
export default {
  name: "GameList"
}
</script>


<template>
<div style="max-width: 400px; margin: 1rem auto">
  <div>
    <a href="colortube">
      <span class="icon" style="background-color: #de7525;">倒</span>
      color tube
    </a>
  </div>
  <div>
    <a href="/sanhe1">
      <span class="icon" style="background-color: #777777;">兔</span>
      兔子来了</a>
  </div>
  <div>
    <a href="/chengyu">
      <span class="icon" style="background-color: #aa0000;">文</span>
      成语</a>
  </div>
  <div>
    <a href="/flight">
      <span class="icon" style="background-color: #00ccff;">飞</span>
      flight</a>
  </div>
</div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: blueviolet;
}

a .icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 5px;

  color: white;
  font-weight: 500;
  text-align: center;
  line-height: 2.5rem;
}

#nav {
  font-size: x-large;
  margin: 20px auto 0;
  width: 100%;
  padding-left: 15px;
  background-color: white;
}

#nav > div {
  margin-top: 10px;
}
</style>