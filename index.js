const body = document.querySelector('.body');
const themeWrapper = document.querySelector('.header__theme-wrapper');
const theme = document.querySelector('.header__theme');
const lightIcon = document.getElementById('#light');
const darkIcon = document.getElementById('#dark');
themeWrapper.addEventListener('click', handleTheme)
let light = false;

//Set theme from light to dark
function handleTheme() {
    if (!light) {
        darkIcon.classList.remove('none');
        lightIcon.classList.add('none');
        theme.classList.add('selected');
        body.classList.add('dark');
        light = true;
    }
    else {
        darkIcon.classList.add('none');
        lightIcon.classList.remove('none');
        theme.classList.remove('selected');
        body.classList.remove('dark');
        light = false;
    };
};

