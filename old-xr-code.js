
// Scale / Solo - Tabs
gsap.registerPlugin();

const buttons = document.querySelectorAll(".toggle_button");
const toggleWrap = document.querySelector(".toggle_wrap");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.classList.contains("scale") ? "scale" : "solo";

    const currentActiveButton = document.querySelector(".toggle_button.active");
    const currentActivePanel = document.querySelector(".toggle_bot.active");
    const currentTopRight = document.querySelector(".toggle_top_right.active");

    const newButton = button;
    const newPanel = document.querySelector(`.toggle_bot.${type}`);
    const newTopRight = document.querySelector(`.toggle_top_right.${type}`);

    if (newPanel.classList.contains("active")) return;

    // ⚡️ Immediate toggle button update
    if (currentActiveButton) currentActiveButton.classList.remove("active");
    newButton.classList.add("active");

    // ⚡️ Immediate .toggle_wrap update
    if (toggleWrap) {
      toggleWrap.classList.remove("solo", "scale");
      toggleWrap.classList.add(type);
    }

    // Animation functions

    /** Animate Out Top Right */
    const animateOutTopRight = () => {
      return new Promise((resolve) => {
        if (!currentTopRight) return resolve();
        gsap.to(currentTopRight.children, {
          opacity: 0,
          y: 20,
          filter: "blur(6px)",
          duration: 0.25,
          stagger: 0.08,
          ease: "power2.out",
          onComplete: () => {
            currentTopRight.classList.remove("active");
            gsap.set(currentTopRight.children, { clearProps: "all" });
            resolve();
          },
        });
      });
    };

    /** Animate Out Panel */
    const animateOutPanel = () => {
      return new Promise((resolve) => {
        if (!currentActivePanel) return resolve();
        gsap.to(currentActivePanel, {
          y: 20,
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
          onComplete: () => {
            currentActivePanel.classList.remove("active");
            resolve();
          },
        });
      });
    };

    /** Animate In Panel */
    const animateInPanel = () => {
      return new Promise((resolve) => {
        newPanel.classList.add("active");
        gsap.fromTo(
          newPanel,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
            delay: 0.05,
            onComplete: resolve,
          }
        );
      });
    };

    /** Animate In Top Right */
    const animateInTopRight = () => {
      if (!newTopRight) return;
      newTopRight.classList.add("active");
      gsap.fromTo(
        newTopRight.children,
        { opacity: 0, y: 20, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.3,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.05,
          onComplete: () => {
            gsap.set(newTopRight.children, { clearProps: "all" });
          },
        }
      );
    };

    // ⏱ Let toggle change apply first, then animate the rest
    setTimeout(() => {
      animateOutTopRight()
        .then(() => animateOutPanel())
        .then(() => animateInPanel())
        .then(() => animateInTopRight());
    }, 50); // Slight pause to let toggle visual feedback appear
  });
});


gsap.registerPlugin(CustomEase, ScrollTrigger, Draggable, InertiaPlugin)

CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1")

