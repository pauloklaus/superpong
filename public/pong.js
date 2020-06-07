let quadro = 0;
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const movimento = {
    acima: -1,
    parado: 0,
    abaixo: 1
};
const campo = {
    margemSuperior: 50,
    margemInferior: canvas.height - 10,
    margemEsquerda: 10,
    margemDireita: canvas.width - 10
};
const objetosDaTela = {
    jogador1: null,
    jogador2: null,
    bolinha: null
};
const dimensaoBolinha = {
    altura: 30,
    largura: 30
};
const dimensaoJogador = {
    altura: 120,
    largura: 30
};

function gerarMovimentoEntre(min, max) {
    return Math.random() * (max - min) + min;
};

function mapearTeclasMovimento(bolinha, jogador, teclaAcima, teclaAbaixo) {
    window.addEventListener('keydown', function(event) {
        if (event.key == teclaAcima) {
            bolinha.iniciarMovimento();
            jogador.iniciarMovimento(movimento.acima);
        }
        else if (event.key == teclaAbaixo) {
            bolinha.iniciarMovimento();
            jogador.iniciarMovimento(movimento.abaixo);
        }
    });

    window.addEventListener('keyup', function(event) {
        if (event.key == teclaAcima || event.key == teclaAbaixo) {
            bolinha.iniciarMovimento();
            jogador.pararMovimento();
        }
    });
}

function criarJogador(posicao) {
    largura = dimensaoJogador.largura;
    altura = dimensaoJogador.altura;

    return {
        largura: largura,
        altura: altura,
        linha: campo.margemSuperior + ((campo.margemInferior - campo.margemSuperior) / 2) - (altura / 2),
        coluna: posicao == 'esq' ? 10 : campo.margemDireita - largura,
        velocidadeMovimento: 10,
        movimentando: movimento.parado,
        desenhar() {
            contexto.beginPath();
            contexto.rect(this.coluna, this.linha, this.largura, this.altura);
            contexto.fillStyle = 'white';
            contexto.fill();

            if (this.movimentando < 0)
                this.movimentarAcima()
            else if (this.movimentando > 0)
                this.movimentarAbaixo()
        },
        movimentarAcima() {
            if (this.linha > campo.margemSuperior)
                this.linha = this.linha - this.velocidadeMovimento;
        },
        movimentarAbaixo() {
            if (this.linha < campo.margemInferior - this.altura)
                this.linha = this.linha + this.velocidadeMovimento;
        },
        iniciarMovimento(movimentar) {
            this.movimentando = movimentar;
        },
        pararMovimento() {
            this.movimentando = movimento.parar;
        },
        defendeuBolinha(linha) {
            return (linha + dimensaoBolinha.altura >= this.linha && linha <= this.linha + this.altura);
        }
    };
}

function criarBolinha(posicao) {
    largura = dimensaoBolinha.largura;
    altura = dimensaoBolinha.altura;

    return {
        velocidade: 5,
        largura: largura,
        altura: altura,
        linha: campo.margemSuperior + ((campo.margemInferior - campo.margemSuperior) / 2) - (altura / 2),
        coluna: campo.margemEsquerda + (campo.margemDireita / 2) - (largura / 2),
        movimentarLinha: movimento.parado,
        movimentarColuna: movimento.parado,
        desenhar() {
            contexto.beginPath();
            contexto.rect(this.coluna, this.linha, this.largura, this.altura);
            contexto.fillStyle = 'white';
            contexto.fill();
        },
        iniciarMovimento() {
            if (this.movimentarLinha == 0) {
                this.movimentarLinha = gerarMovimentoEntre(-1,1);
                this.movimentarColuna = gerarMovimentoEntre(-1,1);
            }
        },
        pararMovimento() {
            this.velocidade = 0;
        },
        mudarDirecaoLinha() {
            this.movimentarLinha *= -1;
        },
        mudarDirecaoColuna() {
            this.movimentarColuna *= -1;
        },
        atualizar() {
            if (this.velocidade <= 0)
                return;

            if (this.linha <= campo.margemSuperior || this.linha >= (campo.margemInferior - this.altura))
                this.mudarDirecaoLinha();

            if (this.coluna <= campo.margemEsquerda || this.coluna >= campo.margemDireita - this.largura)
                this.mudarDirecaoColuna();

            this.linha += (this.movimentarLinha * this.velocidade);
            this.coluna += (this.movimentarColuna * this.velocidade);

            return;
        },
        tocouMargemEsquerda() {
            const margemEsquerda = campo.margemEsquerda + dimensaoJogador.largura;
            return (this.coluna <= margemEsquerda)
        },
        tocouMargemDireita() {
            const margemDireita = campo.margemDireita - ( dimensaoJogador.largura * 2 );
            return (this.coluna >= margemDireita)
        }
    };
}

const telas = {
    inicio: {
        configurar() {
            objetosDaTela.jogador1 = criarJogador('esq');
            objetosDaTela.jogador2 = criarJogador('dir');
            objetosDaTela.bolinha = criarBolinha();

            mapearTeclasMovimento(objetosDaTela.bolinha, objetosDaTela.jogador1, 'q', 'a');
            mapearTeclasMovimento(objetosDaTela.bolinha, objetosDaTela.jogador2, '[', ']');
            contexto.font = '30px Arial';
            contexto.fillText('qa', 10, 10);
        }
    },
    jogo: {
        // desenharPlacar() {
        //     contexto.setLineDash();
        //     contexto.fillStyle = 'white';
        //     contexto.font = '30px Arial';
        //     contexto.text("Teste", 10, 50);
        // },
        desenhar() {
            contexto.fillStyle = 'black';
            contexto.fillRect(0, 0, canvas.width, canvas.height);

            contexto.beginPath();
            contexto.moveTo(campo.margemEsquerda, campo.margemSuperior - 10);
            contexto.lineTo(campo.margemDireita, campo.margemSuperior - 10);
            contexto.setLineDash([5,5]);
            contexto.strokeStyle = 'white';
            contexto.stroke();

            objetosDaTela.jogador1.desenhar();
            objetosDaTela.jogador2.desenhar();
            objetosDaTela.bolinha.desenhar();

            // this.desenharPlacar();
        },
        atualizar() {
            objetosDaTela.bolinha.atualizar();

            if (objetosDaTela.bolinha.tocouMargemEsquerda()) {
                if (objetosDaTela.jogador1.defendeuBolinha(objetosDaTela.bolinha.linha)) {
                    objetosDaTela.bolinha.mudarDirecaoColuna();
                }
                else
                    objetosDaTela.bolinha.pararMovimento();
            }

            if (objetosDaTela.bolinha.tocouMargemDireita()) {
                if (objetosDaTela.jogador2.defendeuBolinha(objetosDaTela.bolinha.linha)) {
                    objetosDaTela.bolinha.mudarDirecaoColuna();
                }
                else
                    objetosDaTela.bolinha.pararMovimento();
            }
        }
    }
}

function loop() {
    telas.jogo.desenhar();
    telas.jogo.atualizar();

    quadro = quadro + 1;
    requestAnimationFrame(loop);
}

telas.inicio.configurar();
loop();
