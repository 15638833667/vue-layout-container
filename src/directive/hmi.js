/**
 * HMI 用到的相关指令
 * v-drag 拖拽指令，使元素可以被拖拽，用于被拖拽元素
 * v-drop 放置指令，使被拖拽元素可以放置，用于放置拖拽元素区域或容器组件
 * v-resize 自定义组件宽高指令，绑定指令后，组件或组件可以拖拽自定义宽高，参数为当前容器可拖拽的最大宽度
 */
// 绑定拖拽事件
function bindDragEvent(el, binding) {
  // 获取拖拽元素指令绑定传递的参数
  const dragCallBack = binding.value
  // 获取拖拽元素指令绑定传递的参数
  el.draggable = true
  // 设置拖拽元素的 dragstart 事件
  el.ondragover = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  el.ondragstart = (e) => {
    e.stopPropagation()
    dragCallBack && dragCallBack(e)
  }
}
// 到处拖拽指令
export const drag = {
  inserted(el, binding) {
    bindDragEvent(el, binding)
  },
  update(el, binding) {
    bindDragEvent(el, binding)
  }
}

// 绑定拖拽放置区域事件
function bindDropEvent(el, binding) {
  // console.log(el)
  // 获取指令传递的参数
  let dropCallBack = binding.value
  // 设置拖拽元素的 dragstart 事件
  el.ondragover = (e) => {
    // 调用preventDefault()来阻止对这个事件的其它处理过程（如触点事件或指针事件）
    e.preventDefault()
  }
  // 拖拽元素结束
  el.ondrop = (e) => {
    e.preventDefault()
    // 执行拖拽结束的回调函数
    dropCallBack && dropCallBack(e)
  }
}
// 到处拖拽放置指令
export const drop = {
  inserted(el, binding) {
    bindDropEvent(el, binding)
  },
  update(el, binding) {
    bindDropEvent(el, binding)
  }
}

// 绑定拖拽放置区域事件
function bindResizeEvent(el, binding) {
  // console.log(el)
  const containerResize = binding.value
  const resizeBtn = createResizeBtn()
  // 如果存在按钮，就不添加
  // console.log(el.children)
  let needResize = false
  el?.children?.forEach(child => {
    // console.log(child.classList)
    // console.log(Array.from(child.classList))
    if (Array.from(child.classList) && Array.from(child.classList).indexOf('el-icon-sort')) {
      needResize = true
    }
  })
  // console.log(needResize)
  // console.log(!el.querySelectorAll('i.el-icon-sort').length)
  if (!el.querySelectorAll('i.el-icon-sort').length || needResize) {
    el.append(resizeBtn)
  }
  el.style.position = 'relative'
  // 获取指令传递的参数
  resizeBtn.onmousedown = (e) => {
    e.preventDefault()
    // 执行点击，是为了获取当前组件的状态
    el.click()
    // 鼠标移动改变容器大小
    const container = el
    // 得到点击时该容器的宽高
    const containerHeight = container.offsetHeight
    // const containerWidth = container.offsetWidth
    // 记录鼠标刚开始的位置
    // let startX = e.clientX
    let startY = e.clientY
    // 执行鼠标移动事件
    document.onmousemove = (e) => {
      e.preventDefault()
      // 获取鼠标移动的宽高距离
      // let distanceX = e.clientX - startX
      let distanceY = e.clientY - startY
      if (distanceY) {
        // 左右移动，修改高度，最大宽度为100%
        // const elWidth = containerWidth + distanceX
        // container.style.width = containerMaxWidth ? Math.min(containerMaxWidth, elWidth) + 'px' : elWidth + 'px'
        // 上下移动，修改高度
        const roundHeight = Math.round((containerHeight + distanceY) / 10) * 10
        container.style.height = roundHeight + 'px'
        container.style.transition = 'all 0.1s'
        containerResize(container.style.height)
      }
    }
    document.onmouseup = function(e) {
      document.onmousemove = null
    }
  }
}

function createResizeBtn() {
  // 创建容器拖拽按钮
  const resizeBtnStyle = {
    'position': 'absolute',
    'bottom': '2px',
    'right': '2px',
    'font-size': '14px',
    'color': '#D2D5E8',
    // 'rotate': '-45deg',
    'cursor': 'n-resize'
  }
  const resizeBtn = document.createElement('i')
  Object.keys(resizeBtnStyle).forEach(styleKey => {
    resizeBtn.style[styleKey] = resizeBtnStyle[styleKey]
  })
  resizeBtn.classList.add('el-icon-sort')
  return resizeBtn
}

// 到处拖拽放置指令
export const resize = {
  inserted(el, binding) {
    bindResizeEvent(el, binding)
  },
  update(el, binding) {
    bindResizeEvent(el, binding)
  }
}
