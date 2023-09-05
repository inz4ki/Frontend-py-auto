<script>
import { http } from '../service/api'
import moment from 'moment'
export default {
    data() {
        return {
            pk_id_tarefa: this.$route.params.pk_id_tarefa,
            tarefa_log: [],
            currentSort: 'name',
            currentSortDir: 'asc',
            pageSize: 8,
            currentPage: 1
        }
    },
    mounted() {
        this.listarLogs();
    },
    methods: {
        listarLogs() {
            if (this.pk_id_tarefa == null) {
                http.get(`log`).then(response => {
                    this.tarefa_log = response.data;
                })
            } else {
                http.get(`log/tarefa/${this.pk_id_tarefa}`).then(response => {
                    this.tarefa_log = response.data;
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
            //if s == current sort, reverse
            if (s === this.currentSort) {
                this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            }
            this.currentSort = s;
        },
        nextPage: function () {
            if ((this.currentPage * this.pageSize) < this.tarefa_log.length) this.currentPage++;
        },
        prevPage: function () {
            if (this.currentPage > 1) this.currentPage--;
        }
    },
    computed: {
        sortedtarefa_log: function () {
            return this.tarefa_log.sort((a, b) => {
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
        <h1>Dashboard de Erros</h1>
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
                <tr v-for="tarefa_log in  sortedtarefa_log" :key="tarefa_log.pk_id_tarefa_log">
                    <th>{{ tarefa_log.fk_id_tarefa_log }}</th>
                    <td>{{ tarefa_log.nome_etapa }}</td>
                    <td>{{ formatDate(tarefa_log.data_hora) }}</td>
                    <td><button @click="verErro('https://apibot.stv.com.br/storage/' + tarefa_log.caminho)"
                            class="btn btn-danger">Ver Erro</button></td>
                </tr>
            </tbody>
        </table>
        <div class="btn-group text-center">
            <a class="btn btn-outline-dark" @click="prevPage">Anterior</a>
            <a class="btn btn-outline-dark">{{ currentPage }}</a>
            <a class="btn btn-outline-dark" @click="nextPage">Proxímo</a>
        </div>
    </div>
</template>
<style scoped>
h1 {
    margin-top: 15px;
}

.diminuir {
    padding: px;
}

form {
    margin-bottom: 10px;
}
</style>