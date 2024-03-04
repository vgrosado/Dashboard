
const themeWrapper = document.querySelector('.header__theme-wrapper');
const theme = document.querySelector('.header__theme')
themeWrapper.addEventListener('click', handleTheme)
let light = true;

//Set theme from light to dark
function handleTheme() {
    if (!light) {
        theme.innerText = 'Dark'
        theme.classList.add('selected');
        light = true;
    }
    else {
        theme.classList.remove('selected');
        theme.innerText = 'Light'
        light = false;
    };
};

