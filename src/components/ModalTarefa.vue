<script>
import { http } from '../service/api'
import Cookie from 'js-cookie';
export default {
    name: 'ModalTarefa',
    props: {
        visible: Boolean,
        variant: String,
        pk_id_tarefa: Number
    },
    data() {
        return {
            OpenClose: this.visible,
            tempTarefa: {
                pk_id_tarefa: -1,
                nome_tarefa: '',
                hora_executar: '',
                dia_da_semana: '',
                estado: 'não executado'
            },
            dias: [],
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
        salvarTarefa() {
            //alterar
            if (this.tempTarefa.pk_id_tarefa != -1) {
                this.tempTarefa.dia_da_semana = this.dias[0]
                if (this.dias[1] != null) {
                    this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.dias[1]
                }
                if (this.dias[2] != null) {
                    this.tempTarefa.dia_da_semana= this.tempTarefa.dia_da_semana + ',' + this.dias[2];
                }
                if (this.dias[3] != null) {
                    this.tempTarefa.dia_da_semana= this.tempTarefa.dia_da_semana + ',' + this.dias[3];
                }
                if (this.dias[4] != null) {
                    this.tempTarefa.dia_da_semana= this.tempTarefa.dia_da_semana + ',' + this.dias[4];
                }
                if (this.dias[5] != null) {
                    this.tempTarefa.dia_da_semana= this.tempTarefa.dia_da_semana + ',' + this.dias[5];
                }
                http.put(`tarefa/atualizar/${this.pk_id_tarefa}`, this.tempTarefa,
                    http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token'),
                ).then(response => {
                    alert("Tarefa Alterada");
                    this.$parent.listarTarefas();
                    this.tempTarefa.nome_tarefa = ''
                    this.tempTarefa.hora_executar = ''
                    this.tempTarefa.dia_da_semana = ''
                    this.dias = []
                    // this.$router.push({name:'etapas', params:{ pk_id_tarefa: tarefa.pk_id_tarefa }})
                })
                    .catch(error => {
                        console.log(error.response.status);
                        if (error.response.status == 500) {
                            console.log('Não Autorizado');
                            alert('Adicione mais informações para Alterar!');
                            this.$parent.listarTarefas();
                            this.tempTarefa.nome_tarefa = ''
                            this.tempTarefa.hora_executar = ''
                            this.dias = []
                        } else {
                            console.log(error);
                            alert('Erro ao Alterar!');
                        }
                    })
            } else {
                var form = ''
                var dia_da_semana = [];
                dia_da_semana.push(this.dias[0]);
                if (this.dias[1] != null) {
                    dia_da_semana.push(this.dias[1]);
                }
                if (this.dias[2] != null) {
                    dia_da_semana.push(this.dias[2]);
                }
                if (this.dias[3] != null) {
                    dia_da_semana.push(this.dias[3]);
                }
                if (this.dias[4] != null) {
                    dia_da_semana.push(this.dias[4]);
                }
                if (this.dias[5] != null) {
                    dia_da_semana.push(this.dias[5]);
                }
                console.log(dia_da_semana);
                form = new FormData()
                form.append('nome_tarefa', this.tempTarefa.nome_tarefa)
                form.append('hora_executar', this.tempTarefa.hora_executar)
                form.append('dia_da_semana', dia_da_semana)
                form.append('estado', this.tempTarefa.estado)
                for (const value of form.values()) {
                    console.log(value);
                }

                http.post(`tarefa/salvar`, form,
                    http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
                ).then(response => {
                    alert("Tarefa Cadastrada")
                    this.$parent.listarTarefas();
                    this.tempTarefa.nome_tarefa = ''
                    this.tempTarefa.hora_executar = ''
                    this.dias = []
                    // this.$router.push({name:'etapas', params:{ pk_id_tarefa: tarefa.pk_id_tarefa }})
                })
                    .catch(error => {
                        console.log(error.response.status);
                        if (error.response.status == 500) {
                            console.log('Não Autorizado');
                            alert('Adicione mais informações para cadastrar!');
                            this.$parent.listarTarefas();
                            this.tempTarefa.nome_tarefa = ''
                            this.tempTarefa.hora_executar = ''
                            this.dias = []
                        } else {
                            console.log(error);
                            alert('Erro ao cadastrar!');
                        }
                    })
            }
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
                    <h1>Registrar Tarefa</h1>
                </div>
                <div class="modal-body">
                    <div class="col-md-12">
                        <div>
                            <label>Nome da Tarefa</label>
                            <input v-model="tempTarefa.nome_tarefa" class="form-control" name="NomeTarefa">
                        </div>
                        <div>
                            <Label>Hora de Execução</Label>
                            <input v-model="tempTarefa.hora_executar" class="form-control" type="time">
                        </div>
                    </div>

                    <div>
                        <div>
                            <label>Escolha o Dia que deve ser executado:</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="dias" class="form-check-input" type="checkbox" id="Segunda" value="seg">
                            <label class="form-check-label" for="Segunda">Seg</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="dias" class="form-check-input" type="checkbox" id="Terça" value="ter">
                            <label class="form-check-label" for="Terça">Ter</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="dias" class="form-check-input" type="checkbox" id="Quarta" value="qua">
                            <label class="form-check-label" for="Quarta">Qua</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="dias" class="form-check-input" type="checkbox" id="Quinta" value="qui">
                            <label class="form-check-label" for="Quinta">Qui</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="dias" class="form-check-input" type="checkbox" id="Sexta" value="sex">
                            <label class="form-check-label" for="Sexta">Sex</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input v-model="dias" class="form-check-input" type="checkbox" id="Sabado" value="sab">
                            <label class="form-check-label" for="Sabado">Sáb</label>
                        </div>
                    </div>
                </div>
                <div class="text-center botao">
                    <button @click="salvarTarefa(), OpenCloseFun()" class="btn btn-primary">Salvar</button>
                </div>
                <div class="modal-footer">
                    <button type="button" @click="OpenCloseFun()" class="btn btn-danger">Fechar</button>
                </div>
            </div>

        </div>
    </div>
    <button v-if="this.pk_id_tarefa != undefined" type="button" @click="OpenCloseFun()"
        :class="'btn btn-' + variant">Alterar Tarefa</button>
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