'use strict';
$(function() {
    
    //a 링크 동작 막기
    $(document).on('click', 'a[href="#"]', function(e){
        e.preventDefault();
    });
    
    //현재 페이지 표시
    setCurrentPage();
    function setCurrentPage() {
        var bodyClass = $('body').attr('class');
        var arrayClass = bodyClass.split(' ');
        
        $('#gnb > ul > li').each(function() {
            if ($(this).attr('data-menu') === arrayClass[1]) {
                $(this).addClass('on');
            } else {
                $(this).removeClass('on');
            }
        });
        $('#gnb > ul > li.on > ul > li').each(function() {
            if ($(this).attr('data-menu') === arrayClass[2]) {
                $(this).addClass('on');
            } else {
                $(this).removeClass('on');
            }
        });  
    }
    
    //언어 선택
    setLangList();
    function setLangList() {
        $('#header-top div.top-nav ul.lang-list li a').on('click', function() {
           $('#header-top div.top-nav ul.lang-list li').toggleClass('on');
        });
    }

    //메인 메뉴
    setGnb();
    function setGnb() {
        //PC
        $('#gnb > ul > li > a').on('mouseenter focus', function() {
            if ($(window).width() < 1181) return false;
            $('#header').addClass('on');
            $('#gnb > ul > li > ul').stop(true).slideDown(300);
        });
        $('#header').on('mouseleave', function() {
            if ($(window).width() < 1181) return false;
            $('#header').removeClass('on');
            $('#gnb > ul > li > ul').stop(true).slideUp(300);
        });
        $('#gnb > ul > li:last-child > ul > li:last-child').append('<a href="#" class="outfocus"></a>');
        $('#gnb > ul > li:last-child > ul > li:last-child').find('.outfocus').on('focus', function() {
            $('#header').trigger('mouseleave');
        });
        // 모바일
        $('#header a.menu').on('click', function() {
            $('#header, #header a.menu').toggleClass('open');
            if ($('#header a.menu').hasClass('open')) {
                $('#gnb > ul > li > ul').css({'display': 'none'});
                $('body').css({'height': '100%', 'overflow': 'hidden'});
            } else {
                $('body').css({'height': 'auto', 'overflow': 'initial'});
            }
        });
        $('#gnb > ul > li > a').each(function() {
            if ($(this).parent().find('ul').length > 0) {
                $(this).append('<i class="fas fa-chevron-down mobile"></i>'); //모바일 아이콘
            }
        });
        $('#gnb > ul > li > a').on('click', function(e) {
            if ($(window).width() < 1181) {
                e.preventDefault();
                $('#gnb > ul > li > a').not(this).parent().find('ul').slideUp(300);
                $('#gnb > ul > li > a').find('i').attr({'class': 'fas fa-chevron-down mobile'}); $(this).parent().find('ul').slideDown(300);
                $(this).find('i').attr({'class': 'fas fa-minus mobile'});
            }
        });
    }

    //메인 슬라이드
    setImageSlide('#main-visual div.main-visual-box', false, 3000);
    function setImageSlide(selector, status, speed) {
        var numSlide = $(selector).find('ul.slide li').length;
        var slideNow = 0;
        var slidePrev = 0;
        var slideNext = 0;
        var timerId = '';
        var timerSpeed = speed;
        var isTimerOn = status;
        var startX = 0;
        var startY = 0;
        var delX = 0;
        var delY = 0;
        var offsetX = 0;

        //초기화
        $(selector).find('ul.slide li').each(function(i) {
            $(selector).find('ul.indicator').append('<li><a href="#">' + (i + 1) + '번 슬라이드 보기</a></li>\n');
            $(this).css({'display': 'block', 'left': (i * 100) + '%'});
        });
        if (isTimerOn === true) {
            $('#main-visual a.play').addClass('on');
        } else {
            $('#main-visual a.play').removeClass('on');
        }
        showSlideAnimation(1);

        $(selector).find('a.prev').on('click', function() {
            $(this).stop(true).animate({'left': '-5px'}, 50).animate({'left': '10px'}, 100);
            showSlideAnimation(slidePrev);
        });
        $(selector).find('a.next').on('click', function() {
            $(this).stop(true).animate({'right': '-5px'}, 50).animate({'right': '10px'}, 100);
            showSlideAnimation(slideNext);
        });
        $(selector).find('ul.indicator li a').on('click', function() {
            var index = $('#main-visual ul.indicator li').index($(this).parent());
            showSlideAnimation(index + 1);
        });
        $('#main-visual a.play').on('click', function() {
            if (isTimerOn === true) {
                clearTimeout(timerId);
                $(this).removeClass('on');
                isTimerOn = false;
            } else {
                timerId = setTimeout(function() {showSlideAnimation(slideNext);}, timerSpeed);
                $(this).addClass('on');
                isTimerOn = true;
            }
        });
        //모바일 스와이프
        $(selector).find('ul.slide').on('touchstart', function(e) {
            if ($(window).width() < 1025) {
                e.preventDefault();
                clearTimeout(timerId);
                $(this).css({'transition' : 'none'});
                startX = e.touches[0].clientX;
                offsetX = $(this).position().left;
                $(document).on('touchmove', function(e) {
                    delX = e.touches[0].clientX - startX;
                    if ((delX > 0 && slideNow === 1) || (delX < 0 && slideNow === numSlide)) {
                        delX = delX / 10;
                    }  
                    $(selector).find('ul.slide').css({'left': (offsetX + delX) + 'px'});
                });
                $(document).on('touchend', function(e) {
                    if (delX < -50 && slideNow !== numSlide) {
                        showSlideAnimation(slideNext);
                    } else if (delX > 50 && slideNow !== 1) {
                        showSlideAnimation(slidePrev);
                    } else {
                        showSlideAnimation(slideNow);
                    }
                    $(document).off('touchmove touchend');
                });
            }
        });
        
        function showSlideAnimation(n) {
            clearTimeout(timerId);
            if (slideNow === 0) {
                $(selector).find('div ul.slide').css({'transition': 'none','left': -((n - 1) * 100) + '%'});
            } else {
                $(selector).find('div ul.slide').css({'transition': 'left 0.3s', 'left': -((n - 1) * 100) + '%'});
            }
            $(selector).find('ul.indicator li').removeClass('on');
            $(selector).find('ul.indicator li:eq(' + (n - 1) + ')').addClass('on');
            slideNow = n;
            slidePrev = (n - 1) < 1 ? numSlide : n - 1;
            slideNext = (n + 1) > numSlide ? 1 : n + 1;
            if (isTimerOn === true) {
                timerId = setTimeout(function() {showSlideAnimation(slideNext);}, timerSpeed);
            }
        }
    }
    
    //페이드 효과 슬라이드
    setSlideFade('#lab-coffee');
    function setSlideFade(selector) {
        var numSlide = $(selector).find('ul.slide li').length;
        var slideNow = 0;
        var slideNext = 0;
        var timerId = '';
        var timerSpeed = 3000;
        
        //초기화
        $(selector).find('ul.slide li').each(function(i) {
            $(selector).find('ul.indicator').append('<li><a href="#">' + (i + 1) + '번 슬라이드 보기</a></li>\n');
        });
        showSlideFade(1);
        
        $(selector).find('ul.indicator li a').on('click', function() {
            var index = $(selector).find('ul.indicator li').index($(this).parent());
            showSlideFade(index + 1);
        });
        
        function showSlideFade(n) {
            clearTimeout(timerId);
            if (slideNow.type === 0) {
                $(selector).find('ul.slide li').css({'display' : 'none'});
                $(selector).find('ul.slide li:eq(' + (n - 1) + ')').css({'display' : 'block'}); 
            } else {
                $(selector).find('ul.slide li').stop().animate({'opacity' : 0}, 500, function() {$(this).css({'display' : 'none'});});
                $(selector).find('ul.slide li:eq(' + (n - 1) + ')').css({'display' : 'block', 'opacity' : 0}).stop().animate({'opacity' : 1}, 500);
            }
            $(selector).find('ul.indicator li').removeClass('on')
            $(selector).find('ul.indicator li:eq(' + (n - 1) + ')').addClass('on')
            slideNow = n;
            slideNext = n + 1 > numSlide ? 1 : n + 1;
            timerId = setTimeout(function() {showSlideFade(slideNext);}, timerSpeed);
        }  
    }

    //무한 슬라이드
    setInfinitySlide('#lab-md');
    function setInfinitySlide(selector) {
        var numSlide = $(selector).find('ul.slide li').length;
        var clone = '';
        var timerId = '';
        var startX = 0;
        var delX = 0;
        var offsetX = 0;
        
        setImage();
        
        $(selector).find('a.prev').on('click', function() {
            clone = $(selector).find('ul.slide li:nth-child(' + numSlide + ')').clone();
            $(selector).find('ul.slide li:nth-child(' + numSlide + ')').remove();
            $(selector).find('ul.slide').prepend(clone);
            setImage();
        });
        $(selector).find('a.next').on('click', function() {
            clone = $(selector).find('ul.slide li:nth-child(1)').clone();
            $(selector).find('ul.slide li:nth-child(1)').remove();
            $(selector).find('ul.slide').append(clone);
            setImage();
        });
        //모바일 스와이프
        $(selector).find('ul.slide').on('touchstart', function(e) {
            if ($(window).width() < 1025) {
                e.preventDefault();
                $(this).css({'transition': 'none'});
                startX = e.touches[0].clientX;
                offsetX = $(this).position().left;
                $(document).on('touchmove', function(e) {
                    delX = e.touches[0].clientX - startX;
                });
                $(document).on('touchend', function(e) {
                    if (delX < -50) {
                        $(selector).find('a.next').trigger('click');
                        setImage();
                    } else if (delX > 50) {
                        $(selector).find('a.prev').trigger('click');
                        setImage();
                    } else {
                        setImage();
                    }
                    $(document).off('touchmove touchend');
                });
            }
        });
        
        function setImage() {
            $(selector).find('ul.slide li:nth-child(1)').css({'left': '0'});
            $(selector).find('ul.slide li:nth-child(2)').css({'left': '26%'});
            $(selector).find('ul.slide li:nth-child(3)').css({'left': '74%'});
            $(selector).find('ul.slide li:nth-child(4)').css({'left': '74%'});
            $(selector).find('ul.slide li:last-child').css({'left': '0'});
        }
        function showSlideInfinite() {
            clone = $(selector).find('ul.slide li:nth-child(' + numSlide + ')').clone();
            $(selector).find('ul.slide li:nth-child(' + (numSlide - 1) + ')').remove();
            $(selector).find('ul.slide').prepend(clone);
            setImage();
        }
    }
    
    //배너 슬라이드
    setBannerSlide();
    function setBannerSlide() {
        var showBanner = 0; // 처음 보이는 개수
        var showMore = 0; // 증감 값
        var numBanner = $('#recommend div div.banner-slide ul li').length;
        var boxWidth = $('#recommend div.banner-slide div.wrapper').innerWidth();
        var barWidth = 0;
        var bannerWidth = $('#recommend div div.banner-slide ul li').width();
        
        if ($(window).outerWidth(true) < 960) {
            showBanner = 2; //mobile
        } else {
           showBanner = 3; //pc & tablet
        }
        //reset banner
        $(window).on('resize', function() {
            $('#recommend div.banner-slide ul').css({'left': 0});
            showMore = 0;
            bannerWidth = $('#recommend div div.banner-slide ul li').width();
            if ($(window).outerWidth(true) < 960) {
                showBanner = 2;
            } else {
               showBanner = 3;
            }
        });
        
        $('#recommend div div.banner-slide a.prev').on('click', function() {
            showBannerSlide('prev');
        });
        $('#recommend div div.banner-slide a.next').on('click', function() {
            showBannerSlide('next');
        }); 
        
        function showBannerSlide(direction) {
            if (direction === 'prev') {
                if (showMore === 0) {
                    $('#recommend div div.banner-slide ul').stop(true).animate({'left': '10px'}, 50).animate({'left': 0}, 100);
                } else {
                    showMore--;
                    $('#recommend div div.banner-slide ul').stop(true).animate({'left': -(bannerWidth * showMore) + 'px'}, 500);
                }
            } else if (direction === 'next') {
                if (showMore === (numBanner - showBanner)) {
                    $('#recommend div div.banner-slide ul').stop(true).animate({'left': -((bannerWidth * showMore) -10) + 'px'}, 50).animate({'left': -(bannerWidth * showMore) + 'px'}, 100);
                } else {
                    showMore++;
                    $('#recommend div div.banner-slide ul').stop(true).animate({'left': -(bannerWidth * showMore) + 'px'}, 500);
                }
            }
        }
    }
    
    //스크롤 이펙트
    setScrollEffect('#culturelab ul li');
    setScrollEffect('#coffeelab div.img a');
    function setScrollEffect(selector) {
        var scrollTop = 0;
        var minShow = 0;
        var maxShow = 0;
        
        checkFixed();
        checkVisivility()
        checkAsideStatus(205);
        $(window).on('scroll resize', function() {
            checkFixed();
            checkVisivility();
            checkAsideStatus(205);
        }); 
        
        function checkFixed() {
            scrollTop = $(document).scrollTop();
            if (scrollTop > 60) {
                $('#header').addClass('fixed');
                $('#main-visual').css({'margin-top': '100px'});
                $('#sub-visual').css({'margin-top': '100px'});
                $('.coffee_lab #sub-visual').css({'margin-top': '0'});
            } else {
                $('#header').removeClass('fixed');
                $('#main-visual').css({'margin-top': '0'});
                $('#sub-visual').css({'margin-top': '0'});
            }
        }
        function checkVisivility() {
            var elementLength = $(selector).length;
            if (elementLength === 0) return false;
            scrollTop = $(document).scrollTop();
            minShow = $(selector).offset().top - $(window).height();
            maxShow = $(selector).offset().top + $(selector).outerHeight();
            $(selector).removeClass('on');
            if (scrollTop < minShow) {
                $(selector).removeClass('on');
            } else if (scrollTop > maxShow) {
                $(selector).addClass('on');
            } else {
                $(selector).addClass('on');
            }
        }
        function checkAsideStatus(offsetTop) {
            scrollTop = $(document).scrollTop();
            $('#quickmenu').css({'top': scrollTop + offsetTop + 'px'});
        }
    }
    
    setLabel('#board div.findstore');
    function setLabel(selector) {
        $(selector).find('form input[type=text]').on('focus', function() {
            $(selector).find('form label').hide()
        }).on('blur', function() {
            if ($(selector).find('form input[type=text]').val() === '') {
                $(selector).find('form label').show();
            }
        });
    }
    
    //탭메뉴 카테고리 클릭
    setBoard('#board dl.ediya-news');
    setBoard('#lab-special div > dl');
    function setBoard(selector) {
        var elementLength = $(selector).length;
        if (elementLength === 0) return false;
        $(selector).find('> dt a').on('click', function() {
            $(selector).find('> dt').removeClass('on');
            $(this).parent().addClass('on');
            $(selector).find('> dd').css({'display': 'none'});
            $(this).parent().next().css({'display': 'block'});
        });
    }
    
    //체크된 항목 표시
    setCheckList('#product', 8);
    function setCheckList(selector, number) {
        var checkedLength = 0;
        var listLength = 0;
        var listShown = number; //보여줄 개수
        var inputId = ''
        var listId = '';
        
        //초기화
        checkList();
        showMore();
        
        $(selector).find('a.more').on('click', function() {
            showMore();
        });
        $(selector).find('input[type=checkbox]').on('change', function() {
            checkList();
            showMore();
        });
        
        
        function showMore() {
            listLength = $(selector).find('ul.check-list li.on').length;
            if (listShown >= listLength) {
                listShown = listLength;
                $(selector).find('a.more').hide();
            } else {
                $(selector).find('a.more').show();
            }
            $(selector).find('ul.check-list li.on:lt(' + (listShown) + ')').addClass('show');
            listShown += number;
        }
        function checkList() {
            checkedLength = $(selector).find('input[type=checkbox]:checked').length;
            listShown = number;
            $(selector).find('ul.check-list li').removeClass('show');
            if (checkedLength === 0) { //체크된 항목이 없을때
                 $(selector).find('ul.check-list li').each(function() {
                    $(this).addClass('on');
                });
                $(selector).find('ul.check-list li.on:lt(' + listShown+ ')').addClass('show');
            } else if (checkedLength > 0) { //체크된 항목이 있을때
                $(selector).find('input[type=checkbox]').each(function() {
                    var $this = $(this);
                    if ($this.prop('checked') === true) {
                        inputId = $this.attr('id');
                        $(selector).find('ul.check-list li').each(function() {
                            listId = $(this).attr('data-menu');
                            if (listId === inputId) {
                            $(this).addClass('on');
                            }
                        });
                    } else if ($this.prop('checked') !== true) {
                        inputId = $this.attr('id');
                        $(selector).find('ul.check-list li').each(function() {
                            listId = $(this).attr('data-menu');
                            if (listId === inputId) {
                            $(this).removeClass('on show');
                            }
                        });
                    }
                });
            }
        }
    }
    
    //레이어 팝업창
    setOpenLayerPopup('#lab-map');
    setOpenLayerPopup('#lab-special');
    function setOpenLayerPopup(selector) {
        $(selector).find('ul.popup > li > a').on('click', function() {
            var index = $(selector).find('ul.popup > li').index($(this).parent());
            var $this = $(this);
            openLayerPopup(index + 1)
        });
        
        function openLayerPopup(n) {
            $(selector).find('div.layer-popup:eq(' + (n - 1) + ')').before('<div id="layer-mask" tabindex="0"></div>').css({'display': 'block'}).attr({'tabindex': 0}).trigger('focus').append('<a href="#" class="return"></a>');
            //포커스
            $('#layer-mask').on('focus', function() {
                $(selector).find('div.layer-popup:eq(' + (n - 1) + ')').find('a.return').prev().trigger('focus');
            }).on('click', function() {
                $(selector).find('div.layer-popup a.close').trigger('click');
            });
            $(selector).find('div.layer-popup:eq(' + (n - 1) + ')').find('a.return').on('focus', function() {
                $(selector).find('div.layer-popup:eq(' + (n - 1) + ')').trigger('focus');
            });
            //팝업 닫기
            $(selector).find('div.layer-popup a.close').one('click', function() {
                $(selector).find('ul.popup li:eq(' + (n - 1) + ') a').trigger('focus');
                $(selector).find('div.layer-popup').find('a.return').remove(); 
                $(this).parent().parent().find('#layer-mask').remove(); 
                $(this).parent().css({'display': 'none'});
            });
        }
    }
});