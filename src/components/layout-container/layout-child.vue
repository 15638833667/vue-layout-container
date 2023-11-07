<template>
  <div
    class="ms-layout-container ms-layout-container-child"
    id="child-grid-container"
    v-drop="dragendChild"
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
      default: "",
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
  mounted() {},
  methods: {
    layoutUpdatedEvent() {
      // console.log(JSON.stringify(this.layout));
    },
    dragendChild(e) {
      e.stopPropagation();
      console.log(e);
      if (
        this.childLayout.findIndex((item) => item.i === "drop" + this.time) ===
        -1
      ) {
        this.currentNodeInfo = {
          x: 0,
          y: 0, // puts it at the bottom
          w: 2,
          h: 2,
          i: "drop" + this.time,
        };
        this.childLayout.push(this.currentNodeInfo);
        this.currentNodeInfo = {};
      }
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
