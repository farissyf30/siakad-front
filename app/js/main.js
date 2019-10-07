(function() {
    'use strict';

      
    // $('.navbar-header .navbar-nav li.dropdown').hover(function() {
    //     $(this).find('.dropdown-menu').stop(true, true).fadeIn(100);
    //   }, function() {
    //     $(this).find('.dropdown-menu').stop(true, true).fadeOut(100);
    //   });

    var animateFixHead = 50;
    $(window).scroll(function() {
      var scroll = onScroll();
        if ( scroll >= animateFixHead ) {
            $(".navbar-header").addClass("shrink");
          }
          else {
              $(".navbar-header").removeClass("shrink");
          }
      });
      function onScroll() {
          return window.pageYOffset || document.documentElement.scrollTop;
      }
  
      
    $('.main-banner').slick({
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false
    });

    $('.nav-side').click(function(e){
      e.preventDefault();
      $('body').addClass('no-scroll');
      $('.nav-content').addClass('show');
      $('.navbar-header').append('<div class="menu-overlay"></div>');
    });
    $('.navbar-header').on('click', '.menu-overlay',function(){
      $('body').removeClass('no-scroll');
      $('.nav-content').removeClass('show');
      $(this).remove();
    });
    $('select').niceSelect(); 
   
    $('#data-master').DataTable({
      "columnDefs": [ {
        "targets": 5,
        "orderable": false
      }],
    });
   
    $('.datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
    });

    $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
      if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
      }
      var $subMenu = $(this).next('.dropdown-menu');
      $subMenu.toggleClass('show');
    
    
      $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
        $('.dropdown-submenu .show').removeClass('show');
      });
    
    
      return false;
    });


  })();