<script>
import Cookie from 'js-cookie';
export default {
    methods: {
        logout() {
            Cookie.remove('_usuario_token')
            this.$router.push({ name: 'login' })
        },
        criador() {
            this.$router.push({ name: 'home' })
        },
        dashboard() {
            this.$router.push({ name: 'dashboard' })
        },
        teste() {
            window.open('https://apibot.stv.com.br/storage/executavel/TestebotRPA.exe',
                '_blank',
                'noreferrer');
        },
    }
}
</script>
<template>
    <header>
        <div class="text-center">
            <a class="link navega" @click="criador">Criador de tarefas</a>
            <a class="link navega" @click="dashboard">Dashboard</a>
            <a class="link navega" @click="teste">Testador</a>
            <a class="link float-end" @click="logout">Logout</a>
        </div>
    </header>
    <slot></slot>
    <footer>
    </footer>
</template>
<style scoped>
header {
    height: 100px;
    background-color: #167450;
    padding: 30px;
}

footer {
    height: 100px;
    background-color: black;
}

.link {
    cursor: pointer;
    font-weight: 700;
    font-size: 1.3em;
    text-decoration: none;
    color: white;
}

.link:hover {
    color: rgb(255, 255, 255);
    text-shadow: rgb(36, 71, 48) 3px 3px;
    border-radius: 30px;
}

.navega {
    padding: 10px;
}
</style>