// XRECRUITER PAGE INIT (NO TRANSITIONS)
// -----------------------------------------

gsap.registerPlugin(CustomEase);

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", e => (reducedMotion = e.matches));
rmMQ.addListener?.(e => (reducedMotion = e.matches));

const has = (s) => !!document.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

CustomEase.create("osmo", "0.625, 0.05, 0, 1");
gsap.defaults({ ease: "osmo", duration: durationDefault });




// PAGE INIT
// -----------------------------------------

function initPage() {
  initLenis();

  if (has('.section.h-hero')) initEntranceAnimation();
  if (has('.toggle_button')) initToggleTabs();
  if (has('[data-gsap="btn.x2"]')) initButtonHover();
  if (has('.process-icon')) initProcessIcons();
  if (has('.bg_img_row')) initBackgroundScroll();
  if (has('[data-animate-theme-to]')) initColorThemeScroll();
  if (has('.split, [an-title], [an-body]')) initTextAnimations();
  if (has('[data-centered-slider="wrapper"]')) initSliders();
  if (has('.img-para')) initImageParallax();
  if (has('[data-magnetic-strength]')) initMagneticEffect();
  if (has('[data-form-validate]')) initBasicFormValidation();
  if (has('[data-filter-group]')) initFilterBasic();
  if (has('[data-3d-hover-target]')) init3dPerspectiveHover();
  if (has('[data-toc-wrap]')) initTableOfContents();
  if (has('#billing')) initCompCalculator();
  if (has('.pill-container')) initPillSimulation();
  if (has('.lottie-anim')) initLottieAnimations();
  if (has('[data-vimeo-player-init]')) initVimeoPlayer();
  if (has('[res-wrap]')) initResHover();
  initTabTitleBlur();
}

document.addEventListener("DOMContentLoaded", initPage);




// GENERIC + HELPERS
// -----------------------------------------

function initLenis() {
  if (!hasLenis) return;

  const lenis = new Lenis({
    lerp: 0.165,
    wheelMultiplier: 1.25,
  });

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}




// YOUR FUNCTIONS GO BELOW HERE
// -----------------------------------------
// TOGGLE TABS

function initToggleTabs() {
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

      if (currentActiveButton) currentActiveButton.classList.remove("active");
      newButton.classList.add("active");

      if (toggleWrap) {
        toggleWrap.classList.remove("solo", "scale");
        toggleWrap.classList.add(type);
      }

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

      setTimeout(() => {
        animateOutTopRight()
          .then(() => animateOutPanel())
          .then(() => animateInPanel())
          .then(() => animateInTopRight());
      }, 50);
    });
  });
}


// BUTTON HOVER

