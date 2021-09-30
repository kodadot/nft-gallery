const onMove = (event: MouseEvent, el: HTMLElement) => {
  const mouseX = event.clientX
  const mouseY = event.clientY
  const halfWidth = window.innerWidth / 2
  const halfHeight = window.innerHeight / 2
  const xdeg = (mouseX - halfWidth) / halfWidth
  const ydeg = (mouseY - halfHeight) / halfHeight
  el.style.transform = `rotateX(${ydeg * 10}deg) rotateY(${xdeg * 10}deg)`
}

const onMoveMobile = (event: DeviceMotionEvent, el: HTMLElement) => {
  const accelerationX = event.accelerationIncludingGravity!.x
  const accelerationY = event.accelerationIncludingGravity!.y
  const xdeg = (accelerationX as number) / 10
  const ydeg = (accelerationY as number) / 10
  el.style.transform = `rotateX(${ydeg * 20}deg) rotateY(${xdeg * 20}deg)`
}

const registerEvents = (el: any) => {
  el.addEventListener('mousemove', el.onMove)
  el.addEventListener('mouseleave', el.onLeave)
  window.addEventListener('devicemotion', el.onMoveMobile)
}

const unRegisterEvents = (el: any) => {
  el.removeEventListener('mousemove', el.onMove)
  el.removeEventListener('mouseleave', el.onLeave)
  window.removeEventListener('devicemotion', el.onMoveMobile)
  el.parentElement!.classList.remove('orientation')
}

export default {
  bind: (el: any, binding: any) => {
    el.onMove = (event: MouseEvent) => {
      onMove(event, el)
    }

    el.onMoveMobile = (event: DeviceMotionEvent) => {
      onMoveMobile(event, el)
    }

    el.onLeave = () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
    if (binding.value) {
      registerEvents(el)
    }
  },
  update: (el: HTMLElement, binding: any) => {
    el.parentElement!.classList.add('orientation')
    if (!binding.value) {
      unRegisterEvents(el)
    } else {
      registerEvents(el)
    }
  },
  unbind: (el: HTMLElement) => {
    unRegisterEvents(el)
  }
}
