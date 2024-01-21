<script setup>
import { ipcRenderer } from 'electron'
const {dialog} = window.require('@electron/remote');
import consola from 'consola'
import path from 'node:path'

const libraries = ref([]);
const dialogOpen = ref(false);

const form = ref({
  name: '',
  path: '',
});

//const result = await ipcRenderer.invoke('getStoreValue', 'libraries');
// if (result) {
  //   libraries.value = result;
  // }
  
  libraries.value = await ipcRenderer.invoke('getStoreValue', 'libraries') || [];
  
  const onSubmit = () => {
    libraries.value.push(form.value);
    ipcRenderer.invoke('setStoreValue', 'libraries', libraries.value.map((l) => {
      return {
        name: l.name,
        path: l.path,
      }
    }));
    dialogOpen.value = false;
  }
  
  const removeLibrary = (index) => {
    libraries.value.splice(index, 1);
    
    ipcRenderer.invoke('setStoreValue', 'libraries', libraries.value.map((l) => {
      return {
        name: l.name,
        path: l.path,
      }
    }));
  }
  
  const selectFolder = () => {
    dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      title: 'Sélectionner un dossier de bibliothèque',
      buttonLabel: 'Sélectionner',
      defaultPath: 'C:\\',
    }).then(result => {
      if (!result.canceled) {
        form.value.name = path.basename(result.filePaths[0]);
        form.value.path = result.filePaths[0];
      }
    }).catch(err => {
      console.log(err)
    })
  }
  
</script>

<template>
  <div>
    <Header title="Bibliothèques" description="Gestion des bibliothèques" />
    <div class="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Liste des bibliothèques</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-row items-center justify-between">
            <div class="flex flex-row items-center gap-4">
              <div class="flex flex-col">
                <span class="text-sm text-slate-600">Nombre de bibliothèques</span>
                <span class="text-2xl font-semibold">{{ libraries.length }}</span>
              </div>
            </div>
            <div class="flex flex-row items-center gap-4">
              <Dialog v-model:open="dialogOpen">
                <form class="w-2/3 space-y-6" @submit="onSubmit">
                  <DialogTrigger as-child>
                    <Button variant="outline">
                      <Icon name="tabler:plus" class="h-6 w-6 mr-2" /> Ajouter
                    </Button>    
                  </DialogTrigger>
                  <DialogContent>
                    
                    <DialogHeader>
                      <DialogTitle>Ajouter une bibliothèque</DialogTitle>
                    </DialogHeader>
                    
                    
                    
                    <div class="grid gap-2">
                      <Label for="name">Dossier</Label>
                      <div class="flex items-center gap-1">
                        <Input type="text" disabled placeholder="Chemin" v-model="form.path" />
                        <Button variant="outline" @click="selectFolder">
                          <Icon name="tabler:folder-open" class="h-6 w-6 mr-2" /> Sélectionner
                        </Button>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="secondary" @click="dialogOpen = false">
                        <Icon name="tabler:x" class="h-6 w-6 mr-2" /> Annuler
                      </Button>
                      <Button type="submit" @click="onSubmit">
                        <Icon name="tabler:check" class="h-6 w-6 mr-2" /> Ajouter
                      </Button>
                    </DialogFooter>
                    
                  </DialogContent>
                </form>
              </Dialog>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]">Nom</TableHead>
                <TableHead>Chemin</TableHead> 
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(library, index) in libraries" :key="index">
                <TableCell className="w-32">{{ library.name }}</TableCell>
                <TableCell>{{ library.path }}</TableCell>
                <TableCell class="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger as-child>
                      <Button size="icon" variant="destructive">
                        <Icon name="tabler:trash" class="h-6 w-6" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Voulez-vous vraiment supprimer cette bibliothèque ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Les fichiers ne seront pas supprimés.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          <Icon name="tabler:x" class="h-6 w-6 mr-2" /> Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction @click="removeLibrary(index)">
                          <Icon name="tabler:check" class="h-6 w-6 mr-2" /> Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    
  </div>
</template>
