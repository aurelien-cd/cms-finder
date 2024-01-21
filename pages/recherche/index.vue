<script setup>
import { ipcRenderer } from 'electron'
import { CardHeader } from '~/components/ui/card';
const {dialog} = window.require('@electron/remote');

const fs = window.require('fs');
const searchResults = ref(null);
const outputFolder = ref(null);

const handleSubmit = (data) => {
  outputFolder.value = data.outputFolder;
  const files = fs.readdirSync(data.library.path);
  const dxfFiles = files.filter((f) => f.endsWith('.dxf'));
  searchResults.value = [];

  data.terms.forEach((element, index) => {
    searchResults.value[index] = {
      found: [],
      notFound: [],
    };
    element.forEach((term) => {
      const found = dxfFiles.filter((f) => f.toLowerCase().includes(term.toLowerCase()));
      if (found.length > 0) {
        searchResults.value[index].found.push(...found);
      } else {
        searchResults.value[index].notFound.push(term + '.dxf');
      }

      found.forEach((f) => {
        const source = `${data.library.path}/${f}`;
        const destination = `${data.outputFolder}/tiroir-${index + 1}/${f}`;

        if (!fs.existsSync(`${data.outputFolder}/tiroir-${index + 1}`)) {
          fs.mkdirSync(`${data.outputFolder}/tiroir-${index + 1}`);
        }

        fs.copyFileSync(source, destination);
      });
    });
  });
}

const reset = () => {
  searchResults.value = null;
}

</script>

<template>
  <div>
    <Header title="Recherche d'outils" description="Rechercher des DXF dans les librairies" />
    <div class="p-8">
     <SearchForm v-if="!searchResults" @submit="handleSubmit" />
     <SearchResult v-if="searchResults" :results="searchResults" @reset="reset" />
    </div>
  </div>
</template>