function initButtonHover() {
  document.querySelectorAll('[data-gsap="btn.x2"]').forEach((button) => {
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

    const animateChars = (chars, yPosition) => {
      return gsap.to(chars, {
        y: yPosition,
        duration: 0.5,
        ease: "power3.out",
        stagger: { each: 0.01, from: "start" },
      });
    };

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
}


// RES HOVER

function initResHover() {
  document.querySelectorAll("[res-wrap]").forEach((wrap) => {
    const img = wrap.querySelector("[res-img]");
    const line = wrap.querySelector("[res-line]");
    if (!img && !line) return;

    if (img) {
      gsap.set(img, { scale: 0, transformOrigin: "center center" });
    }
    if (line) {
      gsap.set(line, { width: "0%" });
    }

    wrap.addEventListener("mouseenter", () => {
      if (img) {
        gsap.to(img, { scale: 1, duration: 0.5, ease: "power3.out" });
      }
      if (line) {
        gsap.to(line, { width: "100%", duration: 0.5, ease: "power3.out" });
      }
    });

    wrap.addEventListener("mouseleave", () => {
      if (img) {
        gsap.to(img, { scale: 0, duration: 0.5, ease: "power3.in" });
      }
      if (line) {
        gsap.to(line, { width: "0%", duration: 0.5, ease: "power3.in" });
      }
    });
  });
}


// PROCESS ICONS

function initProcessIcons() {
  const startFloat = (el) => {
    gsap.to(el, {
      x: () => gsap.utils.random(-50, 50),
      y: () => gsap.utils.random(-50, 50),
      duration: 2.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  };

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
      { opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out" }
    );
  });
}


// BACKGROUND SCROLL

function initBackgroundScroll() {
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
}


// COLOR THEME SCROLL

function initColorThemeScroll() {
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
}


// TEXT ANIMATIONS

function initTextAnimations() {
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


// SLIDER

function initSliders() {
  CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");

  const sliderWrappers = gsap.utils.toArray(
    document.querySelectorAll('[data-centered-slider="wrapper"]')
  );

  sliderWrappers.forEach((sliderWrapper) => {
    const slides = gsap.utils.toArray(
      sliderWrapper.querySelectorAll('[data-centered-slider="slide"]')
    );
    const bullets = gsap.utils.toArray(
      sliderWrapper.querySelectorAll('[data-centered-slider="bullet"]')
    );
    const prevButton = sliderWrapper.querySelector(
      '[data-centered-slider="prev-button"]'
    );
    const nextButton = sliderWrapper.querySelector(
      '[data-centered-slider="next-button"]'
    );

    let activeElement, activeBullet, currentIndex = 0, autoplay;

    const autoplayEnabled =
      sliderWrapper.getAttribute("data-slider-autoplay") === "true";
    const autoplayDuration = autoplayEnabled
      ? parseFloat(sliderWrapper.getAttribute("data-slider-autoplay-duration")) || 0
      : 0;

    slides.forEach((slide, i) => slide.setAttribute("id", `slide-${i}`));

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
      },
    });

    loop.toIndex(2, { duration: 0.01 });

    const startAutoplay = () => {
      if (autoplayDuration > 0 && !autoplay) {
        const repeat = () => {
          loop.next({ ease: "osmo-ease", duration: 0.725 });
          autoplay = gsap.delayedCall(autoplayDuration, repeat);
        };
        autoplay = gsap.delayedCall(autoplayDuration, repeat);
      }
    };

    const stopAutoplay = () => {
      if (autoplay) {
        autoplay.kill();
        autoplay = null;
      }
    };

    ScrollTrigger.create({
      trigger: sliderWrapper,
      start: "top bottom",
      end: "bottom top",
      onEnter: startAutoplay,
      onLeave: stopAutoplay,
      onEnterBack: startAutoplay,
      onLeaveBack: stopAutoplay,
    });

    sliderWrapper.addEventListener("mouseenter", stopAutoplay);
    sliderWrapper.addEventListener("mouseleave", () => {
      if (ScrollTrigger.isInViewport(sliderWrapper)) startAutoplay();
    });

    slides.forEach((slide, i) => {
      slide.addEventListener("click", () => {
        loop.toIndex(i, { ease: "osmo-ease", duration: 0.725 });
      });
    });

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


// HORIZONTAL LOOP

function horizontalLoop(items, config) {
  let timeline;
  items = gsap.utils.toArray(items);
  config = config || {};
  gsap.context(() => {
    let onChange = config.onChange,
      lastIndex = 0,
      tl = gsap.timeline({
        repeat: config.repeat,
        onUpdate:
          onChange &&
          function () {
            let i = tl.closestIndex();
            if (lastIndex !== i) {
              lastIndex = i;
              onChange(items[i], i);
            }
          },
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () =>
          tl.totalTime(tl.rawTime() + tl.duration() * 100),
      }),
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
      snap =
        config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
      timeOffset = 0,
      container =
        center === true
          ? items[0].parentNode
          : gsap.utils.toArray(center)[0] || items[0].parentNode,
      totalWidth,
      getTotalWidth = () =>
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        spaceBefore[0] +
        items[length - 1].offsetWidth *
          gsap.getProperty(items[length - 1], "scaleX") +
        (parseFloat(config.paddingRight) || 0),
      populateWidths = () => {
        let b1 = container.getBoundingClientRect(), b2;
        items.forEach((el, i) => {
          widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
          xPercents[i] = snap(
            (parseFloat(gsap.getProperty(el, "x", "px")) / widths[i]) * 100 +
              gsap.getProperty(el, "xPercent")
          );
          b2 = el.getBoundingClientRect();
          spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
          b1 = b2;
        });
        gsap.set(items, { xPercent: (i) => xPercents[i] });
        totalWidth = getTotalWidth();
      },
      timeWrap,
      populateOffsets = () => {
        timeOffset = center
          ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth
          : 0;
        center &&
          times.forEach((t, i) => {
            times[i] = timeWrap(
              tl.labels["label" + i] +
                (tl.duration() * widths[i]) / 2 / totalWidth -
                timeOffset
            );
          });
      },
      getClosest = (values, value, wrap) => {
        let i = values.length,
          closest = 1e10,
          index = 0,
          d;
        while (i--) {
          d = Math.abs(values[i] - value);
          if (d > wrap / 2) d = wrap - d;
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
          curX = (xPercents[i] / 100) * widths[i];
          distanceToStart =
            item.offsetLeft + curX - startX + spaceBefore[0];
          distanceToLoop =
            distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
          tl.to(
            item,
            {
              xPercent: snap(
                ((curX - distanceToLoop) / widths[i]) * 100
              ),
              duration: distanceToLoop / pixelsPerSecond,
            },
            0
          )
            .fromTo(
              item,
              {
                xPercent: snap(
                  ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
                ),
              },
              {
                xPercent: xPercents[i],
                duration:
                  (curX - distanceToLoop + totalWidth - curX) /
                  pixelsPerSecond,
                immediateRender: false,
              },
              distanceToLoop / pixelsPerSecond
            )
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
        deep && tl.draggable
          ? tl.time(times[curIndex], true)
          : tl.progress(progress, true);
      },
      proxy;

    gsap.set(items, { x: 0 });
    populateWidths();
    populateTimeline();
    populateOffsets();
    window.addEventListener("resize", () => refresh(true));

    function toIndex(index, vars) {
      vars = vars || {};
      Math.abs(index - curIndex) > length / 2 &&
        (index += index > curIndex ? -length : length);
      let newIndex = gsap.utils.wrap(0, length, index),
        time = times[newIndex];
      if (
        time > tl.time() !== index > curIndex &&
        index !== curIndex
      ) {
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      if (time < 0 || time > tl.duration()) {
        vars.modifiers = { time: timeWrap };
      }
      curIndex = newIndex;
      vars.overwrite = true;
      gsap.killTweensOf(proxy);
      return vars.duration === 0
        ? tl.time(timeWrap(time))
        : tl.tweenTo(time, vars);
    }

    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.closestIndex = (setCurrent) => {
      let index = getClosest(times, tl.time(), tl.duration());
      if (setCurrent) {
        curIndex = index;
        indexIsDirty = false;
      }
      return index;
    };
    tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex);
    tl.next = (vars) => toIndex(tl.current() + 1, vars);
    tl.previous = (vars) => toIndex(tl.current() - 1, vars);
    tl.times = times;
    tl.progress(1, true).progress(0, true);

    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }

    if (config.draggable && typeof Draggable === "function") {
      proxy = document.createElement("div");
      let wrap = gsap.utils.wrap(0, 1),
        ratio,
        startProgress,
        draggable,
        lastSnap,
        initChangeX,
        wasPlaying,
        align = () =>
          tl.progress(
            wrap(startProgress + (draggable.startX - draggable.x) * ratio)
          ),
        syncIndex = () => tl.closestIndex(true);

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
          initChangeX = startProgress / -ratio - x;
          gsap.set(proxy, { x: startProgress / -ratio });
        },
        onDrag: align,
        onThrowUpdate: align,
        overshootTolerance: 0,
        inertia: true,
        snap(value) {
          if (Math.abs(startProgress / -ratio - this.x) < 10) {
            return lastSnap + initChangeX;
          }
          let time = -(value * ratio) * tl.duration(),
            wrappedTime = timeWrap(time),
            snapTime =
              times[getClosest(times, wrappedTime, tl.duration())],
            dif = snapTime - wrappedTime;
          Math.abs(dif) > tl.duration() / 2 &&
            (dif += dif < 0 ? tl.duration() : -tl.duration());
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
        },
      })[0];

      tl.draggable = draggable;
    }

    tl.closestIndex(true);
    lastIndex = curIndex;
    onChange && onChange(items[curIndex], curIndex);
    timeline = tl;
  });
  return timeline;
}


