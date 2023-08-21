<script>
import { http } from '../service/api'
import Cookie from 'js-cookie';
import moment from 'moment'
export default {
    name: 'ModalErroCadastro',
    props: {
        visible: Boolean,
        variant: String,
        pk_id_tarefa: Number
    },
    data() {
        return {
            OpenClose: this.visible,
            fk_id_tarefa: this.pk_id_tarefa,
            obstaculo: '',
            acao: '',
        }
    },
    methods: {

        OpenCloseFun() {
            this.OpenClose = !this.OpenClose;
            if (this.pk_id_tarefa != undefined) {
                http.get(`tarefa/${this.pk_id_tarefa}`).then(response => {
                    this.tempTarefa = response.data;
                })
            }
            else { }
        },
        Obstaculo(event) {
            console.log(event);
            this.obstaculo = event.target.files[0];
            console.log(this.obstaculo);
        },
        Acao(event) {
            console.log(event);
            this.acao = event.target.files[0];
            console.log(this.acao);
        },
        salvarErro() {
            //SALVAR
            var form = ''
            form = new FormData()
            form.append('fk_id_tarefa', this.fk_id_tarefa)
            form.append('obstaculo', this.obstaculo)
            form.append('acao', this.acao)
            for (const value of form.values()) {
                console.log(value);
            }
            http.post(`tarefa/obstaculo/salvar`, form,
                http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
            ).then(response => {
                alert("Obstaculo Cadastrado com Sucesso!")
                this.$parent.listarTarefas();
                this.obstaculo = ''
                this.acao = ''
            })
                .catch(error => {
                    console.log(error.response.status);
                    if (error.response.status == 500) {
                        console.log('Não Autorizado');
                        alert('Problema ao Cadastrar!');
                        this.$parent.listarTarefas();
                        this.this.obstaculo = ''
                        this.acao = ''
                    } else {
                        console.log(error);
                        alert('Erro ao cadastrar!');
                    }
                })
        },
    },
    watch: {
        visible: function (newVal, oldVal) {
            this.OpenClose = newVal;
            console.log('new ' + newVal + '==' + oldVal);
        }
    }
}
</script>
<template>
    <div v-if="OpenClose" class="modal fade show" style="display:block" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-modal="true" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content fundo">
                <div class="modal-head">
                    <h1>Registrar Obstaculo de Tarefa</h1>
                </div>
                <div class="modal-body row">
                    <div class="col-md-8">
                        <label>Imagem do Erro:</label>
                        <input class="form-control" type="file" accept="image/png, image/gif, image/jpeg"
                            @change="Obstaculo">
                        <label>Imagem da interação:</label>
                        <input class="form-control" type="file" accept="image/png, image/gif, image/jpeg" @change="Acao">
                    </div>
                </div>
                <div class="text-center botao">
                    <button @click="salvarErro(), OpenCloseFun()" class="btn btn-primary">Salvar</button>
                </div>
                <div class="modal-footer">
                    <button type="button" @click="OpenCloseFun()" class="btn btn-danger">Fechar</button>
                </div>
            </div>

        </div>
    </div>
    <button v-if="this.pk_id_tarefa != undefined" type="button" @click="OpenCloseFun()"
        :class="'btn btn-' + variant">Cadastrar Erro</button>
    <button v-else type="button" @click="OpenCloseFun()" :class="'btn btn-' + variant">Incluir</button>
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