function initSliders() {
  const sliderWrappers = gsap.utils.toArray(document.querySelectorAll('[data-centered-slider="wrapper"]'));

  sliderWrappers.forEach((sliderWrapper) => {
    const slides = gsap.utils.toArray(sliderWrapper.querySelectorAll('[data-centered-slider="slide"]'));
    const bullets = gsap.utils.toArray(sliderWrapper.querySelectorAll('[data-centered-slider="bullet"]'));
    const prevButton = sliderWrapper.querySelector('[data-centered-slider="prev-button"]');
    const nextButton = sliderWrapper.querySelector('[data-centered-slider="next-button"]');

    let activeElement;
    let activeBullet;
    let currentIndex = 0;
    let autoplay;

    // Autoplay is now enabled/disabled via a boolean attribute.
    const autoplayEnabled = sliderWrapper.getAttribute('data-slider-autoplay') === 'true';
    
    // If enabled, get the autoplay duration (in seconds) from the separate attribute.
    const autoplayDuration = autoplayEnabled ? parseFloat(sliderWrapper.getAttribute('data-slider-autoplay-duration')) || 0 : 0;

    // Dynamically assign unique IDs to slides
    slides.forEach((slide, i) => {
      slide.setAttribute("id", `slide-${i}`);
    });
    
    // Set ARIA attributes on bullets if they exist
    if (bullets && bullets.length > 0) {
      bullets.forEach((bullet, i) => {
        bullet.setAttribute("aria-controls", `slide-${i}`);
        bullet.setAttribute("aria-selected", i === currentIndex ? "true" : "false");
      });
    }

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: true,
      center: true,
      onChange: (element, index) => {
        currentIndex = index;
        
        if (activeElement) activeElement.classList.remove("active");
        element.classList.add("active");
        activeElement = element;

        if (bullets && bullets.length > 0) {
          if (activeBullet) activeBullet.classList.remove("active");
          if (bullets[index]) {
            bullets[index].classList.add("active");
            activeBullet = bullets[index];
          }
          bullets.forEach((bullet, i) => {
            bullet.setAttribute("aria-selected", i === index ? "true" : "false");
          });
        }
        
      }
    });
    
    // On initialization, center the slider
    loop.toIndex(2, { duration: 0.01 });

    function startAutoplay() {
      if (autoplayDuration > 0 && !autoplay) {
        const repeat = () => {
          loop.next({ ease: "osmo-ease", duration: 0.725 });
          autoplay = gsap.delayedCall(autoplayDuration, repeat);
        };
        autoplay = gsap.delayedCall(autoplayDuration, repeat);
      }
    }

    function stopAutoplay() {
      if (autoplay) {
        autoplay.kill();
        autoplay = null;
      }
    }

    // Start/stop autoplay based on viewport visibility via ScrollTrigger
    ScrollTrigger.create({
      trigger: sliderWrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: startAutoplay,
      onLeave: stopAutoplay,
      onEnterBack: startAutoplay,
      onLeaveBack: stopAutoplay
    });

    // Pause autoplay on mouse hover over the slider
    sliderWrapper.addEventListener("mouseenter", stopAutoplay);
    sliderWrapper.addEventListener("mouseleave", () => {
      if (ScrollTrigger.isInViewport(sliderWrapper)) startAutoplay();
    });

    // Slide click event for direct navigation
    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => {
        loop.toIndex(i, { ease: "osmo-ease", duration: 0.725 });
      });
    });

    // Bullets click event for direct navigation (if available)
    if (bullets && bullets.length > 0) {
      bullets.forEach((bullet, i) => {
        bullet.addEventListener("click", () => {
          loop.toIndex(i, { ease: "osmo-ease", duration: 0.725 });
          if (activeBullet) activeBullet.classList.remove("active");
          bullet.classList.add("active");
          activeBullet = bullet;
          bullets.forEach((b, j) => {
            b.setAttribute("aria-selected", j === i ? "true" : "false");
          });
        });
      });
    }

    // Prev/Next button listeners (if the buttons exist)
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        loop.toIndex(newIndex, { ease: "osmo-ease", duration: 0.725 });
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= slides.length) newIndex = 0;
        loop.toIndex(newIndex, { ease: "osmo-ease", duration: 0.725 });
      });
    }
    
  });
}

document.addEventListener("DOMContentLoaded", () =>{
  initSliders()
})

