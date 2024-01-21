<script setup>
import { DialogFooter } from './ui/dialog';


const { ipcRenderer } = require('electron');

const dialogOpen = ref(false);
const downloadProgress = ref(0);
const downloadFinished = ref(false);

ipcRenderer.on('update_available', () => {
  ipcRenderer.removeAllListeners('update_available');
  dialogOpen.value = true;
});

ipcRenderer.on('update_downloaded', () => {
  ipcRenderer.removeAllListeners('update_downloaded');
  dialogOpen.value = true;
  downloadFinished.value = true;
});

ipcRenderer.on('download_progress', (progressObj) => {
  ipcRenderer.removeAllListeners('update_downloaded');
  downloadProgress.value = progressObj.percent;
});

</script>

<template>
    <Dialog v-model:open="dialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mise à jour disponible</DialogTitle>
          <DialogDescription>
            <div v-if="!downloadFinished">Une mise à jour est disponible. Téléchargement en cours...</div>
            <div v-else>La mise à jour a été téléchargée. Voulez-vous redémarrer l'application pour l'installer ?</div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter v-if="downloadFinished">
          <div class="flex justify-end gap-2">
            <Button variant="outline" @click="dialogOpen = false">
              <Icon name="tabler:x" class="w-6 h-6 mr-2" />
              Annuler
            </Button>
            <Button v-if="downloadFinished" @click="ipcRenderer.invoke('restart_app')">
              <Icon name="tabler:refresh" class="w-6 h-6 mr-2" />
              Redémarrer
            </Button>
          </div>
        </DialogFooter>

        <div v-else class="flex items-center gap-2">
            <Progress :model-value="downloadProgress" class="flex-grow" />
            <span>{{ downloadProgress }}%</span>
        </div>
      </DialogContent>
    </Dialog>
  </template>