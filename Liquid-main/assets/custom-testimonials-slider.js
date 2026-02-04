function initTestimonialSliders() {
  const Flickity = window.Flickity;
  if (!Flickity) return false;

  const carousels = document.querySelectorAll('.testimonial-slider');
  carousels.forEach(function (elem) {
    if (elem.flickity) return;
    const autoPlayMs = Number(elem.dataset.autoplay) || 0;
    new Flickity(elem, {
      pageDots: false,
      autoPlay: autoPlayMs > 0 ? autoPlayMs : false,
      wrapAround: true,
      cellAlign: 'left',
      pauseAutoPlayOnHover: false
    });
  });
  return true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    if (!initTestimonialSliders()) {
      setTimeout(initTestimonialSliders, 100);
    }
  });
} else {
  if (!initTestimonialSliders()) {
    setTimeout(initTestimonialSliders, 100);
  }
}