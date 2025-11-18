const carosuels = document.querySelectorAll('.testimonial-slider');
  
carosuels.forEach(elem => {

    let autoPlayInterval = Number(elem.dataset.autoplay);        
        
    new Flickity(elem,{
        pageDots: false,
        autoPlay: autoPlayInterval,
        wrapAround: true,
        cellAlign: 'left',
        pauseAutoPlayOnHover: false
      });
  });