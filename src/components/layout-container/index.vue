<template>
  <el-row :getter="20" class="container">
    <el-col :span="4" class="container-item">
      <ul class="component-list">
        <li v-for="item in 10" :key="item" v-drag="dragStart">
          {{ item }}
        </li>
      </ul>
    </el-col>
    <el-col :span="20" class="container-item">
      <div class="ms-layout-container">
        <grid-layout
          v-drop="dragend"
          id="content"
          ref="gridlayout"
          class="ms-grid-layout-container"
          :layout.sync="layout"
          :col-num="24"
          :row-height="10"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
          @layout-updated="layoutUpdatedEvent"
        >
          <grid-item
            v-for="(item, index) in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
          >
            <template v-if="item.children && item.children.length">
              <LayoutChild
                :currRef="'gridlayoutChild' + item.i"
                :layout="item.children"
                :time="time"
                :hoverParentStatus="hoverParentStatus"
                @dragover.native="childDragover"
              ></LayoutChild>
            </template>
            <template v-else>
              <el-button type="success" size="mini">{{ index }}</el-button>
            </template>
          </grid-item>
          <grid-item
            class="grid-item-placeholder"
            v-if="Object.keys(currentNodeInfo).length"
            :x="currentNodeInfo.x"
            :y="currentNodeInfo.y"
            :w="currentNodeInfo.w"
            :h="currentNodeInfo.h"
            :i="currentNodeInfo.i"
            :key="currentNodeInfo.i"
          >
          </grid-item>
        </grid-layout>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import VueGridLayout from "vue-grid-layout";
import LayoutChild from "./layout-child.vue";
export default {
  name: "LayoutContainer",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    LayoutChild,
  },
  data() {
    return {
      mouseXY: { x: null, y: null },
      DragPos: { x: null, y: null, w: 1, h: 1, i: null },
      layout: [
        {
          x: 0,
          y: 0,
          w: 6,
          h: 25,
          i: "0",
          children: [
            { x: 0, y: 0, w: 12, h: 4, i: "0" },
            { x: 0, y: 5, w: 6, h: 4, i: "1" },
            { x: 6, y: 5, w: 6, h: 4, i: "2" },
            { x: 0, y: 9, w: 7, h: 4, i: "3" },
            { x: 6, y: 9, w: 6, h: 4, i: "4" },
            { x: 0, y: 13, w: 12, h: 4, i: "5" },
          ],
        },
        { x: 6, y: 0, w: 2, h: 4, i: "1" },
        {
          x: 8,
          y: 0,
          w: 6,
          h: 20,
          i: "2",
          children: [
            { x: 0, y: 0, w: 12, h: 4, i: "0" },
            { x: 0, y: 9, w: 7, h: 4, i: "3" },
            { x: 6, y: 9, w: 6, h: 4, i: "4" },
            { x: 0, y: 13, w: 12, h: 4, i: "5" },
          ],
        },
      ],
      dragItem: {},
      dragChildItem: {},
      // 时间戳
      time: 0, // 当前组件的唯一属性
      // 当前拖拽元素信息
      currentNodeInfo: {},
      // placeholderArr
      placeholderArr: [],
      // 父级容器元素信息
      parentRect: {},
      // 是否在父元素上
      hoverParentStatus: true,
    };
  },
  mounted() {},
  methods: {
    dragStart(e) {
      console.log(e);
      this.time = new Date().getTime();
      this.parentRect = document
        .getElementById("content")
        ?.getBoundingClientRect();
    },
    dragend(e) {
      console.log(e);
      // 拖拽结束，根据当前位置，防止对应元素
      if (
        this.layout.findIndex((item) => item.i === "drop" + this.time) === -1
      ) {
        this.currentNodeInfo = {
          x: 0,
          y: 0, // puts it at the bottom
          w: 2,
          h: 2,
          i: "drop" + this.time,
        };
        this.layout.push(this.currentNodeInfo);
        this.currentNodeInfo = {};
      }
    },
    childDragover() {
      this.currentNodeInfo = {};
      this.hoverParentStatus = false;
    },
    layoutUpdatedEvent(layout) {
      // console.log(JSON.stringify(layout));
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.vue-grid-layout {
  .vue-grid-item {
    &.vue-grid-placeholder {
      display: none !important;
    }
  }
}
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
.container-item {
  height: 100%;
}
.ms-layout-container {
  height: 100%;
  width: 100%;
  ::v-deep .ms-grid-layout-container {
    height: 100% !important;
    .vue-grid-item {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #dddedf;
      overflow: auto;
    }
  }
  .columns {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .layoutItem {
      margin-top: 10px;
      width: 140px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #dddedf;
    }
  }
}
</style>
