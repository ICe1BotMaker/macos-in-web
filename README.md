# Macos in Web

The macos-in-web repository is a medium-sized project where you can experience macos on the website.

It will be updated steadily, not neglected.

## How can I experience it?

Anyone can easily access the site and experience macos just by entering this link.

https://macos.r-e.kr/

## How to make this?

I used `html5`, `css3`, and `javascript` on the spot without the planning stage, and used `node.js` for the backend.

The modules used in the backend are typically `fs`, `express`.

This operation did not use `canvas`.

I worked separately into a `taskbar`, a `main`, and a `dock`.

I made the design element by referring to macos a lot.

And for your information, there is a security risk to implement using `fs` module, so we will rework using `localStorage` or other services.

## It's easy for you to make it.

Of course, if you understand coding, you can make it.

I'll interpret some of the source code and show you.


Example of drag and drop:
```js
const window = document.querySelector(`#window-01`);
const container = document.querySelector(`.main`);

const active = false;
const currentX;
const currentY;
const initialX;
const initialY;
const xOffset = 0;
const yOffset = 0;

container.addEventListener(`mousedown`, dragStart, false);
container.addEventListener(`mouseup`, dragEnd, false);
container.addEventListener(`mousemove`, drag, false);

function dragStart(e) {
   initialX = e.clientX - xOffset;
   initialY = e.clientY - yOffset;

   if (e.target === window) {
      active = true;
   }
}

function dragEnd(e) {
   initialX = currentX;
   initialY = currentY;

   active = false;
}

function drag(e) {
   if (active) {

      e.preventDefault();

      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, window);
   }
}

function setTranslate(xPos, yPos, el) {
   el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}
```
I referred to the contents of this site.

https://inpa.tistory.com/entry/%EB%93%9C%EB%9E%98%EA%B7%B8-%EC%95%A4-%EB%93%9C%EB%A1%AD-Drag-Drop-%EA%B8%B0%EB%8A%A5

## Update

There are no updates yet.
