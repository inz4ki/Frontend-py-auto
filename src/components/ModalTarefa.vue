<script>
import { http } from '../service/api'
import Cookie from 'js-cookie';
import moment from 'moment'
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
                hora_executar: 0,
                dia_da_semana: '',
                equipe:'',
                estado: 'não executado'
            },
            dias: [],
            diaMes: ''
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
                if (this.tempTarefa.dia_da_semana === 'Semanal') {
                    this.tempTarefa.dia_da_semana = this.dias[0]
                    if (this.dias[1] != null) {
                        this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.dias[1]
                    }
                    if (this.dias[2] != null) {
                        this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.dias[2];
                    }
                    if (this.dias[3] != null) {
                        this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.dias[3];
                    }
                    if (this.dias[4] != null) {
                        this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.dias[4];
                    }
                    if (this.dias[5] != null) {
                        this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.dias[5];
                    }
                }
                if (this.tempTarefa.dia_da_semana === 'Mensal') {
                    this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.diaMes
                }
                if (this.tempTarefa.dia_da_semana === 'Trimestral') {
                    this.diaMes = moment(this.diaMes).format('DD/MM/YYYY')
                    this.tempTarefa.dia_da_semana = this.diaMes
                }
                if (this.tempTarefa.dia_da_semana === 'Tarefa Filha') {
                    this.tempTarefa.hora_executar = '00:00:00'
                }


                http.put(`tarefa/atualizar/${this.pk_id_tarefa}`, this.tempTarefa,
                    http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token'),
                ).then(response => {
                    alert("Tarefa Alterada");
                    this.$parent.listarTarefas();
                    this.tempTarefa.nome_tarefa = ''
                    this.tempTarefa.hora_executar = ''
                    this.tempTarefa.dia_da_semana = ''
                    this.tempTarefa.equipe = ''
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
                //SALVAR
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
                form.append('equipe', this.tempTarefa.equipe)

                if (this.tempTarefa.dia_da_semana === 'Semanal') {
                    form.append('dia_da_semana', dia_da_semana)
                } else {
                    if (this.tempTarefa.dia_da_semana === 'Mensal') {
                        this.tempTarefa.dia_da_semana = this.tempTarefa.dia_da_semana + ',' + this.diaMes
                    }
                    if (this.tempTarefa.dia_da_semana === 'Trimestral') {
                        this.diaMes = moment(this.diaMes).format('DD/MM/YYYY')
                        this.tempTarefa.dia_da_semana = this.diaMes
                    }
                    if (this.tempTarefa.dia_da_semana === 'Tarefa Filha') {
                        this.tempTarefa.hora_executar = moment().format('hh:mm:ss')

                    }
                    form.append('dia_da_semana', this.tempTarefa.dia_da_semana)
                }

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
                    this.tempTarefa.dia_da_semana = ''
                    this.tempTarefa.equipe = ''
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
                            this.tempTarefa.dia_da_semana = ''
                            this.dias = []
                            this.tempTarefa.equipe = ''
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
                <div class="modal-body row">
                    <div class="col-md-8">
                        <div>
                            <label>Nome da Tarefa</label>
                            <input v-model="tempTarefa.nome_tarefa" class="form-control" name="NomeTarefa">
                        </div>
                        <div>
                            <Label>Dia da Execução</Label>
                            <select v-model="tempTarefa.dia_da_semana" class="form-select">
                                <option value="Semanal">Semanal</option>
                                <option value="Mensal">Mensal</option>
                                <option value="Trimestral">Trimestral</option>
                                <option value="Tarefa Filha">Tarefa Filha</option>
                            </select>
                        </div>
                        <div v-if="tempTarefa.dia_da_semana === 'Semanal'">
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
                        <div v-if="tempTarefa.dia_da_semana === 'Mensal'">
                            <div>
                                <label>Data de Inicio : </label>
                                <select v-model="diaMes" class="form-select">
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                    <option value="31">31</option>
                                    <option value="Ultimo">Ultimo dia do Mês</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="tempTarefa.dia_da_semana === 'Trimestral'">
                            <label>Escolha a Data de Inicio : </label>
                            <input class="form-control" v-model="diaMes" type="date">
                        </div>
                        <div v-if="tempTarefa.dia_da_semana !== 'Tarefa Filha'">
                            <Label>Hora de Execução</Label>
                            <input v-model="tempTarefa.hora_executar" class="form-control" type="time">
                        </div>
                        <div>
                            <Label>Selecione a Equipe</Label>
                            <select v-model="tempTarefa.equipe" class="form-select">
                                <option value="Cobranca">Cobrança</option>
                                <option value="Departamento Pessoal">Departamento Pessoal</option>
                                <option value="Faturamento">Faturamento</option>
                            </select>
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