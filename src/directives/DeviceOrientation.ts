const onMove = (event: MouseEvent, el: any) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;
  const xdeg = (mouseX - halfWidth) / halfWidth;
  const ydeg = (mouseY - halfHeight) / halfHeight;
  el.style.transform = `rotateX(${ydeg * 10}deg) rotateY(${xdeg * 10}deg)`;
};

const onMoveMobile = (event: any, el: any) => {
  const accelerationX = event.accelerationIncludingGravity!.x;
  const accelerationY = event.accelerationIncludingGravity!.y;
  const xdeg = (accelerationX as number) / 10;
  const ydeg = (accelerationY as number) / 10;
  el.style.transform = `rotateX(${ydeg * 20}deg) rotateY(${xdeg * 20}deg)`;
};

export default {
  bind: (el: any) => {
    el.onMove = (event: MouseEvent) => {
      onMove(event, el);
    };

    el.onMoveMobile = (event: MouseEvent) => {
      onMoveMobile(event, el);
    };

    el.addEventListener('mousemove', el.onMove);
    window.addEventListener('devicemotion', el.onMoveMobile);
  },
  update: (el: HTMLElement) => {
    el.parentElement!.classList.add('orientation');
  },
  unbind: (el: any) => {
    el.removeEventListener('click', el.onMove);
    window.removeEventListener('devicemotion', el.onMoveMobile);
    el.parentElement!.classList.remove('orientation');
  }
};
