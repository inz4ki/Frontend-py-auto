<script>
import { http } from '../service/api'
import moment from 'moment'
import { Chart } from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels';
export default {
    data() {
        return {
            pk_id_tarefa: this.$route.params.pk_id_tarefa,
            tarefa_log: [],
            tarefa_log30: [],
            currentSort: 'name',
            currentSortDir: 'asc',
            pageSize: 6,
            currentPage: 1,
            log_erro: [],
            log_sucesso: [],
            log_erro30: [],
            log_sucesso30: [],
            index_erro: '',
            index_sucesso: '',
            index_erro30: '',
            index_sucesso30: '',
        }
    },

    mounted() {
        this.listarLogs();

        setTimeout(() => {
            this.verGraficosErros();
        }, 1000)

        setTimeout(() => {
            this.verGraficosErros30();
        }, 1000)

    },
    methods: {
        listarLogs() {
            if (this.pk_id_tarefa == null) {
                http.get(`log`).then(response => {
                    this.tarefa_log = response.data;
                    this.log_erro = this.tarefa_log.filter(tarefa_log => tarefa_log.status === "Erro")
                    this.log_sucesso = this.tarefa_log.filter(tarefa_log => tarefa_log.status === "Sucesso")
                })
            } else {
                http.get(`log/tarefa/${this.pk_id_tarefa}`).then(response => {
                    this.tarefa_log = response.data;
                    this.log_erro = this.tarefa_log.filter(tarefa_log => tarefa_log.status === "Erro")
                    this.log_sucesso = this.tarefa_log.filter(tarefa_log => tarefa_log.status === "Sucesso")

                    this.index_erro = this.log_erro.length;
                    this.index_sucesso = this.log_sucesso.length;
                })
                http.get(`log/tarefa/dias/${this.pk_id_tarefa}`).then(response => {
                    this.tarefa_log30 = response.data;
                    this.log_erro30 = this.tarefa_log30.filter(tarefa_log30 => tarefa_log30.status === "Erro")
                    this.log_sucesso30 = this.tarefa_log30.filter(tarefa_log30 => tarefa_log30.status === "Sucesso")

                    this.index_erro30 = this.log_erro30.length;
                    this.index_sucesso30 = this.log_sucesso30.length;
                })
            }
        },
        formatDate(date) {
            return moment(date).format('DD/MM/YYYY HH:mm')
        },
        verErro(url) {
            window.open(url, '_blank', 'noreferrer');
        },
        sort: function (s) {
            if (s === this.currentSort) {
                this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            }
            this.currentSort = s;
        },
        nextPage: function () {
            if ((this.currentPage * this.pageSize) < this.log_erro.length) this.currentPage++;
        },
        prevPage: function () {
            if (this.currentPage > 1) this.currentPage--;
        },
        verGraficosErros() {
            const ctx = document.getElementById('myChart');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Sucessos', 'Erros'],
                    datasets: [{
                        label: 'Execuções',
                        data: [this.index_sucesso, this.index_erro],
                        backgroundColor: [
                            'rgba(22,116,0)',
                            'rgba(250,0,0)',
                        ],
                        borderWidth: 0
                    }]
                },
                plugins: [ChartDataLabels],
                options: {
                    plugins: {
                        datalabels: {
                            color: 'white',
                            labels: {
                                title: {
                                    font: {
                                        weight: 'bold',
                                        size: 18
                                    }
                                },
                            },
                            formatter: (value, context) => {
                                return value !== 0 ? value : null;
                            },
                        }
                    }
                }
            });

        },
        verGraficosErros30() {
            const ctx = document.getElementById('myChart30');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Sucessos', 'Erros'],
                    datasets: [{
                        label: 'Execuções',
                        data: [this.index_sucesso30, this.index_erro30],
                        backgroundColor: [
                            'rgba(22,116,0)',
                            'rgba(250,0,0)',
                        ],
                        borderWidth: 0
                    }]
                },
                plugins: [ChartDataLabels],
                options: {
                    plugins: {
                        datalabels: {
                            color: 'white',
                            labels: {
                                title: {
                                    font: {
                                        weight: 'bold',
                                        size: 18
                                    }
                                },

                            },
                            formatter: (value, context) => {
                                return value !== 0 ? value : null;
                            },
                        }
                    }
                }
            });

        }
    },
    computed: {
        sortedtarefa_log: function () {
            return this.log_erro.sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === 'desc') modifier = -1;
                if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
                return 0;
            }).filter((row, index) => {
                let start = (this.currentPage - 1) * this.pageSize;
                let end = this.currentPage * this.pageSize;
                if (index >= start && index < end) return true;
            });
        }
    }
}
</script>
<template>
    <div class="col-sm-10">
        <h1 class="margem">Dashboard de Erros</h1>
        <hr>
        <table class="table">
            <thead class="table-dark text-center align-middle">
                <tr>
                    <th>Id Tarefa</th>
                    <th>Nome da Etapa</th>
                    <th>Data e Hora</th>
                    <th>Imagem do Erro</th>
                </tr>
            </thead>
            <tbody class="text-center align-middle">
                <tr v-for="log_erro in  sortedtarefa_log" :key="log_erro.pk_id_tarefa_log">
                    <th>{{ log_erro.fk_id_tarefa_log }}</th>
                    <td>{{ log_erro.nome_etapa }}</td>
                    <td>{{ formatDate(log_erro.data_hora) }}</td>
                    <td><button @click="verErro('https://apibot.stv.com.br/storage/' + log_erro.caminho)"
                            class="btn btn-danger">Ver Erro</button></td>
                </tr>
            </tbody>
        </table>

        <div class="btn-group text-center">
            <a class="btn btn-outline-dark" @click="prevPage">Anterior</a>
            <a class="btn btn-outline-dark">{{ currentPage }}</a>
            <a class="btn btn-outline-dark" @click="nextPage">Proxímo</a>
        </div>
        <div class="row">
            <div class="margem col-md-6" v-if="this.pk_id_tarefa != null">
                <h3 class="text-center">Todas as Execuções</h3>
                <canvas id="myChart"></canvas>
            </div>
            <div class="margem col-md-6" v-if="this.pk_id_tarefa != null">
                <h3 class="text-center">Execuções nos Ultimos 30 Dias</h3>
                <canvas id="myChart30"></canvas>
            </div>
        </div>
    </div>
</template>
<style scoped>
.margem {
    margin-top: 15px;
    margin-bottom: 20px;
}

form {
    margin-bottom: 10px;
}
</style>