// IMAGE PARALLAX

function initImageParallax() {
  document.querySelectorAll(".img-para").forEach((element) => {
    const wrapper = element.parentElement;

    gsap.to(element, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.fromTo(
      element,
      { scale: 1.1, opacity: 0, filter: "blur(10px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}


// MAGNETIC EFFECT

function initMagneticEffect() {
  const magnets = document.querySelectorAll("[data-magnetic-strength]");
  if (window.innerWidth <= 991) return;

  const resetEl = (el, immediate) => {
    if (!el) return;
    gsap.killTweensOf(el);
    (immediate ? gsap.set : gsap.to)(el, {
      x: "0em",
      y: "0em",
      rotate: "0deg",
      clearProps: "all",
      ...(!immediate && { ease: "elastic.out(1, 0.3)", duration: 1.6 }),
    });
  };

  const resetOnEnter = (e) => {
    const m = e.currentTarget;
    resetEl(m, true);
    resetEl(m.querySelector("[data-magnetic-inner-target]"), true);
  };

  const moveMagnet = (e) => {
    const m = e.currentTarget,
      b = m.getBoundingClientRect(),
      strength = parseFloat(m.getAttribute("data-magnetic-strength")) || 25,
      inner = m.querySelector("[data-magnetic-inner-target]"),
      innerStrength =
        parseFloat(m.getAttribute("data-magnetic-strength-inner")) || strength,
      offsetX = ((e.clientX - b.left) / m.offsetWidth - 0.5) * (strength / 16),
      offsetY = ((e.clientY - b.top) / m.offsetHeight - 0.5) * (strength / 16);

    gsap.to(m, {
      x: offsetX + "em",
      y: offsetY + "em",
      rotate: "0.001deg",
      ease: "power4.out",
      duration: 1.6,
    });

    if (inner) {
      const innerOffsetX =
          ((e.clientX - b.left) / m.offsetWidth - 0.5) * (innerStrength / 16),
        innerOffsetY =
          ((e.clientY - b.top) / m.offsetHeight - 0.5) * (innerStrength / 16);
      gsap.to(inner, {
        x: innerOffsetX + "em",
        y: innerOffsetY + "em",
        rotate: "0.001deg",
        ease: "power4.out",
        duration: 2,
      });
    }
  };

  const resetMagnet = (e) => {
    const m = e.currentTarget,
      inner = m.querySelector("[data-magnetic-inner-target]");
    gsap.to(m, {
      x: "0em",
      y: "0em",
      ease: "elastic.out(1, 0.3)",
      duration: 1.6,
      clearProps: "all",
    });
    if (inner) {
      gsap.to(inner, {
        x: "0em",
        y: "0em",
        ease: "elastic.out(1, 0.3)",
        duration: 2,
        clearProps: "all",
      });
    }
  };

  magnets.forEach((m) => {
    m.addEventListener("mouseenter", resetOnEnter);
    m.addEventListener("mousemove", moveMagnet);
    m.addEventListener("mouseleave", resetMagnet);
  });
}


// TAB TITLE BLUR

function initTabTitleBlur() {
  const documentTitleStore = document.title;
  const documentTitleOnBlur = "Come back! We miss you - xrecruiter";

  window.addEventListener("focus", () => {
    document.title = documentTitleStore;
  });

  window.addEventListener("blur", () => {
    document.title = documentTitleOnBlur;
  });
}


// FORM VALIDATION

function initBasicFormValidation() {
  const forms = document.querySelectorAll("[data-form-validate]");

  forms.forEach((form) => {
    const fields = form.querySelectorAll(
      "[data-validate] input, [data-validate] textarea"
    );
    const submitButtonDiv = form.querySelector("[data-submit]");
    const submitInput = submitButtonDiv.querySelector('input[type="submit"]');
    const formLoadTime = new Date().getTime();

    const validateField = (field) => {
      const parent = field.closest("[data-validate]");
      const minLength = field.getAttribute("min");
      const maxLength = field.getAttribute("max");
      const type = field.getAttribute("type");
      let isValid = true;

      if (field.value.trim() !== "") {
        parent.classList.add("is--filled");
      } else {
        parent.classList.remove("is--filled");
      }

      if (minLength && field.value.length < minLength) isValid = false;
      if (maxLength && field.value.length > maxLength) isValid = false;
      if (type === "email" && !/\S+@\S+\.\S+/.test(field.value))
        isValid = false;

      if (isValid) {
        parent.classList.remove("is--error");
        parent.classList.add("is--success");
      } else {
        parent.classList.remove("is--success");
        parent.classList.add("is--error");
      }

      return isValid;
    };

    const startLiveValidation = (field) => {
      field.addEventListener("input", () => validateField(field));
    };

    const validateAndStartLiveValidationForAll = () => {
      let allValid = true;
      let firstInvalidField = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid && !firstInvalidField) firstInvalidField = field;
        if (!valid) allValid = false;
        startLiveValidation(field);
      });

      if (firstInvalidField) firstInvalidField.focus();
      return allValid;
    };

    const isSpam = () => {
      const timeDifference = (new Date().getTime() - formLoadTime) / 1000;
      return timeDifference < 5;
    };

    submitButtonDiv.addEventListener("click", () => {
      if (validateAndStartLiveValidationForAll()) {
        if (isSpam()) {
          alert("Form submitted too quickly. Please try again.");
          return;
        }
        submitInput.click();
      }
    });

    form.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault();
        if (validateAndStartLiveValidationForAll()) {
          if (isSpam()) {
            alert("Form submitted too quickly. Please try again.");
            return;
          }
          submitInput.click();
        }
      }
    });
  });
}


