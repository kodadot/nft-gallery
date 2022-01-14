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
  el.style.removeProperty('transition')
}

const registerEvents = (el: any) => {
  window.addEventListener('mousemove', el.onMove)
  window.addEventListener('mouseleave', el.onLeave)
  window.addEventListener('devicemotion', el.onMoveMobile)
}

const unRegisterEvents = (el: any) => {
  window.removeEventListener('mousemove', el.onMove)
  window.removeEventListener('mouseleave', el.onLeave)
  window.removeEventListener('devicemotion', el.onMoveMobile)
  el.parentElement!.classList.remove('orientation')
  el.style.removeProperty('transform')
}

export default {
  bind: (el: any, binding: any): void  => {
    el.onMove = (event: MouseEvent) => {
      onMove(event, el)
    }

    el.onMoveMobile = (event: DeviceMotionEvent) => {
      onMoveMobile(event, el)
    }

    el.onLeave = () => {
      unRegisterEvents(el)
      // el.style.transition = 'transform 1s'
    }
    if (binding.value) {
      registerEvents(el)
    }
  },
  update: (el: HTMLElement, binding: any): void  => {
    el.parentElement!.classList.add('orientation')
    if (!binding.value) {
      unRegisterEvents(el)
    } else {
      registerEvents(el)
    }
  },
  unbind: (el: HTMLElement): void  => {
    unRegisterEvents(el)
  }
}
