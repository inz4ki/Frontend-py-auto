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
    listarTarefas() {
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
    },
    verErros() {
      this.$router.push({ name: 'dashboard', params: this.tarefa.pk_id_tarefa })
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
                <th>Horário</th>
                <th>Estado</th>
                <th>Data de Execução</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="tarefa in  tarefa" :key="tarefa.pk_id_tarefa"
                :class="{ 'controleTabelas': tarefa.equipe != 'Cobranca' }">
                <th>{{ tarefa.pk_id_tarefa }}</th>
                <td>{{ tarefa.nome_tarefa }}</td>
                <td v-if="tarefa.hora_executar != '00:00:00'">{{ tarefa.hora_executar }}</td>
                <td v-else></td>
                <td>{{ tarefa.estado }}</td>
                <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
                <td>
                  <div class="col-sm-10">
                    <div class=" btn-group diminuir">
                      <router-link class="btn-group link"
                        :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                        <button @submit.prevent="etapas()" type="button"
                          class="btn btn-outline-success btn-sm">Etapas</button>
                      </router-link>
                      <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm"></ModalTarefa>
                      <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn btn-outline-success btn-sm">Clonar
                        Tarefa</button>
                      <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm">
                      </ModalErroCadastro>
                      <router-link class="btn-group link"
                        :to="{ name: 'dashboard tarefa', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                        <button class="btn btn-outline-success btn-sm">Ver
                          Erros</button>
                      </router-link>
                    </div>
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
                <th>Horário</th>
                <th>Estado</th>
                <th>Data de Execução</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="tarefa in  tarefa" :key="tarefa.pk_id_tarefa"
                :class="{ 'controleTabelas': tarefa.equipe != 'Departamento Pessoal' }">
                <th>{{ tarefa.pk_id_tarefa }}</th>
                <td>{{ tarefa.nome_tarefa }}</td>
                <td v-if="tarefa.hora_executar != '00:00:00'">{{ tarefa.hora_executar }}</td>
                <td v-else></td>
                <td>{{ tarefa.estado }}</td>
                <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
                <td>
                  <div class="col-sm-10">
                    <div class=" btn-group diminuir">
                      <router-link class="btn-group link"
                        :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                        <button @submit.prevent="etapas()" type="button"
                          class="btn btn-outline-success btn-sm">Etapas</button>
                      </router-link>
                      <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm"></ModalTarefa>
                      <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn btn-outline-success btn-sm">Clonar
                        Tarefa</button>
                      <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm">
                      </ModalErroCadastro>
                      <router-link class="btn-group link"
                        :to="{ name: 'dashboard tarefa', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                        <button class="btn btn-outline-success btn-sm">Ver
                          Erros</button>
                      </router-link>
                    </div>
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
          <table class="table">
            <thead class="table-dark text-center align-middle">
              <tr>
                <th>Id</th>
                <th>Nome da Tarefa</th>
                <th>Horário</th>
                <th>Estado</th>
                <th>Data de Execução</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="text-center align-middle">
              <tr v-for="tarefa in  tarefa" :key="tarefa.nome_tarefa"
                :class="{ 'controleTabelas': tarefa.equipe != 'Faturamento' }">
                <th>{{ tarefa.pk_id_tarefa }}</th>
                <td>{{ tarefa.nome_tarefa }}</td>
                <td v-if="tarefa.hora_executar != '00:00:00'">{{ tarefa.hora_executar }}</td>
                <td v-else></td>
                <td>{{ tarefa.estado }}</td>
                <td class="text-uppercase fw-bold">{{ tarefa.dia_da_semana }}</td>
                <td>
                  <div class="col-sm-10">
                    <div class=" btn-group diminuir">
                      <router-link class="btn-group link"
                        :to="{ name: 'etapas', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                        <button type="button" class="btn btn-outline-success btn-sm">Etapas
                        </button>
                      </router-link>
                      <ModalTarefa :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm"></ModalTarefa>
                      <button @click="clonarTarefa(tarefa.pk_id_tarefa)" class="btn btn-outline-success btn-sm">Clonar
                        Tarefa</button>
                      <ModalErroCadastro :pk_id_tarefa="tarefa.pk_id_tarefa" variant="outline-success btn-sm">
                      </ModalErroCadastro>
                      <router-link class="btn-group link"
                        :to="{ name: 'dashboard tarefa', params: { pk_id_tarefa: tarefa.pk_id_tarefa } }">
                        <button class="btn btn-outline-success btn-sm">Ver
                          Erros</button>
                      </router-link>
                    </div>
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

.filha {
  display: none;
}

form {
  margin-bottom: 10px;
}

.controleTabelas {
  display: none;
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
</style>