// GSAP Helper function to create a looping slider
// Read more: https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop
function horizontalLoop(items, config) {
  let timeline;
  items = gsap.utils.toArray(items);
  config = config || {};
  gsap.context(() => { 
    let onChange = config.onChange,
      lastIndex = 0,
      tl = gsap.timeline({repeat: config.repeat, onUpdate: onChange && function() {
          let i = tl.closestIndex();
          if (lastIndex !== i) {
            lastIndex = i;
            onChange(items[i], i);
          }
        }, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
      length = items.length,
      startX = items[0].offsetLeft,
      times = [],
      widths = [],
      spaceBefore = [],
      xPercents = [],
      curIndex = 0,
      indexIsDirty = false,
      center = config.center,
      pixelsPerSecond = (config.speed || 1) * 100,
      snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
      timeOffset = 0,
      container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
      totalWidth,
      getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + spaceBefore[0] + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
      populateWidths = () => {
        let b1 = container.getBoundingClientRect(), b2;
        items.forEach((el, i) => {
          widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
          xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
          b2 = el.getBoundingClientRect();
          spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
          b1 = b2;
        });
        gsap.set(items, {
          xPercent: i => xPercents[i]
        });
        totalWidth = getTotalWidth();
      },
      timeWrap,
      populateOffsets = () => {
        timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalWidth : 0;
        center && times.forEach((t, i) => {
          times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * widths[i] / 2 / totalWidth - timeOffset);
        });
      },
      getClosest = (values, value, wrap) => {
        let i = values.length,
          closest = 1e10,
          index = 0, d;
        while (i--) {
          d = Math.abs(values[i] - value);
          if (d > wrap / 2) {
            d = wrap - d;
          }
          if (d < closest) {
            closest = d;
            index = i;
          }
        }
        return index;
      },
      populateTimeline = () => {
        let i, item, curX, distanceToStart, distanceToLoop;
        tl.clear();
        for (i = 0; i < length; i++) {
          item = items[i];
          curX = xPercents[i] / 100 * widths[i];
          distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
          distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
          tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
            .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
            .add("label" + i, distanceToStart / pixelsPerSecond);
          times[i] = distanceToStart / pixelsPerSecond;
        }
        timeWrap = gsap.utils.wrap(0, tl.duration());
      },
      refresh = (deep) => {
        let progress = tl.progress();
        tl.progress(0, true);
        populateWidths();
        deep && populateTimeline();
        populateOffsets();
        deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
      },
      onResize = () => refresh(true),
      proxy;
    gsap.set(items, {x: 0});
    populateWidths();
    populateTimeline();
    populateOffsets();
    window.addEventListener("resize", onResize);
    function toIndex(index, vars) {
      vars = vars || {};
      (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
      let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
      if (time > tl.time() !== index > curIndex && index !== curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      if (time < 0 || time > tl.duration()) {
        vars.modifiers = {time: timeWrap};
      }
      curIndex = newIndex;
      vars.overwrite = true;
      gsap.killTweensOf(proxy);    
      return vars.duration === 0 ? tl.time(timeWrap(time)) : tl.tweenTo(time, vars);
    }
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.closestIndex = setCurrent => {
      let index = getClosest(times, tl.time(), tl.duration());
      if (setCurrent) {
        curIndex = index;
        indexIsDirty = false;
      }
      return index;
    };
    tl.current = () => indexIsDirty ? tl.closestIndex(true) : curIndex;
    tl.next = vars => toIndex(tl.current()+1, vars);
    tl.previous = vars => toIndex(tl.current()-1, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true); // pre-render for performance
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    if (config.draggable && typeof(Draggable) === "function") {
      proxy = document.createElement("div")
      let wrap = gsap.utils.wrap(0, 1),
        ratio, startProgress, draggable, dragSnap, lastSnap, initChangeX, wasPlaying,
        align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
        syncIndex = () => tl.closestIndex(true);
      typeof(InertiaPlugin) === "undefined" && console.warn("InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club");
      draggable = Draggable.create(proxy, {
        trigger: items[0].parentNode,
        type: "x",
        onPressInit() {
          let x = this.x;
          gsap.killTweensOf(tl);
          wasPlaying = !tl.paused();
          tl.pause();
          startProgress = tl.progress();
          refresh();
          ratio = 1 / totalWidth;
          initChangeX = (startProgress / -ratio) - x;
          gsap.set(proxy, {x: startProgress / -ratio});
        },
        onDrag: align,
        onThrowUpdate: align,
        overshootTolerance: 0,
        inertia: true,
        snap(value) {
          if (Math.abs(startProgress / -ratio - this.x) < 10) {
            return lastSnap + initChangeX
          }
          let time = -(value * ratio) * tl.duration(),
            wrappedTime = timeWrap(time),
            snapTime = times[getClosest(times, wrappedTime, tl.duration())],
            dif = snapTime - wrappedTime;
          Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
          lastSnap = (time + dif) / tl.duration() / -ratio;
          return lastSnap;
        },
        onRelease() {
          syncIndex();
          draggable.isThrowing && (indexIsDirty = true);
        },
        onThrowComplete: () => {
          syncIndex();
          wasPlaying && tl.play();
        }
      })[0];
      tl.draggable = draggable;
    }
    tl.closestIndex(true);
    lastIndex = curIndex;
    onChange && onChange(items[curIndex], curIndex);
    timeline = tl;
    return () => window.removeEventListener("resize", onResize); 
  });
  return timeline;
  
}


window.addEventListener("load", function () {
  const billingInput = document.getElementById("billing");
  const earningsInput = document.getElementById("income"); // keeping existing ID

  const earningsBar = document.querySelector(".u_comp_bar_income");
  const earningsBarXR = document.querySelector(".xr_comp_bar_income");

  const billingTextElements = document.querySelectorAll("[data-billing]");
  const differenceElement = document.querySelector(".difference-element");
  const fiveYearElement = document.querySelector(".five-year-element");
  const perDayElement = document.querySelector(".day-element");
  const underText = document.querySelector(".under-text");
  const overText = document.querySelector(".over-text");
  const compAdditional = document.querySelector(".comp-additional");

  let inputTimeout;

  billingInput.placeholder = "Annual Billings";
  earningsInput.placeholder = "Annual Earnings";

  gsap.set([earningsBar, earningsBarXR], {
    width: 0,
    opacity: 0,
  });
  gsap.set(compAdditional, { height: 0, overflow: "hidden" });
  gsap.set([underText, overText], { opacity: 0, display: "none" });

  function updateCurrentBar(billing, earnings) {
    const earningsPercent = Math.max((earnings / billing) * 100, 0);
    const earningsBarWidth = `${earningsPercent}%`;

    billingTextElements.forEach((el) => {
      el.innerText = billing > 0 ? `${billing.toLocaleString()} Billings` : "";
    });

    return gsap.to(earningsBar, {
      width: earningsBarWidth,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      onStart: () => {
        earningsBar.innerText = `${Math.round(
          earnings
        ).toLocaleString()} Earnings`;

        requestAnimationFrame(() => {
          const textWidth = earningsBar.scrollWidth;
          const containerWidth = earningsBar.parentElement.offsetWidth;
          const percentageWidth = (textWidth / containerWidth) * 100;

          if (earningsPercent < percentageWidth) {
            earningsBar.style.width = "auto";
            earningsBar.style.minWidth = `${textWidth}px`;
          } else {
            earningsBar.style.minWidth = "0";
          }
        });
      },
    });
  }

  function updateXRecruiterBar(billing) {
    const xrEarnings = billing * 0.81;

    return gsap.to(earningsBarXR, {
      width: "81%",
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      onStart: () => {
        earningsBarXR.innerText = `${Math.round(
          xrEarnings
        ).toLocaleString()} Earnings`;
      },
    });
  }

  function fadeOutText(callback) {
    gsap.to([underText, overText], {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        underText.style.display = "none";
        overText.style.display = "none";
        if (callback) callback();
      },
    });
  }

  function animateTextBlock(showUnderText) {
    const target = showUnderText ? underText : overText;
    const other = showUnderText ? overText : underText;

    gsap.set(target, { display: "block" });
    gsap.set(other, { display: "none" });

    gsap.set(compAdditional, { height: "auto" });
    const endHeight = compAdditional.offsetHeight;
    gsap.set(compAdditional, { height: 0 });

    gsap.to(compAdditional, {
      height: endHeight,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(target, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  }

  function updateAll() {
    const billingVal =
      parseFloat(billingInput.value.replace(/[^0-9.]/g, "")) || 0;
    const earningsVal =
      parseFloat(earningsInput.value.replace(/[^0-9.]/g, "")) || 0;

    billingInput.value =
      billingVal > 0 ? `$${billingVal.toLocaleString()}` : "";
    earningsInput.value =
      earningsVal > 0 ? `$${earningsVal.toLocaleString()}` : "";

    const hasInputs = billingVal > 0 && earningsVal > 0;

    if (!hasInputs) {
      gsap.set([earningsBar, earningsBarXR], {
        width: 0,
        opacity: 0,
      });
      gsap.set(compAdditional, { height: 0 });
      fadeOutText();
      return;
    }

    fadeOutText(() => {
      const currentTimeline = updateCurrentBar(billingVal, earningsVal);
      const xrEarnings = billingVal * 0.81;
      const xrTimeline = updateXRecruiterBar(billingVal);

      const difference = xrEarnings - earningsVal;
      const overFiveYears = difference * 5;
      const perDayLoss = Math.round(difference / 365);

      if (differenceElement)
        differenceElement.textContent = `$${difference.toLocaleString()}`;
      if (fiveYearElement)
        fiveYearElement.textContent = `$${overFiveYears.toLocaleString()}`;
      if (perDayElement)
        perDayElement.textContent = `$${perDayLoss.toLocaleString()}`;

      currentTimeline.eventCallback("onComplete", () => {
        xrTimeline.eventCallback("onComplete", () => {
          animateTextBlock(difference >= 0);
        });
      });
    });
  }

  const debounceUpdate = () => {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(updateAll, 200);
  };

  billingInput.addEventListener("input", debounceUpdate);
  earningsInput.addEventListener("input", debounceUpdate);
});


const {
  Engine,
  World,
  Bodies,
  Events,
  Runner,
  Body,
  Sleeping,
  Mouse,
  MouseConstraint,
  Render,
} = Matter;

function initSimulationFor(containerElement) {
  const pillElements = containerElement.querySelectorAll(".pill");
  const containerRect = containerElement.getBoundingClientRect();

  const engine = Engine.create();
  const world = engine.world;
  engine.gravity.y = 1.2;

  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  const render = Render.create({
    element: containerElement,
    engine: engine,
    options: {
      width: containerWidth,
      height: containerHeight,
      wireframes: false,
      background: "transparent",
      showDebug: false,
      showAxes: false,
      showAngleIndicator: false,
      showVelocity: false,
    },
  });

  render.canvas.style.position = "absolute";
  render.canvas.style.top = "0";
  render.canvas.style.left = "0";
  render.canvas.style.pointerEvents = "auto"; // Canvas handles all interactions
  render.canvas.style.opacity = "0";
  containerElement.style.position = "relative"; // Ensure proper stacking context

  const wallOptions = { isStatic: true, render: { visible: false } };
  World.add(world, [
    Bodies.rectangle(
      containerWidth / 2,
      containerHeight + 150,
      containerWidth + 200,
      300,
      wallOptions
    ),
    Bodies.rectangle(
      -50,
      containerHeight / 2,
      100,
      containerHeight + 200,
      wallOptions
    ),
    Bodies.rectangle(
      containerWidth + 50,
      containerHeight / 2,
      100,
      containerHeight + 200,
      wallOptions
    ),
    Bodies.rectangle(
      containerWidth / 2,
      -50,
      containerWidth + 200,
      100,
      wallOptions
    ),
  ]);

  const bodies = [];

  pillElements.forEach((el, index) => {
    el.style.position = "absolute";
    el.style.transformOrigin = "center center";
    el.style.margin = "0";
    el.style.pointerEvents = "none"; // Disable DOM events on pills, let canvas handle
    el.style.cursor = "pointer"; // Visual cue for interaction
    el.style.zIndex = "10"; // Keep pills visible but not intercept events

    const bounds = el.getBoundingClientRect();
    const w = bounds.width;
    const h = bounds.height;

    // Determine initial position based on container
    let x, y;
    if (containerElement.textContent.includes("With xrecruiter")) {
      // Stack vertically for left side
      x = containerWidth / 2; // Center horizontally
      y = 50 + index * (h + 10); // Stack with 10px spacing
    } else {
      // Random positioning for right side
      x = containerWidth / 2 + (Math.random() - 0.5) * 100;
      y = 50; // Start near the top
    }

    const body = Bodies.rectangle(x, y, w, h, {
      restitution: 0.3,
      friction: 0.1,
      frictionAir: 0.02,
      chamfer: { radius: Math.min(w, h) / 2, max: 20 }, // Cap chamfer radius
      density: 0.001,
      render: { fillStyle: "transparent" },
    });

    el.style.left = `${x - w / 2}px`;
    el.style.top = `${y - h / 2}px`;
    el.style.transform = `rotate(0rad)`;

    body.el = el;
    bodies.push(body);
    World.add(world, body); // Add immediately
  });

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      damping: 0.1,
      render: { visible: false },
    },
    collisionFilter: { group: 0 },
  });
  World.add(world, mouseConstraint);
  render.mouse = mouse;

  // Debug mouse interaction
  Events.on(mouseConstraint, "mousedown", ({ mouse }) => {
    console.log("Mouse down at:", mouse.position);
    const bodiesUnderMouse = Matter.Query.point(bodies, mouse.position);
    bodiesUnderMouse.forEach((body) => {
      Body.setStatic(body, false); // Ensure body is dynamic
      Sleeping.set(body, false); // Wake up sleeping bodies
      body.isDragging = true; // Track dragging state
      console.log("Interacting with body:", body);
    });
  });

  Events.on(mouseConstraint, "mouseup", ({ mouse }) => {
    if (mouseConstraint.body) {
      const body = mouseConstraint.body;
      Body.setVelocity(body, {
        x: body.velocity.x * 0.5,
        y: body.velocity.y * 0.5,
      });
      body.isDragging = false; // Clear dragging state
      console.log("Mouse up, body released:", body);
    }
  });

  Events.on(engine, "afterUpdate", () => {
    bodies.forEach((body) => {
      if (!body.el) return;

      if (body.position.y > containerHeight + 100 || body.position.y < -100) {
        Body.setPosition(body, {
          x: containerWidth / 2 + (Math.random() - 0.5) * 100,
          y: 50, // Reset to a visible position
        });
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
      }

      const x = body.position.x - body.el.offsetWidth / 2;
      const y = body.position.y - body.el.offsetHeight / 2;
      body.el.style.left = `${x}px`;
      body.el.style.top = `${y}px`;
      body.el.style.transform = `rotate(${body.angle}rad)`;
    });
  });

  Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
      if (bodyA.el && bodyB.el) {
        Body.applyForce(bodyA, bodyA.position, {
          x: (bodyA.position.x - bodyB.position.x) * 0.001,
          y: (bodyA.position.y - bodyB.position.y) * 0.001,
        });
        Body.applyForce(bodyB, bodyB.position, {
          x: (bodyB.position.x - bodyA.position.x) * 0.001,
          y: (bodyB.position.y - bodyA.position.y) * 0.001,
        });
      }
    });
  });

  Engine.run(engine);
  Runner.run(Runner.create(), engine);
  Render.run(render);
}

