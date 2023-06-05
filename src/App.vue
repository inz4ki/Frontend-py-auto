
<script>
import RouterView from "./router";
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";
export default {
  setup() {
    const DefaultLayout = 'default';
    const { currentRoute } = useRouter();

    const layout = computed(
      () => `${currentRoute.value.meta.layout}-layout`
    )
    return {
      layout,
    }
  }
}
</script>
<template>
  <component :is="layout">
    <main>
      <router-view />
    </main>
  </component>
</template>

<style>
* {
  margin: 0 auto;
  padding: 0 auto;
}

main {
  width: 90vw;
  margin: 0 auto;
  min-height: calc(100vh - 115px - 100px);
}
</style>
