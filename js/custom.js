
(function ($) {
  
  "use strict";

    // PRE LOADER
    $(window).load(function(){
      $('.preloader').fadeOut(1000); // set duration in brackets    
    });

    // CUSTOM LINK
    $('.custom-link').click(function(){
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height() + 10;

    scrollToDiv(elWrapped,header_height);
    return false;

    function scrollToDiv(element,navheight){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop-navheight;

      $('body,html').animate({
      scrollTop: totalScroll
      }, 300);
  }
});

    // Gestion du clic sur le wrapper media
    $('.media-wrapper').on('click', function(e) {
      // Empêcher le comportement par défaut seulement si on clique directement sur le wrapper
      if (e.target === this || $(e.target).hasClass('media')) {
        e.preventDefault();
        // Rediriger vers notre page de réseaux sociaux
        window.location.href = 'social.html';
      }
    });

    // NAVIGATION MOBILE - Fermer le menu après clic sur un lien
    $('.navbar-nav .nav-link').on('click', function() {
      if ($(window).width() < 992) {
        $('.navbar-collapse').collapse('hide');
      }
    });

    // Améliorer l'accessibilité du menu mobile
    $('.navbar-toggler').on('click', function() {
      var isExpanded = $(this).attr('aria-expanded') === 'true';
      $(this).attr('aria-expanded', !isExpanded);
    });
    
  })(window.jQuery);


