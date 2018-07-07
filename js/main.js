var currentSlide = 0;
var numberOfSlides = 2; // Для себя, число слайдов (от 0)
var touchInfo = {
    started: false
};

/* НАЧАЛО НАВИГАЦИИ ПО СТРАНИЦЕ */

function moveTo(slide){
    if(slide === currentSlide) return false;

    if(!slide || !currentSlide){ // Нужно ли взаимодействовать со стрелкой
        var arrowDown = document.querySelector(".next-slide");
        if(!slide) arrowDown.style.display = ""; // если приходим - показать стрелку
        if(!currentSlide) arrowDown.style.display = "none"; // если уходим - скрыть стрелку
    }

    var firstSlide = document.querySelector(".box-1");
    var pagginations = document.getElementsByClassName("pagination__elipse");
    var activePaggination = document.querySelector(".pagination__elipse_active");   

    firstSlide.style.marginTop = - slide * 768 + "px";
    activePaggination.classList.remove("pagination__elipse_active");
    pagginations[slide].classList.add("pagination__elipse_active");
    currentSlide = slide;
}

document.addEventListener("touchstart",checkSlideNavigationStart);
document.addEventListener("touchmove",checkSlideNavigation);

function checkSlideNavigationStart(event){
    if(touchInfo.started) return false; // Отслеживаем только один элемент навигации
    if(event.touches.length != 1) return false; // Допускаем только один палец

    touchInfo.started = true;
    touchInfo.waitForSwipe = true; // Ожидаем свайп пальцем
    touchInfo.touch = event.changedTouches[0];
    touchInfo.touchX = event.changedTouches[0].pageX;
    touchInfo.touchY = event.changedTouches[0].pageY;
}
 
function checkSlideNavigation(event){
    if(!touchInfo.started || event.touches.length != 1 || !touchInfo.waitForSwipe) return false; // Должны быть готовы к действию из touchstart

    // Новые координаты при свайпе (нужен только Y)
    var newX = event.changedTouches[0].pageX;
    var newY = event.changedTouches[0].pageY;
    
    if(Math.abs(newY - touchInfo.touchY) < 20) return false; // Реагируем только на явные свайпы (> 20 px по оси Y)

    // Если newY - touchInfo.touchY больше 0, значит свайп вниз (иначе вверх) 
    if(newY - touchInfo.touchY > 0){
        if(!currentSlide) return clearClickInfoAndDo();
        return clearClickInfoAndDo(currentSlide - 1);
    }else{
        if(currentSlide + 1 > numberOfSlides) return clearClickInfoAndDo();
        return clearClickInfoAndDo(currentSlide + 1);
    }
}

function clearClickInfoAndDo(moveToSlide){    
    touchInfo = {}; // Очищаем все установленные значения
    if(typeof moveToSlide !== "undefined") return moveTo(moveToSlide);    
}

/* КОНЕЦ НАВИГАЦИИ ПО СТРАНИЦЕ */

/* НАЧАЛО НИЖНИЙ СЛАЙДЕР*/
var slider = document.querySelector("div.slider .elems");
var sliderBigLine = slider.querySelector(".elems__linear");
var sliderSmallLine = slider.querySelector(".elems__linear.elems__linear_color");
var sliderStone = slider.querySelector(".elems__polygon");

sliderStone.addEventListener("touchstart",thirdSliderStart);
sliderStone.addEventListener("touchmove",moveThirdSlider);
sliderStone.addEventListener("touchend",finalActionSlider);

