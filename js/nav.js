(function(){
    const nav = none
window.addEventListener("scroll", function(){
    var hero = document.querySelector("nav container");
    hero.classList.toggle("sticky", window.scrollY > 0)
})
})