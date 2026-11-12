const carregamento = document.getElementById('tela-loading-master');

if (carregamento) {
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tempoAbertura = movimentoReduzido ? 0 : 650;
    const tempoSaida = movimentoReduzido ? 50 : 1250;

    window.setTimeout(function() {
        carregamento.classList.add('abrir-comportas');

        window.setTimeout(function() {
            carregamento.classList.add('escondido');
            carregamento.addEventListener('transitionend', function(evento) {
                if (evento.target === carregamento && evento.propertyName === 'opacity') {
                    carregamento.remove();
                }
            }, { once: true });

            if (movimentoReduzido) {
                carregamento.remove();
            }
        }, tempoSaida);
    }, tempoAbertura);
}