function thirdSliderStart(event){
    if(touchInfo.started) return false; // Отслеживаем только один элемент навигации
    if(event.touches.length != 1) return false; // Допускаем только один палец

    touchInfo.started = true;
    touchInfo.sliderStart = true; // Ожидаем свайп пальцем (на камне)
    touchInfo.touch = event.changedTouches[0];
    touchInfo.touchXStone = event.changedTouches[0].pageX;
    touchInfo.touchYStone = event.changedTouches[0].pageY;
    touchInfo.stoneCoords = getElementCoordinates(sliderStone);
    touchInfo.sliderCoords = getElementCoordinates(sliderBigLine);

    touchInfo.bigLineWidth = sliderBigLine.offsetWidth;
    touchInfo.stoneWidth = sliderStone.offsetWidth;
    touchInfo.position25 = Math.round(touchInfo.bigLineWidth * 0.25);
    touchInfo.position50 = Math.round(touchInfo.bigLineWidth * 0.50);
    touchInfo.position75 = Math.round(touchInfo.bigLineWidth * 0.75);
    
    touchInfo.shiftX = touchInfo.touchXStone - touchInfo.stoneCoords.left;
    touchInfo.bigLineRightEdge = touchInfo.bigLineWidth - touchInfo.stoneWidth;

    moveThirdSlider(event); // MOVE
}

function thirdSliderMove(event){
    if(!touchInfo.started || event.touches.length != 1 || !touchInfo.sliderStart) return false; // Должны быть готовы к действию из touchstart

    // Новые координаты при свайпе (нужен только Y)
    var newX = event.changedTouches[0].pageX;
    var newY = event.changedTouches[0].pageY;
    
    if(Math.abs(newY - touchInfo.touchX) < 20) return false; // Реагируем только на явные свайпы (> 20 px по оси X)

    // Если newY - touchInfo.touchX больше 0, значит свайп вниз (иначе вверх) 
    if(newY - touchInfo.touchX > 0){
        if(!currentSlide) return clearClickInfoAndDo();
        return clearClickInfoAndDo(currentSlide - 1);
    }else{
        if(currentSlide + 1 > numberOfSlides) return clearClickInfoAndDo();
        return clearClickInfoAndDo(currentSlide + 1);
    }
}

function moveThirdSlider(event){
    if(!touchInfo.sliderStart) return false;
  	var touch = event.changedTouches[0];
  	var newX = touch.pageX;

	var newLeft = newX - touchInfo.shiftX - touchInfo.sliderCoords.left; 

	if (newLeft < 0) {
        newLeft = 0;
    };

    if (newLeft > touchInfo.bigLineRightEdge) {
    newLeft = touchInfo.bigLineRightEdge;
    }

    sliderStone.style.left = newLeft + "px";
    sliderSmallLine.style.width = newLeft + touchInfo.stoneWidth/2 + "px";

    var firstSlide = document.querySelector(".longcontainer__slide.longcontainer__slide_left.slideLeft");

    if(newLeft < touchInfo.position25){
		firstSlide.style.marginLeft = 0 + "px";
	}

	if((newLeft < touchInfo.position75) && (touchInfo.lastLeftStone > touchInfo.position25)){
		firstSlide.style.marginLeft = - 1024 + "px";
	}

	if(newLeft > touchInfo.position75){
		firstSlide.style.marginLeft = - 2048 + "px";
	}

    touchInfo.lastLeftStone = newLeft;
}

function finalActionSlider(event){
    sliderStone.style.transition = "left .25s ease";
	sliderSmallLine.style.transition = "width .25s ease";
    setTimeout(function(){
        sliderStone.style.transition = "none";
        sliderSmallLine.style.transition = "none";
    },250);

	if(touchInfo.lastLeftStone < touchInfo.position25){
		sliderStone.style.left = 0 + "px";		
   		sliderSmallLine.style.width = 0 + "px";
		return clearClickInfoAndDo();
	}

	if((touchInfo.lastLeftStone < touchInfo.position75) && (touchInfo.lastLeftStone > touchInfo.position25)){
		sliderStone.style.left = touchInfo.position50 - touchInfo.stoneWidth/2 + "px";
		sliderSmallLine.style.width = touchInfo.position50 + "px";
		return clearClickInfoAndDo();
	}

	if(touchInfo.lastLeftStone > touchInfo.position75){
		sliderStone.style.left = touchInfo.bigLineRightEdge + "px";
		sliderSmallLine.style.width = touchInfo.bigLineRightEdge + touchInfo.stoneWidth/2 + "px";
		return clearClickInfoAndDo();
	}

}

/* КОНЕЦ НИЖНИЙ СЛАЙДЕР*/

function getElementCoordinates(elem) { // РєСЂРѕРјРµ IE8-
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };

}