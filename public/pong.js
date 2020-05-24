let quadro = 0;
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const movimento = {
    acima: -1,
    parado: 0,
    abaixo: 1
};
const campo = {
    margemSuperior: 10,
    margemInferior: canvas.height - 10,
    margemEsquerda: 10,
    margemDireita: canvas.width - 10
};
const objetosDaTela = {
    jogador1: null,
    jogador2: null,
    bolinha: null
};

function mapearTeclasMovimento(jogador, teclaAcima, teclaAbaixo) {
    window.addEventListener('keydown', function(event) {
        if (event.key == teclaAcima)
            jogador.movimentar(movimento.acima);
        else if (event.key == teclaAbaixo)
            jogador.movimentar(movimento.abaixo);
    });

    window.addEventListener('keyup', function(event) {
        if (event.key == teclaAcima || event.key == teclaAbaixo)
            jogador.pararMovimento();
    });
}

function criarJogador(posicao) {
    const jogador = {
        largura: 30,
        altura: 120,
        linha: 10,
        coluna: posicao == 'esq' ? 10 : canvas.width - 40,
        velocidadeMovimento: 10,
        movimentando: 0,
        desenhar() {
            contexto.beginPath();
            contexto.rect(jogador.coluna, jogador.linha, jogador.largura, jogador.altura);
            contexto.fillStyle = 'white';
            contexto.fill();

            if (jogador.movimentando < 0)
                jogador.movimentarAcima()
            else if (jogador.movimentando > 0)
                jogador.movimentarAbaixo()
        },
        movimentarAcima() {
            if (jogador.linha > campo.margemSuperior)
                jogador.linha = jogador.linha - jogador.velocidadeMovimento;
        },
        movimentarAbaixo() {
            if (jogador.linha < campo.margemInferior - jogador.altura)
                jogador.linha = jogador.linha + jogador.velocidadeMovimento;
        },
        movimentar(movimentar) {
            jogador.movimentando = movimentar;
        },
        pararMovimento() {
            jogador.movimentando = movimento.parar;
        }
    };
    return jogador;
}

function criarBolinha(posicao) {
    largura = 30;
    altura = 30;

    const bolinha = {
        largura: largura,
        altura: altura,
        linha: (canvas.height / 2) - (altura / 2),
        coluna: (canvas.width / 2) - (largura / 2),
        desenhar() {
            contexto.beginPath();
            contexto.rect(bolinha.coluna, bolinha.linha, bolinha.largura, bolinha.altura);
            contexto.fillStyle = 'white';
            contexto.fill();
        },

    };
    return bolinha;
}

const telas = {
    inicio: {
        configurar() {
            objetosDaTela.jogador1 = criarJogador('esq');
            mapearTeclasMovimento(objetosDaTela.jogador1, 'q', 'a')

            objetosDaTela.jogador2 = criarJogador('dir');
            mapearTeclasMovimento(objetosDaTela.jogador2, '[', ']')
            
            objetosDaTela.bolinha = criarBolinha();
        }
    },
    jogo: {
        desenhar() {
            contexto.fillStyle = 'black';
            contexto.fillRect(0, 0, canvas.width, canvas.height);

            objetosDaTela.jogador1.desenhar();
            objetosDaTela.jogador2.desenhar();
            objetosDaTela.bolinha.desenhar();
        },
        atualizar() {
        }
    }
}

function loop() {
    telas.jogo.desenhar();
    telas.jogo.atualizar();

    quadro = quadro + 1;
    console.log(quadro);
    requestAnimationFrame(loop);
}

telas.inicio.configurar();
loop();
