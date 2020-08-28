<template>
  <div id="hello-id">
    <div id="left-id">111</div>
    <div id="resize1" class="resize-div" />
    <div id="middle-id">333333</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    dragControllerDiv: function() {
      const box = document.getElementById("hello-id");
      const left = document.getElementById("left-id");
      const resize1 = document.getElementById("resize1");
      const middle = document.getElementById("middle-id");
      // 左边拖拽区域添加mousedown事件
      resize1.onmousedown = function(e) {
        const initWindowWidth = box.clientWidth;
        const initLeftWidth = left.clientWidth;
        const initResize1Width = resize1.clientWidth;
        const initMiddleWidth = middle.clientWidth;
        const mouseStartDistanceToWindowLeft = e.clientX;
        // 左边拖拽区域添加mousemove事件，并不断计算各区域宽度
        document.onmousemove = function(e) {
          const mouseFinalDistanceToWindowLeft = e.clientX;
          // 获取鼠标移动的距离
          const mouseMovedDistance =
            mouseFinalDistanceToWindowLeft - mouseStartDistanceToWindowLeft;
          // 各种计算距离和宽度
          resize1.style.left = initLeftWidth + mouseMovedDistance;
          left.style.width = initLeftWidth + mouseMovedDistance + "px";
          middle.style.left =
            initMiddleWidth + mouseMovedDistance + initResize1Width + "px";
          middle.style.width =
            initWindowWidth -
            initLeftWidth -
            initResize1Width -
            mouseMovedDistance +
            "px";
        };
        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
          resize1.releaseCapture && resize1.releaseCapture();
        };
        resize1.setCapture && resize1.setCapture();
        return false;
      };
    }
  }
};
</script>

<style>
#hello-id {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
}

.resize-div {
  position: relative;
  width: 5px;
  height: 100%;
  cursor: w-resize;
  float: left;
  background-color: #eeeeee;
}

#left-id {
  height: 100%;
  width: 20%;
}

#middle-id {
  height: 100%;
  width: 25%;
}

#right-id {
  height: 100%;
  width: 55%;
}
</style>
