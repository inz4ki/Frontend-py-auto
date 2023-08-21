<script>
import ModalTarefa from '../components/ModalTarefa.vue'
import ModalErroCadastro from '../components/ModalErroCadastro.vue'
import { http } from '../service/api'
import Cookie from 'js-cookie';
import moment from 'moment'

export default {
  components: {
    ModalTarefa,
    ModalErroCadastro,
  },
  data() {
    return {
      tarefa: [],
      tempTarefa: {
      }
    }
  },
  mounted() {
    this.listarTarefas()
  },
  methods: {
    etapas() {
      router.push({ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } })
    },
    listarTarefas() {
      // pegando info das vagas da api
      http.get(`tarefas`).then(response => {
        this.tarefa = response.data;
      })
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    async clonarTarefa(pk_id_tarefa) {

      await http.get(`tarefa/${pk_id_tarefa}`).then(response => {
        this.tempTarefa = response.data;
      })

      await http.post(`tarefa/clonar/${pk_id_tarefa}`, this.tempTarefa,
        http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
      ).then(response => {
        this.listarTarefas();
      })
    }
  }
}
</script>

<template>
  <div class="col-sm-10">
    <div class="">
      <h1>Criador de Tarefas</h1>
      <hr>
    </div>
    <table class="table">
      <thead class="table-dark text-center align-middle">
        <tr>
          <th>Id</th>
          <th>Nome da Tarefa</th>
          <th>Horário</th>
          <th>Estado</th>
          <th>Dias Da Semana</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="text-center align-middle">
        <tr v-for="tarefa in  tarefa" :key="tarefa.pk_id_tarefa" :class="{ 'filha': tarefa.dia_da_semana == 'Tarefa Filha'}">
          <th>{{ tarefa.pk_id_tarefa }}</th>
          <td>{{ tarefa.nome_tarefa }}</td>
          <td v-if="tarefa.hora_executar != '00:00:00'">{{ tarefa.hora_executar }}</td>
          <td v-else></td>
          <td>{{ tarefa.estado }}</td>
          <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
          <td>
            <div class="col-sm-10">
              <div class=" btn-group diminuir">
                <router-link class="btn-group" :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                  <button @submit.prevent="etapas()" type="button" class="btn btn-outline-success btn-sm">Etapas</button>
                </router-link>
                <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm"></ModalTarefa>
                <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn btn-outline-success btn-sm">Clonar
                  Tarefa</button>
                  <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm"></ModalErroCadastro>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <form @submit.prevent="listarTarefas()">
      <ModalTarefa variant="success"></ModalTarefa>
    </form>
  </div>
</template>
<style scoped>
h1 {
  margin-top: 15px;
}
.filha{
  background-color: rgb(201, 243, 203);
}
form{
  margin-bottom: 10px;
}
</style>

