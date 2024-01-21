<script setup>
import { read, utils, writeFile } from 'xlsx';

const emits = defineEmits(['reset']);
const props = defineProps(['results']);

const modalPrintOpen = ref(false);
const modalDownloadOpen = ref(false);

const download = (full = false) => {
  const workbook = utils.book_new();

  props.results.forEach((result, index) => {

    let max = Math.max(result.found.length, result.notFound.length);
    let jsonResults = [];

    if (full) {
      for(let i = 0; i < max; i++) {
        jsonResults.push({
          "CMS manquants": result.notFound[i] || '',
          "CMS trouvés": result.found[i] || '',
        });
      }
    } else {
      for(let i = 0; i < max; i++) {
        jsonResults.push({
          "CMS manquants": result.notFound[i] || '',
        });
      }
    }

    const worksheet = utils.json_to_sheet(jsonResults);
    worksheet["!cols"] = [ { wch: 16 }, { wch: 16 } ];
    utils.book_append_sheet(workbook, worksheet, `Tiroir ${index + 1}`);
  });

  writeFile(workbook, 'rapport.xlsx', { compression: true });

  modalDownloadOpen.value = false;
}

const printStickers = (onePerPage = true) => {
  const ipcRenderer = require("electron").ipcRenderer;
  ipcRenderer.invoke("printStickers", JSON.stringify(props.results));
}

</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Résultats de la recherche</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="mb-4 text-sm text-slate-500">Les fichiers ont été copiés dans le dossier de sortie.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Tiroir</TableCell>
              <TableCell class="text-center"><Badge>CMS Total</Badge></TableCell>
              <TableCell class="text-center"><Badge variant="outline">CMS trouvés</Badge></TableCell>
              <TableCell class="text-center"><Badge variant="destructive">CMS non trouvés</Badge></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(result, index) in results" :key="index">
              <TableCell>Tiroir {{ index + 1 }}</TableCell>
              <TableCell class="text-center">
                {{ result.found.length + result.notFound.length }}
              </TableCell>
              <TableCell class="text-center">{{ result.found.length }}</TableCell>
              <TableCell class="text-center">{{ result.notFound.length }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div class="flex items-center justify-between">
          <NuxtLink href="/recherche">
            <Button variant="outline" @click="$emit('reset')">
              <Icon name="tabler:refresh" class="w-6 h-6 mr-2" />
              Recommencer
            </Button>
          </NuxtLink>
          <div class="space-x-2">
            <Dialog v-model:open="modalDownloadOpen">
              <DialogTrigger as-child>
                <Button>
                  <Icon name="tabler:download" class="w-6 h-6 mr-2" />
                  Télécharger
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Télécharger le rapport Excel</DialogTitle>
                  <DialogDescription>
                    Que souhaitez-vous inclure dans le rapport ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div class="flex justify-end">
                    <div class="flex flex-col justify-start gap-2">
                      <Button @click="download(true)">Tous les CMS</Button>
                      <Button @click="download(false)">Uniquement les CMS non trouvés</Button>
                      <Button variant="outline" @click="modalDownloadOpen = false">
                        <Icon name="tabler:x" class="w-6 h-6 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog v-model:open="modalPrintOpen">
              <DialogTrigger as-child>
                <Button>
                  <Icon name="tabler:printer" class="w-6 h-6 mr-2" />
                  Imprimer les étiquettes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Imprimer les étiquettes</DialogTitle>
                  <DialogDescription>
                    Voulez-vous lancer l'impression ?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div class="flex justify-end gap-2">
                      <Button variant="outline" @click="modalPrintOpen = false">
                        <Icon name="tabler:x" class="w-6 h-6 mr-2" />
                        Annuler
                      </Button>
                      <Button @click="printStickers">
                        <Icon name="tabler:printer" class="w-6 h-6 mr-2" />
                        Imprimer
                      </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      </CardFooter>
    </Card>
    
  </div>
</template>