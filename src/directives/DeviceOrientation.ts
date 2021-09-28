const onMove = (event: MouseEvent, el: any) => {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  let halfWidth = window.innerWidth / 2;
  let halfHeight = window.innerHeight / 2;
  let xdeg = (mouseX - halfWidth) / halfWidth;
  let ydeg = (mouseY - halfHeight) / halfHeight;
  el.style.transform = `rotateX(${ydeg * 10}deg) rotateY(${xdeg * 10}deg)`;
};

const onMoveMobile = (event: any, el: any) => {
  const accelerationX = event.accelerationIncludingGravity!.x;
  const accelerationY = event.accelerationIncludingGravity!.y;
  let xdeg = (accelerationX as number) / 10;
  let ydeg = (accelerationY as number) / 10;
  el.style.transform = `rotateX(${ydeg * 20}deg) rotateY(${xdeg * 20}deg)`;
};

export default {
  bind: function(el: any) {
    el.onMove = function(event: MouseEvent) {
      onMove(event, el);
    };

    el.onMoveMobile = function(event: MouseEvent) {
      onMoveMobile(event, el);
    };

    el.addEventListener('mousemove', el.onMove);
    window.addEventListener('devicemotion', el.onMoveMobile);
  },
  update: function(el: HTMLElement) {
    el.parentElement!.classList.add('orientation');
  },
  unbind: function(el: any) {
    el.removeEventListener('click', el.onMove);
    window.removeEventListener('devicemotion', el.onMoveMobile);
    el.parentElement!.classList.remove('orientation');
  }
};
