(() => {
    const discoverButton = document.querySelector('#descubra');
    if (!discoverButton) return;

    const pages = [
        ['Aprenda com o YouTube', 'Descubra.html'],
        ['Organização dos estudos', 'dicas-organizacao.html'],
        ['Concentração', 'dicas-concentracao.html'],
        ['Memorização', 'dicas-memorizacao.html'],
        ['Produtividade', 'dicas-produtividade.html'],
        ['Rotina de estudos', 'dicas-rotina.html'],
        ['Aprendizagem', 'dicas-aprendizagem.html'],
        ['Preparação para provas', 'dicas-provas.html'],
        ['Matemática', 'dicas-matematica.html'],
        ['Leitura', 'dicas-leitura.html'],
        ['Técnicas de estudo', 'dicas-tecnicas-estudo.html'],
        ['Saúde mental e bem-estar estudantil', 'dicas-saude-mental.html'],
    ];
    const wrapper = document.createElement('div');
    wrapper.className = 'descubra-dropdown';
    const menu = document.createElement('div');
    menu.className = 'descubra-menu';
    menu.id = 'descubra-menu';
    menu.setAttribute('role', 'menu');

    pages.forEach(([label, href]) => {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        link.setAttribute('role', 'menuitem');
        menu.append(link);
    });

    discoverButton.parentNode.insertBefore(wrapper, discoverButton);
    wrapper.append(discoverButton, menu);
    discoverButton.setAttribute('aria-haspopup', 'true');
    discoverButton.setAttribute('aria-controls', menu.id);
    discoverButton.setAttribute('aria-expanded', 'false');
    let openedByHover = false;

    const closeMenu = () => {
        menu.hidden = true;
        openedByHover = false;
        discoverButton.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
        menu.hidden = false;
        discoverButton.setAttribute('aria-expanded', 'true');
    };

    menu.hidden = true;
    discoverButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (menu.hidden) openMenu();
        else if (openedByHover) openedByHover = false;
        else closeMenu();
    }, true);

    wrapper.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') {
            openedByHover = true;
            openMenu();
        }
    });
    wrapper.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'mouse') closeMenu();
    });

    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || menu.hidden) return;
        closeMenu();
        discoverButton.focus();
    });
})();
