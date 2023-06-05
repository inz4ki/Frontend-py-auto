<script>
import { http } from '../service/api'
import Cookie from 'js-cookie';
export default {
    data() {
        return {
            cpf: '',
            senha: '',
            id: ''
        }
    },
    methods: {
        submitUsuario() {
            http.post(`usuarios/login`,
                {
                    cpf: this.cpf,
                    senha: this.senha,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'application/json'
                    }
                })
                .then(response => {
                    if (response.status == 200) {
                        console.log(response.status);
                        Cookie.set('id', response.data.id);
                        Cookie.set('_usuario_token', response.data._usuario_token);
                        this.$router.push('/');
                        // localStorage.setItem('user', JSON.stringify(response.data));
                    }
                }).catch((error) => {
                    console.log(error.response.status);
                    if (error.response.status == 401) {
                        console.log('Não Autorizado');
                        alert('Usuario ou senha incorretos');
                    } else {
                        console.log('Outros Erros Status!');
                        alert('Digite um cpf valido');
                    }
                })
        }
    }
}
</script>
<template>
    <div class="text-center col-md-3 espaco">
        <div class="text-center row ">
            <h2>Login</h2>
            <form @submit.prevent="submitUsuario">
                <div class="row espaco">
                    <input v-model="cpf" class="form-control" type="text" placeholder="cpf">
                </div>
                <div class="row espaco">
                    <input v-model="senha" class="form-control" type="password" placeholder="Senha">
                </div>
                <div class="row espaco">
                    <Button class="btn btn-primary btn-lg">Acessar</Button>
                </div>
                <div class="row espaco">
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
.espaco {
    margin-top: 20px;
}

h2 {
    margin-top: 100px;
}
</style>