function attemptInitSimulation() {
  if (window.innerWidth > 750) {
    document.querySelectorAll(".pill-container").forEach((containerElement) => {
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              initSimulationFor(containerElement);
              observer.disconnect(); // Disconnect after initializing this container
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(containerElement);
    });
  }
}

// Initial check
attemptInitSimulation();

// Watch for resize and re-init if crossing threshold
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth > 750) {
      attemptInitSimulation();
    }
  }, 250); // Debounce resize
});


gsap.registerPlugin(ScrollTrigger);

// 2. Button Hover Animation
function animateChars(chars, yPosition) {
  return gsap.to(chars, {
    y: yPosition,
    duration: 0.5,
    ease: "power3.out",
    stagger: {
      each: 0.01,
      from: "start",
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[data-gsap="btn.x2"]').forEach((button, index) => {
    const originalText = button.querySelector(".og-text");
    const linkText = button.querySelector(".link-text");
    const bg = button.querySelector(".button_bg");

    if (!originalText || !linkText || !bg) return;

    const splitOriginal = new SplitText(originalText, {
      type: "chars",
      charsClass: "chars",
    });
    const clonedText = originalText.cloneNode(true);
    clonedText.classList.add("clone-text");
    linkText.appendChild(clonedText);
    const splitClone = new SplitText(clonedText, {
      type: "chars",
      charsClass: "chars",
    });

    gsap.set(clonedText, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
    });
    gsap.set(splitClone.chars, { y: "100%" });
    gsap.set(bg, {
      scale: 1,
      transformOrigin: "center center",
      willChange: "transform",
    });

    button.addEventListener("mouseenter", () => {
      animateChars(splitOriginal.chars, "-100%");
      animateChars(splitClone.chars, "0%");
      gsap.to(bg, { scale: 0.95, duration: 0.5, ease: "power3.out" });
    });

    button.addEventListener("mouseleave", () => {
      animateChars(splitOriginal.chars, "0%");
      animateChars(splitClone.chars, "100%");
      gsap.to(bg, { scale: 1, duration: 0.5, ease: "power3.out" });
    });
  });
});