// FILTER

function initFilterBasic() {
  const groups = document.querySelectorAll("[data-filter-group]");

  groups.forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter-target]");
    const items = group.querySelectorAll("[data-filter-name]");
    const transitionDelay = 300;

    const updateStatus = (element, shouldBeActive) => {
      element.setAttribute(
        "data-filter-status",
        shouldBeActive ? "active" : "not-active"
      );
      element.setAttribute("aria-hidden", shouldBeActive ? "false" : "true");
    };

    const handleFilter = (target) => {
      items.forEach((item) => {
        const shouldBeActive =
          target === "all" ||
          item.getAttribute("data-filter-name") === target;
        const currentStatus = item.getAttribute("data-filter-status");

        if (currentStatus === "active") {
          item.setAttribute("data-filter-status", "transition-out");
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      buttons.forEach((button) => {
        const isActive = button.getAttribute("data-filter-target") === target;
        button.setAttribute(
          "data-filter-status",
          isActive ? "active" : "not-active"
        );
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-filter-target");
        if (button.getAttribute("data-filter-status") === "active") return;
        handleFilter(target);
      });
    });
  });
}


// 3D PERSPECTIVE HOVER

function init3dPerspectiveHover() {
  const canHover = window.matchMedia?.(
    "(hover: hover) and (pointer: fine)"
  ).matches;
  if (!canHover) return () => {};

  const nodeList = document.querySelectorAll("[data-3d-hover-target]");
  if (!nodeList.length) return () => {};

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return () => {};

  const DEFAULT_MAX_DEG = 20;
  const EASE = "power3.out";
  const DURATION = 0.5;

  const targets = Array.from(nodeList).map((el) => {
    const maxAttr = parseFloat(el.getAttribute("data-max-rotate"));
    const maxRotate = Number.isFinite(maxAttr) ? maxAttr : DEFAULT_MAX_DEG;

    return {
      el,
      maxRotate,
      rect: el.getBoundingClientRect(),
      proxy: { rx: 0, ry: 0 },
      setRotationX: gsap.quickSetter(el, "rotationX", "deg"),
      setRotationY: gsap.quickSetter(el, "rotationY", "deg"),
    };
  });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let isFrameScheduled = false;

  const measureAll = () => {
    for (const target of targets) {
      target.rect = target.el.getBoundingClientRect();
    }
  };

  const onPointerMove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (!isFrameScheduled) {
      isFrameScheduled = true;
      requestAnimationFrame(updateAll);
    }
  };

  const updateAll = () => {
    isFrameScheduled = false;
    for (const target of targets) {
      const { rect, maxRotate, proxy, setRotationX, setRotationY } = target;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = Math.max(
        -1,
        Math.min(1, (mouseX - centerX) / (rect.width / 2 || 1))
      );
      const normY = Math.max(
        -1,
        Math.min(1, (mouseY - centerY) / (rect.height / 2 || 1))
      );

      gsap.to(proxy, {
        rx: -normY * maxRotate,
        ry: normX * maxRotate,
        duration: DURATION,
        ease: EASE,
        overwrite: true,
        onUpdate: () => {
          setRotationX(proxy.rx);
          setRotationY(proxy.ry);
        },
      });
    }
  };

  const onResize = () => requestAnimationFrame(measureAll);
  const onScroll = () => requestAnimationFrame(measureAll);

  measureAll();
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  return function destroy() {
    document.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll);
  };
}


