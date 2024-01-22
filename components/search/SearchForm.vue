<script setup>
import { ipcRenderer } from 'electron'
import { CardHeader } from '~/components/ui/card';
const {dialog} = window.require('@electron/remote');
import { defineEmits } from 'vue';
import process from 'node:process';

const emit = defineEmits(['submit']);

const libraries = ref([]);
const library = ref(null);
const tiroirsCount = ref(1);
const outputFolder = ref(null);
const searchTerms = ref([]);
const tiroirActive = ref('1');
const isDev = ref(process.env.VITE_DEV_SERVER_URL);

libraries.value = await ipcRenderer.invoke('getStoreValue', 'libraries') || [];

const setTestData = () => {
    library.value = '0';
    outputFolder.value = '/Users/aurelien/Downloads/output';
    tiroirsCount.value = 2;
    searchTerms.value = [
        '9E37300760\n9T14510123\nccc',
        '9E37300760\n9T14510123\nccc',
    ];
}

const selectFolder = () => {
  dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Sélectionner un dossier de bibliothèque',
    buttonLabel: 'Sélectionner',
    defaultPath: 'C:\\',
  }).then(result => {
    if (!result.canceled) {
        outputFolder.value  = result.filePaths[0];
    }
  }).catch(err => {
    console.log(err)
  })
}

const addTiroir = () => {
  if (tiroirsCount.value >= 10) return;
  tiroirsCount.value++;
}

const removeTiroir = () => {
  if (tiroirsCount.value <= 0) return;
  tiroirsCount.value--;
  searchTerms.value.pop();
  
  if (tiroirsCount.value < tiroirActive.value) {
    tiroirActive.value = tiroirsCount.value.toString();
  }
}

const handleSubmit = () => {
  const terms = searchTerms.value.map((t) => {
    return t.split('\n').filter((t) => t.length > 0);
  });
  
  emit('submit', {
    library: libraries.value[library.value],
    outputFolder: outputFolder.value,
    terms,
  });
}
</script>

<template>
  <div>
    <div class="flex flex-row items-start gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recherche</CardTitle>
            <CardDescription>Effectuer une recherche à partir des CMS</CardDescription>    
          </CardHeader>
          <CardContent class="space-y-8">
            <div class="grid gap-2">
              <Label for="name">Bibliothèque</Label>
              <Select v-model="library">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une bibliothèque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="(lib, index) in libraries" :value="index.toString()">{{ lib.name }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="grid gap-2">
              <Label for="name">Dossier de sortie</Label>
              <div class="flex items-center gap-1">
                <Input type="text" disabled placeholder="Nom de la librairie" v-model="outputFolder" />
                <Button variant="outline" @click="selectFolder" size="icon">
                  <Icon name="tabler:folder-open" class="w-6 h-6" />
                </Button>
              </div>
              <span class="flex items-center gap-1 text-xs text-slate-500">
                <Icon name="tabler:info-circle" class="w-4 h-4" />
                Créer un dossier pour la servante
              </span>
            </div>

            <div class="grid gap-2">
              <Label for="name">Nombre de tiroirs</Label>
              <div class="flex items-center gap-1">
                <Button variant="secondary" @click="removeTiroir()" :disabled="tiroirsCount <= 1">
                  <Icon name="tabler:minus" class="w-6 h-6" />
                </Button>
                <Input type="text" disabled v-model="tiroirsCount" class="w-12" />
                <Button variant="secondary" @click="addTiroir()" :disabled="tiroirsCount >= 10">
                  <Icon name="tabler:plus" class="w-6 h-6" />
                </Button>
              </div>
            </div>
            
            
          </CardContent>
        </Card>
        
        <div class="flex-grow">
          <Tabs default-value="tiroir-1" class="w-full" v-model="tiroirActive">
            <TabsList>
              <TabsTrigger v-for="i in tiroirsCount" :value="i.toString()">
                Tiroir {{ i }}
              </TabsTrigger>
            </TabsList>
            <TabsContent v-for="i in tiroirsCount" :value="i.toString()" :key="'tiroir-'+i.toString()">
              <Card>
                <CardHeader>
                  <CardTitle>Tiroir {{ i }}</CardTitle>
                  <CardDescription>Copier / Coller les références ici. Une référence par ligne.</CardDescription>    
                </CardHeader>
                <CardContent>
                  <Textarea v-model="searchTerms[i - 1]" rows="14" :placeholder="'Contenu du tiroir ' + i" class="text-xs"></Textarea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>  
      </div>
      <div class="flex justify-end py-4">
        <Button :disabled="!library || !outputFolder" @click="handleSubmit()">
          <Icon name="tabler:search" class="w-6 h-6 mr-2" />
          Rechercher
        </Button> 
        <Button v-if="isDev" @click="setTestData()">
          <Icon name="tabler:search" class="w-6 h-6 mr-2" />
          Test
        </Button>
      </div>
  </div>
</template>