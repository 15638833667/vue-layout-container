<template>
  <div id="app">
    <!-- <el-row :getter="20" class="container">
      <el-col :span="4" class="container-item">
        <ul class="component-list">
          <li v-for="item in 10" :key="item" v-drag="drag">
            {{ item }}
          </li>
        </ul>
      </el-col>
      <el-col :span="20" class="container-item"> -->
        <layout-container></layout-container>
      <!-- </el-col>
    </el-row> -->
    <!-- <Demo></Demo> -->
  </div>
</template>

<script>
import LayoutContainer from "./components/layout-container/index.vue";
import Demo from "./components/demo.vue";

export default {
  name: "App",
  components: {
    Demo,
    LayoutContainer,
  },
  data() {
    return {
      activeName: "test",
    };
  },
  methods: {
    drag(event) {
      // console.log('drag', event)
    },
    dragend(event) {
      console.log("dragend", event);
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  height: 100vh;
  .container {
    width: 100%;
    height: calc(100vh);
    .container-item {
      height: 100%;
      border-radius: 6px;
      border: 1px solid #ddd;
      .component-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        li {
          cursor: pointer;
          width: calc(50% - 15px);
          height: 30px;
          line-height: 30px;
          margin-right: 10px;
          margin-top: 10px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 5px;
          &:nth-child(2n) {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