// HERO ENTRANCE

function initEntranceAnimation() {
  const hero = document.querySelector(".section.h-hero");
  if (!hero || !window.gsap) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    hero.style.opacity = 1;
    const nav = document.querySelector(".nav_section");
    const feature = document.querySelector(".h-hero_feature");
    if (nav) nav.style.opacity = 1;
    if (feature) feature.style.opacity = 1;
    return;
  }

  gsap.set(hero, { autoAlpha: 0 });

  const run = () => requestAnimationFrame(runEntranceTimeline);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run);
  } else {
    run();
  }
}

function runEntranceTimeline() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  tl.to(".section.h-hero", { autoAlpha: 1, duration: 0.15 }, 0);

  const groups = [1, 2, 3, 4, 5].map((i) => ({
    titles: Array.from(document.querySelectorAll(`.h-title.h-${i}`)),
    texts: Array.from(document.querySelectorAll(`.h-txt.h-${i}`)),
    idx: i,
  }));

  const splitCache = new Map();

  const splitTitles = (el) => {
    if (!window.SplitText) return { chars: [el] };
    if (splitCache.has(el)) return splitCache.get(el);
    const s = new SplitText(el, { type: "chars", charsClass: "char" });
    splitCache.set(el, s);
    return s;
  };

  const splitLines = (el) => {
    if (!window.SplitText) return { lines: [el] };
    if (splitCache.has(el)) return splitCache.get(el);
    const s = new SplitText(el, { type: "lines", linesClass: "line" });
    splitCache.set(el, s);
    return s;
  };

  let dotsStarted = false;

  groups.forEach((g, gi) => {
    g.titles.forEach((el) => {
      const s = splitTitles(el);
      tl.from(
        s.chars,
        { yPercent: 100, opacity: 0, duration: 0.35, stagger: 0.012 },
        gi === 0 ? "+=0.05" : "-=0.22"
      );
    });

    if (g.idx === 2 && !dotsStarted) {
      tl.add(startDotAnimation, "<+=0.05");
      dotsStarted = true;
    }

    g.texts.forEach((el) => {
      const s = splitLines(el);
      tl.from(
        s.lines,
        { yPercent: 100, opacity: 0, duration: 0.38, stagger: 0.06 },
        "-=0.28"
      );
    });
  });

  const feature = document.querySelector(".h-hero_feature");
  if (feature) {
    gsap.set(feature, { y: 48, opacity: 0, willChange: "transform, opacity" });
    tl.to(feature, { y: 0, opacity: 1, duration: 0.6 }, "-=0.15");
  }

  const nav = document.querySelector(".nav_section");
  if (nav) {
    gsap.set(nav, { y: -32, opacity: 0, willChange: "transform, opacity" });
    tl.to(nav, { y: 0, opacity: 1, duration: 0.55 }, "-=0.55");
  }
}

