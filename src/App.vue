<script setup>
import {RouterView} from 'vue-router'
import GameList from "@/views/GameList.vue";
</script>

<template>
  <div style="width: 100%; min-height: calc(100vh)">
    <RouterView/>
    <!-- 这里判断如果是根目录 就不引入game list -->
    <template v-if="$route.path !== '/sanhe1/'">
      <GameList/>
    </template>
  </div>

  <el-backtop :right="200" :bottom="150">
    <div
      style="
        height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      "
    >
      <el-icon>
        <CaretTop/>
      </el-icon>
    </div>
  </el-backtop>
</template>

<style scoped>

</style>

