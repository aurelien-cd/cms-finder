<script setup>

const { app }  = window.require('@electron/remote');
const version = app.getVersion();

</script>

<template>
  <Updater />
  <div class="flex flex-col h-full gap-8 mt-8">
    <div class="flex flex-col items-center justify-center">
      <img src="/logo.svg" class="w-64" />
      <span class="">Version : {{ version }}</span>
    </div>
    <div class="flex flex-row items-center justify-center gap-8">
      <NuxtLink href="/libraries">
        <div class="flex flex-col items-center w-48 h-48 gap-8 p-4 border border-transparent rounded-lg bg-slate-100 hover:border-slate-900">
          <Icon name="tabler:folder" class="w-16 h-16" />
          <span class="text-xl font-semibold text-center">Librairies</span>
        </div>
      </NuxtLink>

      <NuxtLink href="/recherche">
        <div class="flex flex-col items-center w-48 h-48 gap-8 p-4 border border-transparent rounded-lg bg-slate-100 hover:border-slate-900">
          <Icon name="tabler:search" class="w-16 h-16" />
          <span class="text-xl font-semibold text-center">Recherche d'outils</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
