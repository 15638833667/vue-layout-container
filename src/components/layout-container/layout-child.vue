<template>
  <div
    class="ms-layout-container ms-layout-container-child"
    id="child-grid-container"
    v-drop="dragendChild"
    @dragover="dragoverChild"
  >
    <grid-layout
      :ref="currRef"
      class="ms-grid-layout-child"
      :layout.sync="childLayout"
      :col-num="12"
      :row-height="10"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
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
        <el-button size="mini">{{ index }}</el-button>
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
</template>
<script>
import VueGridLayout from "vue-grid-layout";

export default {
  name: "LayoutChild",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  props: {
    layout: {
      type: Array,
      default: () => [],
    },
    time: {
      type: [String, Number],
      default: 0,
    },
    hoverParentStatus: {
      type: Boolean,
      default: true,
    },
    currRef: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      mouseXY: { x: null, y: null },
      DragPos: { x: null, y: null, w: 1, h: 1, i: null },
      currentNodeInfo: {},
      childLayout: [],
      containerRect: null,
    };
  },
  watch: {
    layout: {
      immediate: true,
      // deep: true,
      handler(val) {
        console.log(val);
        this.childLayout = val;
      },
    },
    hoverParentStatus: {
      immediate: true,
      // deep: true,
      handler(val) {
        if (val) {
          console.log("hoverParentStatus", val);
          this.currentNodeInfo = {};
        }
      },
    },
  },
  mounted() {
    console.log(this.$refs.gridlayoutChild);
    setTimeout(() => {
      this.containerRect =
        this.$refs[this.currRef].$el?.getBoundingClientRect();
      console.log("this.containerRect.left", this.containerRect.left);
      console.log("this.containerRect.right", this.containerRect.right);
      console.log("this.containerRect.top", this.containerRect.top);
      console.log("this.containerRect.bottom", this.containerRect.bottom);
      console.log("---------------------------------------------------");
    }, 1000);
  },
  methods: {
    layoutUpdatedEvent() {
      // console.log(JSON.stringify(this.layout));
    },
    dragoverChild(e) {
      e.stopPropagation();
      // console.log(e);
      // 以被拖拽元素左上角定点位置为基准，计算当前组件应该放置的位置
      this.mouseXY.x = e.clientX;
      this.mouseXY.y = e.clientY;

      let el = this.$refs[this.currRef]?.$children.at(-1);
      // console.log(el);
      el.dragging = {
        top: this.mouseXY.y - this.containerRect.top,
        left: this.mouseXY.x - this.containerRect.left,
      };
      let new_pos = el.calcXY(
        this.mouseXY.y - this.containerRect.top,
        this.mouseXY.x - this.containerRect.left
      );
      this.currentNodeInfo = {
        x: new_pos.x,
        y: new_pos.y, // puts it at the bottom
        w: 2,
        h: 2,
        i: "drop" + this.time,
      };
    },
    dragendChild(e) {
      e.stopPropagation();
      // 拖拽结束，根据当前位置，防止对应元素
      let mouseInGrid = false;
      if (
        this.mouseXY.x > this.containerRect.left &&
        this.mouseXY.x < this.containerRect.right &&
        this.mouseXY.y > this.containerRect.top &&
        this.mouseXY.y < this.containerRect.bottom
      ) {
        mouseInGrid = true;
      }
      console.log("this.mouseXY.x", this.mouseXY.x);
      console.log("this.mouseXY.x", this.mouseXY.y);
      console.log(mouseInGrid);
      console.log(this.currentNodeInfo);
      if (
        mouseInGrid === true &&
        this.childLayout.findIndex((item) => item.i === "drop" + this.time) ===
          -1 &&
        Object.keys(this.currentNodeInfo).length
      ) {
        this.childLayout.push(this.currentNodeInfo);
        this.currentNodeInfo = {};
      }
      console.log(JSON.stringify(this.childLayout))
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-layout-container.ms-layout-container-child {
  height: 100%;
  width: 100%;
  ::v-deep .ms-grid-layout-child {
    height: 100% !important;
    .vue-grid-item {
      background: #009588;
    }
    // .grid-item-placeholder {
    //   background: #ff9588;
    // }
  }
  .columns {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .layoutItem {
      margin-top: 10px;
      width: 120px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #009588;
    }
  }
}
</style>
