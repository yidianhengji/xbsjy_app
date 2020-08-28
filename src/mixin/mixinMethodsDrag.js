export const mixinMethodsDrag = {
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    dragControllerDiv() {
      const box = document.querySelector(".box");
      const left = document.querySelector(".left");
      const resize1 = document.querySelector(".y-hander");
      const middle = document.querySelector(".right");
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
