'use strict';

const dClick = document.querySelector('.d-widget'),
    tClick = document.querySelector('.t-widget');


function setUpButton (ele) {
    ele.addEventListener('click', () => {
        console.log('CLICK');
    });
}


setUpButton(tClick);
