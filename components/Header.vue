<script setup>
    defineProps({
        title: {
            type: String,
            default: 'Default title',
        },
        description: {
            type: String,
            default: 'Default description',
        },
    });
</script>

<template>
    <header class="px-8 py-4 border-b border-slate-200 flex items-center gap-4">
        <NuxtLink href="/">
            <Button variant="secondary">
            <Icon name="tabler:arrow-left" class="mr-2 h-6 w-6" />
            Retour
            </Button>
        </NuxtLink>
        <h1 class="scroll-m-20 text-4xl font-bold tracking-tight">{{ title }}</h1>
    </header>
</template>