// 3. Process Icons Scroll + Float
function startFloat(el) {
  gsap.to(el, {
    x: () => gsap.utils.random(-50, 50),
    y: () => gsap.utils.random(-50, 50),
    duration: 2.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}

gsap.utils.toArray(".process-icon").forEach((icon) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: icon,
      start: "top 80%",
      toggleActions: "play none none none",
      once: true,
      onEnter: () => startFloat(icon),
    },
  });

  tl.fromTo(
    icon,
    { opacity: 0, filter: "blur(10px)" },
    {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.75,
      ease: "power3.out",
    }
  );
});

// 4. Background Scroll Movement
[".bg_img_row.left", ".bg_img_row.right"].forEach((selector) => {
  const isLeft = selector.includes("left");
  const startX = isLeft ? "90vw" : "-65vw";
  const endX = isLeft ? "-10vw" : "10vw";

  gsap.utils.toArray(selector).forEach((row) => {
    gsap.set(row, { x: startX });
    gsap.to(row, {
      x: endX,
      ease: "none",
      scrollTrigger: {
        trigger: row,
        start: "top bottom",
        end: "top top-=300%",
        scrub: true,
      },
    });
  });
});

// 4.1 Background Grid Parallax Effect
const bgGrid = document.querySelector(".bg_img_grid");
if (bgGrid) {
  gsap.to(bgGrid, {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: bgGrid,
      start: "top bottom",
      end: "top top-=350%",
      scrub: true,
    },
  });
}

