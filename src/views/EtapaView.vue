<script>
import ModalCadastro from '../components/ModalCadastro.vue'
import { http } from '../service/api'
import draggable from 'vuedraggable'
import Cookie from 'js-cookie';

export default {
  components: {
    draggable,
    ModalCadastro,

  },
  data() {
    return {
      pk_id_tarefa: this.$route.params.pk_id_tarefa,
      etapas: [],
      dragging: false,
      tarefa: '',
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
    deletarTarefa(tarefa) {
      if (confirm('Você deseja realmente Excluir a Tarefa?') == true) {
        http.delete(`tarefa/${tarefa.pk_id_tarefa}`, { data: tarefa },
          http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
        )
          .then(response => {
            alert("Tarefa excluida com sucesso");
            this.$router.push('/');
            return response;
          }).catch((error) => {
            if (error.response.status = 404) {
              alert('Erro ao Excluir');
            }
          })
      }
      else { }
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
    async reiniciarEstado() {

      await http.patch(`tarefa/reiniciar/${this.pk_id_tarefa}`, this.pk_id_tarefa,
        http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
      )
      this.$router.push({ name: 'home' })
    },
    async desativar() {

      await http.patch(`tarefa/desativar/${this.pk_id_tarefa}`, this.pk_id_tarefa,
        http.defaults.headers.Authorization = 'Bearer ' + Cookie.get('_usuario_token')
      )
      this.$router.push({ name: 'home' })
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

          <button class="btn btn-lg btn-outline-danger" @click="deletarTarefa(tarefa)">Excluir Tarefa</button>
          <button @click="desativar()" class="btn btn-lg btn-outline-warning">Desativar Tarefa</button>
          <button @click="reiniciarEstado()" class="btn btn-lg btn-outline-primary">Reiniciar Estado</button>

          <ModalCadastro class="row" :pk_id_etapa="-1" variant="outline-success btn-lg">
          </ModalCadastro>

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