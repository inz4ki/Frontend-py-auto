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
      },
      abrirColapsavelID: null,

    }
  },
  mounted() {
    this.listarTarefas()
  },
  methods: {
    listarTarefas() {
      http.get(`tarefas`).then(response => {
        this.tarefa = response.data;
      })
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    async clonarTarefa(pk_id_tarefa) {
      if (confirm('Você deseja realmente Duplicar essa Tarefa?') == true) {
        await http.get(`tarefa/${pk_id_tarefa}`).then(response => {
          this.tempTarefa = response.data;
        })

        await http.post(`tarefa/clonar/${pk_id_tarefa}`, this.tempTarefa,
          http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
        ).then(response => {
          this.listarTarefas();
        })
      }
    },
    verErros() {
      this.$router.push({ name: 'dashboard', params: this.tarefa.pk_id_tarefa })
    },
    abrir(tarefaId) {
      if (this.verificaAberto(tarefaId)) {
        this.abrirColapsavelID = null; // Close if already open
      } else {
        this.abrirColapsavelID = tarefaId;
      }
    },
    verificaAberto(tarefaId) {
      return this.abrirColapsavelID === tarefaId;
    },
  }
}
</script>
<template>
  <div class="col-sm-10">
    <div class="">
      <h1>Criador de Tarefas</h1>
      <hr>
    </div>
    <!-- COBRANCA -->
    <div>
      <div class="row">
        <div class="equipes fw-bold " data-bs-toggle="collapse" href="#Cobranca" role="button" aria-expanded="false"
          aria-controls="Cobranca">
          COBRANÇA
        </div>
      </div>
      <div class="collapse" id="Cobranca">
        <div class="card card-body">
          <table class="table">
            <thead class="table-dark text-center align-middle">
              <tr>
                <th>Id</th>
                <th>Nome da Tarefa</th>
                <th>Data de Execução</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="tarefa in  tarefa" :key="tarefa.pk_id_tarefa"
                :class="{ 'controleTabelas': tarefa.equipe != 'Cobranca' }">
                <th>{{ tarefa.pk_id_tarefa }}</th>
                <td>{{ tarefa.nome_tarefa }}</td>
                <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
                <td>
                  <a class="btn btn-outline-success" @click="abrir(tarefa.pk_id_tarefa)">Ações ▼</a>
                  <div :class="['collapse', { 'show': verificaAberto(tarefa.pk_id_tarefa) }]"
                    :id="'collapseExample_' + tarefa.pk_id_tarefa">
                    <ul class="list-unstyled">
                      <li>
                        <router-link class="link justify-content-start"
                          :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button @submit.prevent="etapas()" type="button" class="btn ">Etapas</button>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="link"
                          :to="{ name: 'dashboard tarefa', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button class="btn">Ver Erros</button>
                        </router-link>
                      </li>
                      <li>
                        <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="">
                        </ModalErroCadastro>
                      </li>
                      <li>
                        <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant=""></ModalTarefa>
                      </li>
                      <li>
                        <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn ">Clonar
                          Tarefa</button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Departamento Pessoal -->
    <div>
      <div class="row">
        <div class="equipes fw-bold" data-bs-toggle="collapse" href="#DepartamentoPessoal" role="button"
          aria-expanded="false" aria-controls="DepartamentoPessoal">
          DEPARTAMENTO PESSOAL
        </div>
      </div>
      <div class="collapse" id="DepartamentoPessoal">
        <div class="card card-body">
          <table class="table">
            <thead class="table-dark text-center align-middle">
              <tr>
                <th>Id</th>
                <th>Nome da Tarefa</th>
                <th>Data de Execução</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="tarefa in  tarefa" :key="tarefa.pk_id_tarefa"
                :class="{ 'controleTabelas': tarefa.equipe != 'Departamento Pessoal' }">
                <th>{{ tarefa.pk_id_tarefa }}</th>
                <td>{{ tarefa.nome_tarefa }}</td>
                <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
                <td>
                  <a class="btn btn-outline-success" @click="abrir(tarefa.pk_id_tarefa)">Ações ▼</a>
                  <div :class="['collapse', { 'show': verificaAberto(tarefa.pk_id_tarefa) }]"
                    :id="'collapseExample_' + tarefa.pk_id_tarefa">
                    <ul class="list-unstyled">
                      <li>
                        <router-link class="link justify-content-start"
                          :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button @submit.prevent="etapas()" type="button" class="btn ">Etapas</button>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="link"
                          :to="{ name: 'dashboard tarefa', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button class="btn">Ver Erros</button>
                        </router-link>
                      </li>
                      <li>
                        <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="">
                        </ModalErroCadastro>
                      </li>
                      <li>
                        <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant=""></ModalTarefa>
                      </li>
                      <li>
                        <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn ">Clonar
                          Tarefa</button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Faturamento -->
    <div>
      <div class="row">
        <div class="equipes fw-bold" data-bs-toggle="collapse" href="#Faturamento" role="button" aria-expanded="false"
          aria-controls="Faturamento">
          FATURAMENTO
        </div>
      </div>
      <div class="collapse" id="Faturamento">
        <div class="card card-body">
          <table class="table ">
            <thead class="table-dark text-center align-middle">
              <tr>
                <th>Id</th>
                <th>Nome da Tarefa</th>
                <th>Data de Execução</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="tarefa in  tarefa" :key="tarefa.nome_tarefa"
                :class="{ 'controleTabelas': tarefa.equipe != 'Faturamento' }">
                <th>{{ tarefa.pk_id_tarefa }}</th>
                <td>{{ tarefa.nome_tarefa }}</td>
                <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
                <td>
                  <a class="btn btn-outline-success" @click="abrir(tarefa.pk_id_tarefa)">Ações ▼</a>
                  <div :class="['collapse', { 'show': verificaAberto(tarefa.pk_id_tarefa) }]"
                    :id="'collapseExample_' + tarefa.pk_id_tarefa">
                    <ul class="list-unstyled">
                      <li>
                        <router-link class="link justify-content-start"
                          :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button @submit.prevent="etapas()" type="button" class="btn ">Etapas</button>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="link"
                          :to="{ name: 'dashboard tarefa', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button class="btn">Ver Erros</button>
                        </router-link>
                      </li>
                      <li>
                        <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="">
                        </ModalErroCadastro>
                      </li>
                      <li>
                        <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant=""></ModalTarefa>
                      </li>
                      <li>
                        <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn ">Clonar
                          Tarefa</button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- TI -->
    <div>
      <div class="row">
        <div class="equipes fw-bold" data-bs-toggle="collapse" href="#TI" role="button" aria-expanded="false"
          aria-controls="TI">
          TI
        </div>
      </div>
      <div class="collapse" id="TI">
        <div class="card card-body">
          <table class="table">
            <thead class="table-dark text-center align-middle">
              <tr>
                <th>Id</th>
                <th>Nome da Tarefa</th>
                <th>Data de Execução</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="tarefa in  tarefa" :key="tarefa.nome_tarefa"
                :class="{ 'controleTabelas': tarefa.equipe != 'TI' }">
                <th>{{ tarefa.pk_id_tarefa }}</th>
                <td>{{ tarefa.nome_tarefa }}</td>
                <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
                <td>
                  <a class="btn btn-outline-success" @click="abrir(tarefa.pk_id_tarefa)">Ações ▼</a>
                  <div :class="['collapse', { 'show': verificaAberto(tarefa.pk_id_tarefa) }]"
                    :id="'collapseExample_' + tarefa.pk_id_tarefa">
                    <ul class="list-unstyled">
                      <li>
                        <router-link class="link justify-content-start"
                          :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button @submit.prevent="etapas()" type="button" class="btn ">Etapas</button>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="link"
                          :to="{ name: 'dashboard tarefa', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                          <button class="btn">Ver Erros</button>
                        </router-link>
                      </li>
                      <li>
                        <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="">
                        </ModalErroCadastro>
                      </li>
                      <li>
                        <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant=""></ModalTarefa>
                      </li>
                      <li>
                        <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn ">Clonar
                          Tarefa</button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <form @submit.prevent="listarTarefas()">
      <ModalTarefa variant="success"></ModalTarefa>
    </form>
  </div>
</template>
<style scoped>
h1 {
  margin-top: 15px;
  font-weight: 700;
}
.filha,
.controleTabelas {
  display: none;
}
form {
  margin-bottom: 10px;
}
.equipes {
  height: 60px;
  text-align: center;
  background-color: #3a603e;
  color: #ffff;
  margin: 15px 0 15px 0;
  padding-top: 16px;
  transition: 0.8s;
}
.equipes:hover {
  text-shadow: rgb(36, 71, 48) 3px 3px;
  background-color: #0a7a15;
  color: #ffffff;
}
.link {
  text-decoration: none;
}

ul li {
  margin: 1px;
  border: solid green 1px;
  border-radius: 15px;
}

ul li:hover {
  background-color: rgb(122, 240, 122);
}
</style>