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
      <div
        class="ms-layout-container"
        @dragover="dragover"
        @dragleave="dragleave"
      >
        <!-- <div class="columns">
          <div class="layoutItem" v-for="item in layout">
            <b>{{ item.i }}</b
            >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div> -->
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
            <template v-if="item.i == 0">
              <LayoutChild
                id="content-child"
                ref="gridlayoutChildContainer"
                :layout="childLayout"
                v-drop="dragendChild"
                @dragover.native="dragoverChild"
                @dragleave="dragleaveChild"
              ></LayoutChild>
            </template>
            <template v-else>
              <el-button type="success" size="mini">{{ index }}</el-button>
            </template>
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
        { x: 0, y: 0, w: 6, h: 25, i: "0" },
        { x: 6, y: 0, w: 2, h: 4, i: "1" },
        { x: 8, y: 0, w: 2, h: 5, i: "2" },
        { x: 10, y: 0, w: 2, h: 3, i: "3" },
        { x: 12, y: 0, w: 2, h: 3, i: "4" },
        { x: 14, y: 0, w: 2, h: 3, i: "5" },
        { x: 16, y: 5, w: 2, h: 5, i: "6" },
        { x: 18, y: 5, w: 2, h: 5, i: "7" },
        { x: 20, y: 5, w: 2, h: 5, i: "8" },
        { x: 22, y: 3, w: 2, h: 4, i: "9" },
        { x: 6, y: 3, w: 2, h: 4, i: "10" },
        { x: 6, y: 4, w: 2, h: 4, i: "11" },
        { x: 6, y: 10, w: 2, h: 5, i: "12" },
        { x: 8, y: 10, w: 2, h: 5, i: "13" },
        { x: 10, y: 8, w: 2, h: 4, i: "14" },
        { x: 12, y: 8, w: 2, h: 4, i: "15" },
        { x: 14, y: 10, w: 2, h: 5, i: "16" },
        { x: 10, y: 6, w: 6, h: 2, i: "17" },
        { x: 16, y: 9, w: 4, h: 3, i: "18" },
        { x: 20, y: 6, w: 2, h: 2, i: "19" },
      ],
      childLayout: [
        { x: 0, y: 0, w: 12, h: 4, i: "0" },
        { x: 0, y: 5, w: 6, h: 4, i: "1" },
        { x: 6, y: 5, w: 6, h: 4, i: "2" },
        { x: 0, y: 9, w: 6, h: 4, i: "3" },
        { x: 6, y: 9, w: 6, h: 4, i: "4" },
        { x: 0, y: 13, w: 12, h: 4, i: "5" },
      ],
      dragItem: {},
      dragChildItem: {},
      // 时间戳
      time: 0,
      // 父级容器元素信息
      parentRect: {},
      childRect: {},
      // 鼠标偏移量
      cursorOffset: { x: 0, y: 0 },
    };
  },
  mounted() {},
  methods: {
    dragStart(e) {
      console.log(e);
      this.time = new Date().getTime();
      // 记录鼠标拖拽时，鼠标距离当前拖拽元素左上角顶点的距离
      this.cursorOffset = {
        x: e.offsetX,
        y: e.offsetY,
      };
      this.parentRect = document
        .getElementById("content")
        .getBoundingClientRect();
      this.childRect = document
        .getElementById("content-child")
        .getBoundingClientRect();
    },
    dragover(e) {
      e.stopPropagation();
      // console.log(e);
      this.mouseXY.x = e.clientX - this.cursorOffset.x;
      this.mouseXY.y = e.clientY - this.cursorOffset.y;
      let mouseInGrid = false;
      if (
        this.mouseXY.x > this.parentRect.left &&
        this.mouseXY.x < this.parentRect.right &&
        this.mouseXY.y > this.parentRect.top &&
        this.mouseXY.y < this.parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === "drop" + this.time) === -1
      ) {
        this.dragItem = {
          x: (this.layout.length * 2) % (this.colNum || 24),
          y: this.layout.length + (this.colNum || 24), // puts it at the bottom
          w: 2,
          h: 2,
          i: "drop" + this.time,
        };
        this.layout.push(this.dragItem);
      }
      if (!mouseInGrid) {
        this.throttle(() => {
          const index = this.layout.indexOf(this.dragItem);
          if (index > -1) {
            this.layout.splice(index, 1);
          }
        }, 200);
      }
      // console.log(this.layout)
      let index = this.layout.findIndex(
        (item) => item.i === "drop" + this.time
      );
      // console.log(index);
      if (index !== -1) {
        let el = this.$refs.gridlayout.$children[index];
        // console.log(this.$refs.gridlayout);
        el.dragging = {
          top: this.mouseXY.y - this.parentRect.top,
          left: this.mouseXY.x - this.parentRect.left,
        };
        let new_pos = el.calcXY(
          this.mouseXY.y - this.parentRect.top,
          this.mouseXY.x - this.parentRect.left
        );
        // console.log(new_pos);
        if (mouseInGrid === true) {
          this.$refs.gridlayout.dragEvent(
            "dragstart",
            "drop" + this.time,
            new_pos.x,
            new_pos.y,
            2,
            2
          );
          this.DragPos.i = String(index);
          this.DragPos.x = this.layout[index].x;
          this.DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayout.dragEvent(
            "dragend",
            "drop" + this.time,
            new_pos.x,
            new_pos.y,
            2,
            2
          );
          this.layout = this.layout.filter(
            (obj) => obj.i !== "drop" + this.time
          );
        }
      }
    },
    dragend(e) {
      console.log(e);
      let mouseInGrid = false;
      if (
        this.mouseXY.x > this.parentRect.left &&
        this.mouseXY.x < this.parentRect.right &&
        this.mouseXY.y > this.parentRect.top &&
        this.mouseXY.y < this.parentRect.bottom
      ) {
        mouseInGrid = true;
      }
      console.log(mouseInGrid);
      if (mouseInGrid === true) {
        this.$refs.gridlayout.dragEvent(
          "dragend",
          "drop" + this.time,
          this.DragPos.x,
          this.DragPos.y,
          2,
          2
        );
      }
    },
    dragleave(e) {
      e.stopPropagation();
      // console.log(e.target.classList)
      // if(e.target.classList && Array.from(e.target.classList).indexOf('ms-grid-layout-container') > -1) {
      //   const index = this.layout.indexOf(this.dragItem)
      //   if(index > -1){
      //     this.layout.splice(index, 1)
      //   }
      //   console.log(this.layout.indexOf(this.dragItem))
      // }
    },
    dragoverChild(e) {
      e.stopPropagation();
      // console.log(e);
      this.mouseXY.x = e.clientX - this.cursorOffset.x;
      this.mouseXY.y = e.clientY - this.cursorOffset.y;
      let mouseInGrid = false;
      if (
        this.mouseXY.x > this.childRect.left &&
        this.mouseXY.x < this.childRect.right &&
        this.mouseXY.y > this.childRect.top &&
        this.mouseXY.y < this.childRect.bottom
      ) {
        mouseInGrid = true;
      }
      if (
        mouseInGrid === true &&
        this.childLayout.findIndex((item) => item.i === "drop" + this.time) ===
          -1
      ) {
        this.dragChildItem = {
          x: (this.childLayout.length * 2) % (this.colNum || 24),
          y: this.childLayout.length + (this.colNum || 24), // puts it at the bottom
          w: 6,
          h: 2,
          i: "drop" + this.time,
        };
        this.childLayout.push(this.dragChildItem);
      }
      if (!mouseInGrid) {
        this.throttle(() => {
          const index = this.childLayout.indexOf(this.dragChildItem);
          if (index > -1) {
            this.childLayout.splice(index, 1);
          }
        }, 200);
      }
      // console.log(this.layout)
      let index = this.childLayout.findIndex(
        (item) => item.i === "drop" + this.time
      );
      // console.log(index);
      if (index !== -1) {
        let el =
          this.$refs.gridlayoutChildContainer[0].$refs.gridlayoutChild
            .$children[index];
        // console.log(this.$refs.gridlayout);
        el.dragging = {
          top: this.mouseXY.y - this.childRect.top,
          left: this.mouseXY.x - this.childRect.left,
        };
        let new_pos = el.calcXY(
          this.mouseXY.y - this.childRect.top,
          this.mouseXY.x - this.childRect.left
        );
        // console.log(new_pos);
        if (mouseInGrid === true) {
          this.$refs.gridlayoutChildContainer[0].$refs.gridlayoutChild.dragEvent(
            "dragstart",
            "drop" + this.time,
            new_pos.x,
            new_pos.y,
            6,
            2
          );
          this.DragPos.i = String(index);
          this.DragPos.x = this.layout[index].x;
          this.DragPos.y = this.layout[index].y;
        }
        if (mouseInGrid === false) {
          this.$refs.gridlayoutChildContainer[0].$refs.gridlayoutChild.dragEvent(
            "dragend",
            "drop" + this.time,
            new_pos.x,
            new_pos.y,
            6,
            2
          );
          this.childLayout = this.childLayout.filter(
            (obj) => obj.i !== "drop" + this.time
          );
        }
      }
    },
    dragendChild(e) {
      e.stopPropagation();
      console.log(e);
      let mouseInGrid = false;
      if (
        this.mouseXY.x > this.childRect.left &&
        this.mouseXY.x < this.childRect.right &&
        this.mouseXY.y > this.childRect.top &&
        this.mouseXY.y < this.childRect.bottom
      ) {
        mouseInGrid = true;
      }
      console.log(mouseInGrid);
      if (mouseInGrid === true) {
        this.$refs.gridlayoutChildContainer[0].$refs.gridlayoutChild.dragEvent(
          "dragend",
          "drop" + this.time,
          this.DragPos.x,
          this.DragPos.y,
          6,
          2
        );
      }
    },
    dragleaveChild(e) {
      // e.stopPropagation()
      // if(e.target.classList && Array.from(e.target.classList).indexOf('ms-grid-layout-child') > -1) {
      //   const index = this.childLayout.indexOf(this.dragChildItem)
      //   if(index > -1){
      //     this.childLayout.splice(index, 1)
      //   }
      //   console.log(this.childLayout.indexOf(this.dragChildItem))
      // }
    },
    layoutUpdatedEvent(layout) {
      // console.log(JSON.stringify(layout));
    },
    throttle(fn, delay) {
      let timer = null;
      return function () {
        let context = this;
        let args = arguments;
        if (!timer) {
          timer = setTimeout(function () {
            fn.apply(context, args);
            timer = null;
          }, delay);
        }
      };
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
.ms-layout-container {
  height: 100%;
  width: 100%;
  ::v-deep .ms-grid-layout-container {
    height: 100%;
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
