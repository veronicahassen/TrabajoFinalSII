(function(){
    const titleServices = [...document.querySelectorAll('.services__title')];
    console.log(titleServices)

    titleServices.forEach(services =>{
        services.addEventListener('click', ()=>{
            let height = 0;
            let description = services.nextElementSibling;
            let addPadding = services.parentElement.parentElement;

            addPadding.classList.toggle('services__padding--add');
            services.children[0].classList.toggle('services__arrow--rotate');

            if(description.clientHeight === 0){
                height = description.scrollHeight;
            }

            description.style.height = `${height}px`;
        });
    });
})();