function startDotAnimation() {
  const sels = [".purple-dot", ".green-dot", ".orange-dot"];
  sels.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;

    gsap.set(el, {
      x: -80,
      y: 80,
      opacity: 0,
      scale: 0.98,
      willChange: "transform, opacity",
    });

    gsap.to(el, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: i * 0.12,
      ease: "back.out(1.1)",
    });
  });
}


// LOTTIE ANIMATIONS

function initLottieAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".lottie-anim").forEach((target) => {
    let anim = null;
    let hasPlayed = false;

    const st = ScrollTrigger.create({
      trigger: target,
      start: "top bottom+=50%",
      once: true,
      onEnter: () => {
        if (hasPlayed) return;
        hasPlayed = true;

        anim = lottie.loadAnimation({
          container: target,
          renderer: "svg",
          loop: false,
          autoplay: !reduceMotion,
          path: target.getAttribute("data-lottie-src"),
        });

        anim.addEventListener("DOMLoaded", () => {
          if (reduceMotion) {
            const frame = parseInt(target.getAttribute("data-lottie-frame") || "0", 10);
            anim.goToAndStop(frame, true);
            cleanup();
          }
        });

        anim.addEventListener("complete", () => {
          const last = Math.max(0, Math.floor(anim.totalFrames - 1));
          anim.goToAndStop(last, true);
          cleanup();
        });
      },
    });

    function cleanup() {
      if (anim) {
        anim.removeEventListener("DOMLoaded");
        anim.removeEventListener("complete");
        anim = null;
      }
      st.kill();
    }
  });
}


// VIMEO PLAYER

