<script>
import { http } from '../service/api'
import Cookie from 'js-cookie';
import moment from 'moment'
export default {
    name: 'ModalHorario',
    props: {
        visible: Boolean,
        variant: String,
        pk_id_tarefa: Number
    },
    data() {
        return {
            OpenClose: this.visible,
            fk_id_tarefa_horarios: this.$route.params.pk_id_tarefa,
            hora_executar: '',
        }
    },
    methods: {
        OpenCloseFun() {
            this.OpenClose = !this.OpenClose;
        },
        salvarHorario() {
            //SALVAR
            var form = ''
            form = new FormData()
            form.append('fk_id_tarefa_horarios', this.fk_id_tarefa_horarios)
            form.append('hora_executar', this.hora_executar)
            // for (const value of form.values()) {
            //     console.log(value);
            // }
            http.post(`TarefaHorario/salvar`, form,
                http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
            ).then(response => {
                alert("Horário Cadastrado com Sucesso!")
                this.$parent.listarHorarios();
                this.hora_executar = ''
            })
                .catch(error => {
                    console.log(error.response.status);
                    if (error.response.status == 500) {
                        console.log('Não Autorizado');
                        alert('Problema ao Cadastrar!');
                        this.hora_executar = ''
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
                    <h1>Adicionar Horário</h1>
                </div>
                <div class="modal-body row">
                    <div class="col-md-8">
                        <label>Horário:</label>
                        <input v-model="this.hora_executar" class="form-control" type="time">
                    </div>
                </div>
                <div class="text-center botao">
                    <button @click="salvarHorario(), OpenCloseFun()" class="btn btn-primary">Salvar</button>
                </div>
                <div class="modal-footer">
                    <button type="button" @click="OpenCloseFun()" class="btn btn-danger">Fechar</button>
                </div>
            </div>
        </div>
    </div>
    <button type="button" @click="OpenCloseFun()"
        :class="'btn btn-' + variant">Adicionar Horário</button>
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