// 6. Color Theme Scroll Trigger
document.addEventListener("colorThemesReady", () => {
  $(`[data-animate-theme-to]`).each(function () {
    const theme = $(this).attr("data-animate-theme-to");
    const brand = $(this).attr("data-animate-brand-to");

    ScrollTrigger.create({
      trigger: this,
      start: "top center",
      end: "bottom center",
      onToggle: ({ isActive }) => {
        if (isActive) gsap.to("body", colorThemes.getTheme(theme, brand));
      },
    });
  });
});

// 7. Scroll-triggered Text Animations (excluding h-txt/h-title)
window.addEventListener("load", () => {
  document.fonts.ready.then(runHTxtAnimations);
});

function runHTxtAnimations() {
  gsap.set(".split, .h-txt, .h-title", { opacity: 1 });
  gsap.set("[an-graphic]", { opacity: 0, y: 50 });

  [".split", "[an-title]", "[an-body]"].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      const type =
        selector === "[an-title]"
          ? "words"
          : selector === "[an-body]"
          ? "lines"
          : "words,lines";

      const split = new SplitText(el, {
        type,
        mask: type,
        charsClass: "char",
        wordsClass: "word",
        linesClass: "line",
      });

      const lines = type === "words" ? split.words : split.lines;
      const delayBase =
        0.6 + (type === "words" ? 0.05 : 0.08) * lines.length - 0.2;

      const anim = gsap.from(lines, {
        yPercent: 100,
        opacity: 0,
        duration: 0.6,
        stagger: type === "words" ? 0.05 : 0.08,
        ease: "power3.out",
        paused: true,
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        onEnter: () => {
          anim.play();
          const graphics =
            el.closest("section")?.querySelectorAll("[an-graphic]") || [];
          graphics.forEach((graphic, index) => {
            gsap.to(graphic, {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              delay: delayBase + index * 0.2,
            });
          });
        },
      });
    });
  });

  ScrollTrigger.refresh();
}