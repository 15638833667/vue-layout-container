<template>
  <div class="ms-layout-container ms-layout-container-child">
    <!-- <div class="columns">
      <div class="layoutItem" v-for="item in layout">
        <b>{{ item.i }}</b
        >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
      </div>
    </div> -->
    <grid-layout
      id="content"
      ref="gridlayoutChild"
      class="ms-grid-layout-child"
      :layout.sync="layout"
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
      default: () => []
    }
  },
  data() {
    return {
      mouseXY: { x: null, y: null },
      DragPos: { x: null, y: null, w: 1, h: 1, i: null },
      currentNode: [],
    };
  },
  mounted() {
  },
  methods: {
    layoutUpdatedEvent() {
      // console.log(JSON.stringify(this.layout));
    }
  },
};
</script>
<style lang="scss" scoped>
.ms-layout-container.ms-layout-container-child {
  height: 100%;
  width: 100%;
  ::v-deep .ms-grid-layout-child {
    height: 100%;
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
