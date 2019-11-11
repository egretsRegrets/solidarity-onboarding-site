const pages = $('.page-template-container').length;
let currentPage = 0;

function buildDoodleState() {
    const doodleState = [];
    for(var i = 0; i < pages; i++) {
        doodleState.push(
            {
                doodleCount: $(`#page_${i + 1}-ul`).children().length,
                currentDoodle: 1
            }
        )
    }
    return doodleState;
}

let doodleState = buildDoodleState();

$('html, body').animate({
    scrollTop: 0
});

doodleState.forEach((_, pageIndex) => {
    $(`#page_${pageIndex + 1}-ul`).animate({
        scrollLeft: 0
    }, 800);
});

function getFirstPageOffset() {
    const viewportHeight = window.innerHeight;
    if (viewportHeight > 612) {
        return (viewportHeight - 612) / 2;
    }
    return 0;
}

let ticking = false;

let lastInstruction = null;

function scrollTopmost() {
    $('html, body').animate({
        scrollTop: 0
    }, 600);
}

function scrollPage() {
    $('html, body').animate({
        scrollTop: $(`#page_${currentPage}`).offset().top - getFirstPageOffset()
    }, 800);
}

function scrollDoodle() {
    const firstDoodleOffset = $('#page_1-doodle_1').offset().left;
    $(`#page_${currentPage}-ul`).animate({
        scrollLeft: $(`#page_${currentPage}-doodle_${doodleState[currentPage - 1].currentDoodle}`).offset().left - firstDoodleOffset
    }, 800);
}

function doInstruction() {
    console.log('do instruction: ', lastInstruction);
    if (lastInstruction !== null) {
        switch(lastInstruction.direction) {
            case 'down':
                if (currentPage < pages) {
                    currentPage = currentPage + 1;
                    scrollPage();
                }
                break;
            case 'up':
                if (currentPage > 0) {
                    currentPage = currentPage - 1;
                    if (currentPage === 0) {
                        scrollTopmost();
                    } else {
                        scrollPage();
                    }
                }
                break;
            case 'left':
                if (currentPage !== 0) {
                    if (doodleState[currentPage - 1].currentDoodle !== 1) {
                        doodleState[currentPage - 1].currentDoodle = doodleState[currentPage - 1].currentDoodle - 1;
                        scrollDoodle();
                    }
                }
                break;
            case 'right':
                    if (currentPage !== 0) {
                        if (doodleState[currentPage - 1].currentDoodle !== doodleState[currentPage - 1].doodleCount) {
                            doodleState[currentPage - 1].currentDoodle = doodleState[currentPage - 1].currentDoodle + 1;
                            scrollDoodle();
                        }
                    }
                break;
        }
    }
}

function tick() {
    ticking = true;
    setTimeout(() => {
        doInstruction();
        lastInstruction = null;
        setTimeout(() => {
            ticking = false;
        }, 800);
    }, 300);
}

function cueInstruction(instruction) {
    if (!ticking) {
        lastInstruction = instruction;
        tick();
    }
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function getIntendedScroll(deltaX, deltaY) {
    return Math.abs(deltaX) > Math.abs(deltaY) ? {direction: deltaX > 0 ? 'right' : 'left'} : {direction: deltaY > 0 ? 'down' : 'up'};
}

function handleScroll(e) {
    // console.log('handleScroll: ', e);
    const scrollInstructions = getIntendedScroll(e.deltaX, e.deltaY);
    // console.log('scroll instructions: ', scrollInstructions);
    cueInstruction(scrollInstructions);
}

function handleScrollKeys(e) {
    console.log('handleScrollKey: ', e);
}

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.returnValue = false;
  handleScroll(e);
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        handleScrollKeys(e);
        return false;
    }
}

function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    document.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove  = preventDefault; // mobile
    document.onkeydown  = preventDefaultForScrollKeys;
}

disableScroll();