function initVimeoPlayer() {
  const vimeoPlayers = document.querySelectorAll("[data-vimeo-player-init]");

  vimeoPlayers.forEach((vimeoElement, index) => {
    const vimeoVideoID = vimeoElement.getAttribute("data-vimeo-video-id");
    if (!vimeoVideoID) return;

    const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=0&muted=1`;
    vimeoElement.querySelector("iframe").setAttribute("src", vimeoVideoURL);

    const videoIndexID = "vimeo-player-basic-index-" + index;
    vimeoElement.setAttribute("id", videoIndexID);

    const player = new Vimeo.Player(vimeoElement.id);

    if (vimeoElement.getAttribute("data-vimeo-update-size") === "true") {
      player.getVideoWidth().then((width) => {
        player.getVideoHeight().then((height) => {
          const beforeEl = vimeoElement.querySelector(".vimeo-player__before");
          if (beforeEl) {
            beforeEl.style.paddingTop = (height / width) * 100 + "%";
          }
        });
      });
    }

    let videoAspectRatio;

    if (vimeoElement.getAttribute("data-vimeo-update-size") === "cover") {
      player.getVideoWidth().then((width) => {
        player.getVideoHeight().then((height) => {
          videoAspectRatio = height / width;
          const beforeEl = vimeoElement.querySelector(".vimeo-player__before");
          if (beforeEl) beforeEl.style.paddingTop = "0%";
          adjustVideoSizing();
        });
      });
    }

    function adjustVideoSizing() {
      const containerRatio = vimeoElement.offsetHeight / vimeoElement.offsetWidth;
      const iframeWrapper = vimeoElement.querySelector(".vimeo-player__iframe");
      if (iframeWrapper && videoAspectRatio) {
        if (containerRatio > videoAspectRatio) {
          const widthFactor = containerRatio / videoAspectRatio;
          iframeWrapper.style.width = widthFactor * 100 + "%";
          iframeWrapper.style.height = "100%";
        } else {
          const heightFactor = videoAspectRatio / containerRatio;
          iframeWrapper.style.height = heightFactor * 100 + "%";
          iframeWrapper.style.width = "100%";
        }
      }
    }

    if (vimeoElement.getAttribute("data-vimeo-update-size") === "cover") {
      window.addEventListener("resize", adjustVideoSizing);
    }

    function vimeoPlayerPlay() {
      vimeoElement.setAttribute("data-vimeo-activated", "true");
      vimeoElement.setAttribute("data-vimeo-playing", "true");
      player.play();
    }

    function vimeoPlayerPause() {
      player.pause();
    }

    player.on("play", () => {
      vimeoElement.setAttribute("data-vimeo-loaded", "true");
      vimeoElement.setAttribute("data-vimeo-playing", "true");
    });

    player.on("pause", () => {
      vimeoElement.setAttribute("data-vimeo-playing", "false");
    });

    player.on("ended", () => {
      vimeoElement.setAttribute("data-vimeo-activated", "false");
      vimeoElement.setAttribute("data-vimeo-playing", "false");
      player.unload();
    });

    const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
    if (playBtn) {
      playBtn.addEventListener("click", () => {
        player.setVolume(0);
        vimeoPlayerPlay();
        if (vimeoElement.getAttribute("data-vimeo-muted") === "true") {
          player.setVolume(0);
        } else {
          player.setVolume(1);
        }
      });
    }

    const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
    if (pauseBtn) {
      pauseBtn.addEventListener("click", vimeoPlayerPause);
    }
  });
}


// TABLE OF CONTENTS

function initTableOfContents() {
  document.querySelectorAll('[data-toc-wrap]').forEach(root => {
    const contentEl = root.querySelector('[data-toc-content]');
    const listEl = root.querySelector('[data-toc-list]');
    const templateLink = listEl?.querySelector('[data-toc-link]');
    if (!contentEl || !listEl || !templateLink) return;

    const levels = (root.getAttribute('data-toc-levels') || 'h2,h3').split(',').map(l => l.trim().toLowerCase()).filter(l => /^h[1-6]$/.test(l));
    const levelSelector = levels.join(', ');
    if (!levelSelector) return;

    const offset = parseInt(root.getAttribute('data-toc-offset')) || 50;
    const marker = '{skip}';

    const slugCounts = new Map();

    function slugify(text) {
      let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      if (!slug) slug = 'section';
      const count = slugCounts.get(slug) || 0;
      slugCounts.set(slug, count + 1);
      return count === 0 ? slug : slug + '-' + (count + 1);
    }

    function stripMarker(el) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent.includes(marker)) {
          node.textContent = node.textContent.replace(marker, '').trim();
        }
      }
    }

    const allHeadings = Array.from(contentEl.querySelectorAll(levelSelector));
    const headings = [];

    allHeadings.forEach(heading => {
      if (heading.hasAttribute('data-toc-ignore')) return;
      if (heading.textContent.includes(marker)) {
        stripMarker(heading);
        return;
      }
      const text = heading.textContent.trim();
      if (!text) return;
      headings.push(heading);
    });

    if (!headings.length) return;

    headings.forEach(heading => {
      if (!heading.id) heading.id = slugify(heading.textContent.trim());
    });

    const tocLinks = [];

    headings.forEach(heading => {
      const clone = templateLink.cloneNode(true);
      const textTarget = clone.querySelector('[data-toc-text]') || clone;
      textTarget.textContent = heading.textContent.trim();
      clone.href = '#' + heading.id;
      clone.removeAttribute('data-toc-link');
      clone.setAttribute('data-toc-item', '');
      clone.setAttribute('data-toc-depth', heading.tagName.charAt(1));
      listEl.appendChild(clone);
      tocLinks.push(clone);
    });

    listEl.querySelectorAll('[data-toc-link]').forEach(el => el.remove());

    if (hasScrollTrigger) {
      function setActive(index) {
        tocLinks.forEach(link => link.setAttribute('data-toc-status', ''));
        if (tocLinks[index]) tocLinks[index].setAttribute('data-toc-status', 'active');
      }

      headings.forEach((heading, i) => {
        const nextHeading = headings[i + 1];
        ScrollTrigger.create({
          trigger: heading,
          start: 'top ' + (offset + 1) + 'px',
          endTrigger: nextHeading || contentEl,
          end: nextHeading ? 'top ' + (offset + 1) + 'px' : 'bottom top',
          onToggle: self => { if (self.isActive) setActive(i); }
        });
      });

      if (window.scrollY <= headings[0].getBoundingClientRect().top + window.scrollY - offset) {
        setActive(0);
      }
    }

    listEl.addEventListener('click', e => {
      const link = e.target.closest('[data-toc-item]');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      const id = link.getAttribute('href')?.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      if (typeof lenis !== 'undefined' && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(target, { offset: -offset });
      } else {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });
}


// COMP CALCULATOR

function initCompCalculator() {
  const billingInput = document.getElementById("billing");
  const earningsInput = document.getElementById("income");

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

  gsap.set([earningsBar, earningsBarXR], { width: 0, opacity: 0 });
  gsap.set(compAdditional, { height: 0, overflow: "hidden" });
  gsap.set([underText, overText], { opacity: 0, display: "none" });

  function updateCurrentBar(billing, earnings) {
    const earningsPercent = Math.max((earnings / billing) * 100, 0);

    billingTextElements.forEach(el => {
      el.innerText = billing > 0 ? `${billing.toLocaleString()} Billings` : "";
    });

    return gsap.to(earningsBar, {
      width: `${earningsPercent}%`,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      onStart: () => {
        earningsBar.innerText = `${Math.round(earnings).toLocaleString()} Earnings`;
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
        earningsBarXR.innerText = `${Math.round(xrEarnings).toLocaleString()} Earnings`;
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

    gsap.to(compAdditional, { height: endHeight, duration: 0.4, ease: "power2.out" });
    gsap.to(target, { opacity: 1, duration: 0.4, ease: "power2.out" });
  }

  function updateAll() {
    const billingVal = parseFloat(billingInput.value.replace(/[^0-9.]/g, "")) || 0;
    const earningsVal = parseFloat(earningsInput.value.replace(/[^0-9.]/g, "")) || 0;

    billingInput.value = billingVal > 0 ? `$${billingVal.toLocaleString()}` : "";
    earningsInput.value = earningsVal > 0 ? `$${earningsVal.toLocaleString()}` : "";

    if (!billingVal || !earningsVal) {
      gsap.set([earningsBar, earningsBarXR], { width: 0, opacity: 0 });
      gsap.set(compAdditional, { height: 0 });
      fadeOutText();
      return;
    }

    fadeOutText(() => {
      const currentTimeline = updateCurrentBar(billingVal, earningsVal);
      const xrEarnings = billingVal * 0.81;
      const xrTimeline = updateXRecruiterBar(billingVal);

      const difference = xrEarnings - earningsVal;

      if (differenceElement) differenceElement.textContent = `$${difference.toLocaleString()}`;
      if (fiveYearElement) fiveYearElement.textContent = `$${(difference * 5).toLocaleString()}`;
      if (perDayElement) perDayElement.textContent = `$${Math.round(difference / 365).toLocaleString()}`;

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
}


// PILL PHYSICS SIMULATION

function initPillSimulation() {
  if (window.innerWidth <= 750) return;
  if (typeof Matter === "undefined") return;

  const { Engine, World, Bodies, Events, Runner, Body, Sleeping, Mouse, MouseConstraint, Render } = Matter;

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
    render.canvas.style.pointerEvents = "auto";
    render.canvas.style.opacity = "0";
    containerElement.style.position = "relative";

    const wallOptions = { isStatic: true, render: { visible: false } };
    World.add(world, [
      Bodies.rectangle(containerWidth / 2, containerHeight + 150, containerWidth + 200, 300, wallOptions),
      Bodies.rectangle(-50, containerHeight / 2, 100, containerHeight + 200, wallOptions),
      Bodies.rectangle(containerWidth + 50, containerHeight / 2, 100, containerHeight + 200, wallOptions),
      Bodies.rectangle(containerWidth / 2, -50, containerWidth + 200, 100, wallOptions),
    ]);

    const bodies = [];

    pillElements.forEach((el, index) => {
      el.style.position = "absolute";
      el.style.transformOrigin = "center center";
      el.style.margin = "0";
      el.style.pointerEvents = "none";
      el.style.cursor = "pointer";
      el.style.zIndex = "10";

      const bounds = el.getBoundingClientRect();
      const w = bounds.width;
      const h = bounds.height;

      let x, y;
      if (containerElement.textContent.includes("With xrecruiter")) {
        x = containerWidth / 2;
        y = 50 + index * (h + 10);
      } else {
        x = containerWidth / 2 + (Math.random() - 0.5) * 100;
        y = 50;
      }

      const body = Bodies.rectangle(x, y, w, h, {
        restitution: 0.3,
        friction: 0.1,
        frictionAir: 0.02,
        chamfer: { radius: Math.min(w, h) / 2, max: 20 },
        density: 0.001,
        render: { fillStyle: "transparent" },
      });

      el.style.left = `${x - w / 2}px`;
      el.style.top = `${y - h / 2}px`;
      el.style.transform = `rotate(0rad)`;

      body.el = el;
      bodies.push(body);
      World.add(world, body);
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
      collisionFilter: { group: 0 },
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, "mousedown", ({ mouse }) => {
      Matter.Query.point(bodies, mouse.position).forEach(body => {
        Body.setStatic(body, false);
        Sleeping.set(body, false);
      });
    });

    Events.on(mouseConstraint, "mouseup", () => {
      if (mouseConstraint.body) {
        const body = mouseConstraint.body;
        Body.setVelocity(body, { x: body.velocity.x * 0.5, y: body.velocity.y * 0.5 });
      }
    });

    Events.on(engine, "afterUpdate", () => {
      bodies.forEach(body => {
        if (!body.el) return;
        if (body.position.y > containerHeight + 100 || body.position.y < -100) {
          Body.setPosition(body, { x: containerWidth / 2 + (Math.random() - 0.5) * 100, y: 50 });
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
        }
        body.el.style.left = `${body.position.x - body.el.offsetWidth / 2}px`;
        body.el.style.top = `${body.position.y - body.el.offsetHeight / 2}px`;
        body.el.style.transform = `rotate(${body.angle}rad)`;
      });
    });

    Events.on(engine, "collisionStart", event => {
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

  document.querySelectorAll(".pill-container").forEach(containerElement => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initSimulationFor(containerElement);
          obs.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(containerElement);
  });

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth > 750) initPillSimulation();
    }, 250);
  });
}
