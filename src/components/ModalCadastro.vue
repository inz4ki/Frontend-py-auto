<script>
import { http } from '../service/api'
import Cookie from 'js-cookie';


export default {
  name: 'ModalCadastro',
  props: {
    visible: Boolean,
    variant: String,
    pk_id_etapa: Number
  },
  data() {
    return {
      OpenClose: this.visible,
      tempEtapa: {
        nome_etapa: '',
        acao: '',
        tempo_execucao: '',
        digitar: '',
        ordem: '',
        atalho1: '',
        atalho2: '',
        atalho3: '',
        fk_id_tarefa: this.$parent.pk_id_tarefa,
      },
      file: '',
      numeroTeclas: 0
    }
  },
  methods: {
    OpenCloseFun() {
      this.OpenClose = !this.OpenClose;
      
      if (this.pk_id_etapa != -1) {
        http.get(`etapa/${this.pk_id_etapa}`).then(response => {
          this.tempEtapa = response.data;
        })
      }
      else {}
    },
    salvarEtapa() {
      //ALTERAR
      if (this.pk_id_etapa != -1) {
        console.log('entrou no alterar');
        var form = ''
        var teclas = [];
        teclas.push(this.tempEtapa.atalho1);
        if (this.tempEtapa.atalho2 != '') {
          teclas.push(this.tempEtapa.atalho2);
        }
        if (this.tempEtapa.atalho3 != '') {
          teclas.push(this.tempEtapa.atalho3);
        }
        form = new FormData()
        form.append('fk_id_tarefa', this.tempEtapa.fk_id_tarefa)
        form.append('nome_etapa', this.tempEtapa.nome_etapa)
        form.append('acao', this.tempEtapa.acao)
        form.append('tempo_execucao', this.tempEtapa.tempo_execucao)
        form.append('digitar', this.tempEtapa.digitar)
        form.append('atalho', teclas)
        form.append('imagem', this.file)

        for (const value of form.values()) {
          console.log(value);
        }

        http.post(`editar/etapa/${this.pk_id_etapa}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },

        },
          http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
        ).then((response) => {
          alert("Etapa Editada")
          console.log(response)
          this.tempEtapa.nome_etapa = ''
          this.tempEtapa.acao = ''
          this.tempEtapa.tempo_execucao = ''
          this.tempEtapa.digitar = ''
          this.tempEtapa.arquivo = ''
          this.tempEtapa.atalho1 = ''
          this.tempEtapa.atalho2 = ''
          this.tempEtapa.atalho3 = ''
          teclas = [];
          this.numeroTeclas = 0
          this.OpenCloseFun()
          location.reload();
        })
      }else{
        //SALVAR
        var form = ''
        var teclas = [];
        teclas.push(this.tempEtapa.atalho1);
        if (this.tempEtapa.atalho2 != '') {
          teclas.push(this.tempEtapa.atalho2);
        }
        if (this.tempEtapa.atalho3 != '') {
          teclas.push(this.tempEtapa.atalho3);
        }
        this.tempEtapa.ordem = this.$parent.etapas.length
        form = new FormData()
        form.append('fk_id_tarefa', this.tempEtapa.fk_id_tarefa)
        form.append('ordem', this.tempEtapa.ordem + 1)
        form.append('nome_etapa', this.tempEtapa.nome_etapa)
        form.append('acao', this.tempEtapa.acao)
        form.append('tempo_execucao', this.tempEtapa.tempo_execucao)
        form.append('digitar', this.tempEtapa.digitar)
        form.append('atalho', teclas)
        form.append('imagem', this.file)

        for (const value of form.values()) {
          console.log(value);
        }

        http.post(`etapa/salvar`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },

        },
          http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
        ).then((response) => {
          alert("Etapa Cadastrada")
          console.log(response)
          this.tempEtapa.nome_etapa = ''
          this.tempEtapa.acao = ''
          this.tempEtapa.tempo_execucao = ''
          this.tempEtapa.digitar = ''
          this.tempEtapa.arquivo = ''
          this.tempEtapa.atalho1 = ''
          this.tempEtapa.atalho2 = ''
          this.tempEtapa.atalho3 = ''
          this.tempEtapa.ordem = this.$parent.etapas.length
          teclas = [];
          this.numeroTeclas = 0
          this.OpenCloseFun()
          this.$parent.listarEtapas();
        }) 
      }
     
    },
    novoArquivo(event) {
      console.log(event);
      this.file = event.target.files[0];
      console.log(this.file);
    },
    adicionar() {
      this.numeroTeclas++;
      if (this.numeroTeclas >= 3) {
        alert('Número maxímo de teclas atingido');
        this.numeroTeclas = 3
      }
    },
  },
  watch: {
    visible: function (newVal, oldVal) {
      this.OpenClose = newVal;
      console.log('new ' + newVal + '==' + oldVal);
    }
  },
}
</script>
<template>
  <div v-if="OpenClose" class="modal fade show" style="display:block" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-modal="true" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content fundo">
        <div class="modal-head">
          <h1>Criar Etapa</h1>
        </div>
        <div class="modal-body">
          <div class="col-md-12">
            <div>
              <label>Nome da Etapa:</label>
              <input v-model="tempEtapa.nome_etapa" class="form-control" name="nome">
            </div>
            <label>Ação que gostaria de Fazer:</label>
            <div>
              <select v-model="tempEtapa.acao" class="form-select">
                <option value="clicar">Clicar</option>
                <option value="clicar 2x">Clicar 2X</option>
                <option value="digitar">Clicar e Digitar</option>
                <option value="clicar com direito">Clicar com o Botão Direito do Mouse</option>
                <option value="atalho">Utilizar Tecla de Atalho</option>
                <option value="executar app">Executar Aplicativo</option>
                <option value="renomear arquivo">Renomear Arquivo</option>
                <option value="fechar app">Fechar Aplicativo</option>
              </select>
            </div>
            <div v-if="tempEtapa.acao != 'atalho'">
            </div>
            <div v-else>
              <div class="row">
                <label>Qual atalho?</label>

                <div>
                  <select v-model="tempEtapa.atalho1" class="form-select">
                    <option value="ctrl">Control(Ctrl)</option>
                    <option value="shift">Shift(↑)</option>
                    <option value="tab">Tab(⇄)</option>
                    <option value="enter">Enter</option>
                    <option value="esc">Esc</option>
                    <option value="alt">Alt</option>
                    <option value="win">Tecla Windows</option>
                    <option value="f1">F1</option>
                    <option value="f2">F2</option>
                    <option value="f3">F3</option>
                    <option value="f4">F4</option>
                    <option value="f5">F5</option>
                    <option value="f6">F6</option>
                    <option value="f7">F7</option>
                    <option value="f8">F8</option>
                    <option value="f9">F9</option>
                    <option value="f10">F10</option>
                    <option value="f11">F11</option>
                    <option value="f12">F12</option>
                  </select>
                  <div v-if="numeroTeclas >= 1">
                    <label>+</label>
                    <input v-model="tempEtapa.atalho2" type="text" class="form-control keyboard">
                  </div>
                  <div v-else></div>
                  <div v-if="numeroTeclas >= 2">
                    <label>+</label>
                    <input v-model="tempEtapa.atalho3" type="text" class="form-control ">
                  </div>
                  <div v-else></div>
                  <button class="btn btn-success" @click="adicionar()">+</button>
                </div>
              </div>
            </div>
            <div v-if="tempEtapa.acao != 'digitar' && tempEtapa.acao != 'executar app' && tempEtapa.acao != 'renomear arquivo' && tempEtapa.acao != 'fechar app'">
            </div>
            <div v-else>
              <label v-if="tempEtapa.acao != 'executar app'">O que deve ser digitado?</label>
              <label v-else>Digite o Caminho do Arquivo Executavel</label>
              <div>
                <input v-model="tempEtapa.digitar" type="text" class="form-control">
              </div>
            </div>

            <div>
              <label>Print do item que você gostaria de interagir:</label>
              <input class="form-control" type="file" accept="image/png, image/gif, image/jpeg" @change="novoArquivo">
            </div>
            <div>
              <label>Tempo para Executar:</label>
              <select v-model="tempEtapa.tempo_execucao" class="form-select">
                <option value="5">5 Segundos</option>
                <option value="10">10 Segundos</option>
                <option value="15">15 Segundos</option>
                <option value="20">20 Segundos</option>
                <option value="25">25 Segundos</option>
                <option value="30">30 Segundos</option>
                <option value="35">35 Segundos</option>
              </select>
            </div>
          </div>
          <div class="text-center botao">
            <button @click="salvarEtapa" class="btn btn-success">Salvar</button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="OpenCloseFun()" :class="'btn btn-danger'">Fechar</button>
        </div>
      </div>
    </div>
  </div>
  <button v-if="this.pk_id_etapa != -1" type="button" @click="OpenCloseFun()" :class="'btn btn-' + variant">Alterar</button>
  <button v-else type="button" @click="OpenCloseFun()" :class="'btn btn-' + variant">Incluir Etapa</button>
</template>
<style scoped>
label {
  margin-top: 10px;
}

.botao {
  margin-top: 10px;
}

.fundo {
  background-color: rgb(224, 224, 224);
  border: 2px solid black;
}
</style>