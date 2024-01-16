<script>
import ModalCadastro from '../components/ModalCadastro.vue'
import ModalHorario from '../components/ModalHorario.vue'
import { http } from '../service/api'
import draggable from 'vuedraggable'
import Cookie from 'js-cookie';

export default {
  components: {
    draggable,
    ModalCadastro,
    ModalHorario

  },
  data() {
    return {
      pk_id_tarefa: this.$route.params.pk_id_tarefa,
      etapas: [],
      dragging: false,
      tarefa: '',
      tarefa_horario: []
    }
  },
  props: ['pk_id_tarefa'],
  mounted() {
    this.listarEtapas();
    http.get(`tarefa/${this.pk_id_tarefa}`,
      http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
    )
      .then(response => {
        this.tarefa = response.data;
      });
    http.get(`TarefaHorario/show/${this.pk_id_tarefa}`).then(response => {
      this.tarefa_horario = response.data;
    })
  },
  methods: {
    listarEtapas() {
      http.get(`etapas/${this.pk_id_tarefa}`,
        http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
      )
        .then(response => {
          this.etapas = response.data;
        });
    },
    deletarEtapa(element) {
      if (confirm('Você deseja realmente Excluir essa Etapa?') == true) {
        http.delete(`etapa/${element.pk_id_etapa}`, { data: element },
          http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
        )
          .then(response => {
            alert("Etapa excluida com sucesso");
            this.listarEtapas();
            return response;
          }).catch((error) => {
            if (error.response.status = 404) {
              alert('Erro ao Excluir');
            }
          })
      } else { }
    },
    atualizarOrdem(e) {
      console.log(e)
      this.etapas.forEach(async (etapas, key) => {

        etapas.ordem = key + 1
        http.put(`editar/etapas`, this.etapas,
          http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
        )
          .then(response => {
            return console.log(response);
          }).catch((error) => {
            if (error.response.status = 404) {
              console.log(error);
            }
          }),
          console.log('terminou');
      })
    },
    voltarPaginaPrincipal() {
      this.$router.push({ name: 'home' })
    },
    async listarHorarios(){
      await http.get(`TarefaHorario/show/${this.pk_id_tarefa}`).then(response => {
        this.tarefa_horario = response.data;
      })
    },
    async reiniciarEstado(horario) {

      await http.patch(`tarefa/reiniciar/${horario.pk_id_horario_tarefas}`, horario.pk_id_horario_tarefas,
        http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
      )
      this.listarHorarios()
    },
    async desativar(horario) {

      await http.patch(`tarefa/desativar/${horario.pk_id_horario_tarefas}`, horario.pk_id_horario_tarefas,
        http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
      )
      this.listarHorarios()
    },
    async deletarTarefa(horario) {
      if (confirm('Você deseja realmente Excluir esse Horario?') == true) {
        await http.delete(`TarefaHorario/${horario.pk_id_horario_tarefas}`, { data: horario },
          http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
        )
          .then(response => {
            alert("Horario excluido com sucesso");
            http.get(`TarefaHorario/show/${this.pk_id_tarefa}`).then(response => {
              this.tarefa_horario = response.data;
            })
            return response;
          }).catch((error) => {
            if (error.response.status = 404) {
              alert('Erro ao Excluir');
            }
          })
      }
    },
  },
}
</script>
<template>
  <div class="col-sm-10">
    <div>
      <button @click="voltarPaginaPrincipal" class="btn btn-success btn-sm float-end">Voltar para as Tarefas</button>
      <h1>{{ tarefa.nome_tarefa }}</h1>
      <hr>
    </div>
    <div>
      <h3>Horários de Execução</h3>
      <hr>
      <table class="table">
        <thead class="table-dark text-center align-middle">
          <tr>
            <th>Horário de Execução</th>
            <th>Estado</th>
            <th>Operações</th>
          </tr>
        </thead>
        <tbody class="text-center align-middle">
          <tr v-for="horario in  tarefa_horario" :key="tarefa_horario.pk_id_horario_tarefas">
            <th>{{ horario.hora_executar }}</th>
            <td>{{ horario.estado }}</td>
            <td>
              <div class="btn-group mr-2">
                <button class="btn btn-sm btn-outline-danger" @click="deletarTarefa(horario)">Excluir Horario</button>
                <button @click="desativar(horario)" class="btn btn-sm btn-outline-warning">Desativar Horario</button>
                <button @click="reiniciarEstado(horario)" class="btn btn-sm btn-outline-primary">Reiniciar Estado</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>
      <div class="row">
        <div class="col-sm-8">
          <h3>Etapas</h3>
        </div>
        <div class="col-sm-4"></div>
      </div>
      <hr>
      <table class="table">
        <thead class="table-dark">
          <tr>
            <th scope="col">Ordem</th>
            <th scope="col">Etapa</th>
            <th scope="col">Ação</th>
            <th scope="col">Tempo de Execução</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <draggable @end="atualizarOrdem" v-model="etapas" tag="tbody" item-key="pk_id_etapa">
          <template #item="{ element, index }" :key="index">
            <tr>
              <td>{{ index + 1 }}</td>
              <td>{{ element.nome_etapa }}</td>
              <td>{{ element.acao }}</td>
              <td>{{ element.tempo_execucao }} segundos</td>
              <td><button class="btn btn-sm btn-danger" @click="deletarEtapa(element)">Deletar Etapa</button>
                <ModalCadastro :pk_id_etapa='element.pk_id_etapa' variant="outline-success btn-sm">
                </ModalCadastro>
              </td>
            </tr>
          </template>
        </draggable>
      </table>
      <div class="border">
        <h2 class="text-center">Operações:</h2>
        <div class="btn-toolbar margem" role="group">
          <div class="btn-group mr-2">
            <ModalCadastro class="row" :pk_id_etapa="-1" variant="outline-success btn-lg"></ModalCadastro>
            <ModalHorario class="row" variant="outline-success btn-lg"></ModalHorario>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
h1 {
  margin-top: 15px;
}

.margem {
  margin-bottom: 30px;
}
</style>