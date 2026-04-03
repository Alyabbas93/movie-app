import gsap from 'gsap';

export const animatePageIn = (element: HTMLElement) => {
  gsap.killTweensOf(element);
  gsap.fromTo(element, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  );
};

export const animateCardsStagger = (elements: HTMLElement[]) => {
  gsap.killTweensOf(elements);
  gsap.fromTo(elements,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
  );
};

export const animateCardHover = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1.05,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    duration: 0.3,
    ease: 'power2.out',
  });
};

export const animateCardHoverOut = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'power2.out',
  });
};

export const animateNavIn = (element: HTMLElement) => {
  gsap.from(element, {
    x: -50,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
  });
};

export const animateCarouselScroll = (element: HTMLElement, scrollAmount: number) => {
  gsap.to(element, {
    scrollLeft: scrollAmount,
    duration: 0.8,
    ease: 'power2.inOut',
  });
};

export const animateButtonClick = (element: HTMLElement) => {
  gsap.timeline()
    .to(element, {
      scale: 0.95,
      duration: 0.1,
    }, 0)
    .to(element, {
      scale: 1,
      duration: 0.2,
    });
};
