import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import LibrariesList from "../components/libraries/LibrariesList";
import FormDialog from "../components/libraries/FormDialog";
import { Icon } from '@iconify/react';
import { useLiveQuery } from "dexie-react-hooks";

const ipcRenderer = window.require('electron').ipcRenderer;

function Libraries() {

    const [libraries, setLibraries] = useState([]);

    const addLibrary = (library) => {
        console.log(libraries);
        const newLibraries = [...libraries, library];
        setLibraries(newLibraries);
        ipcRenderer.invoke('setStoreValue', 'libraries', newLibraries);
    }

    const removeLibrary = async (key) => {
        const newLibraries = [];
        libraries.forEach((library, index) => {
            if (index !== key) {
                newLibraries.push(library);
            }
        })
        setLibraries(newLibraries);
        await ipcRenderer.invoke('setStoreValue', 'libraries', newLibraries);
    }

    useEffect(() => {
        const getLibraries = async () => {
            const result = await ipcRenderer.invoke('getStoreValue', 'libraries');
            setLibraries(result || []);
        }

        getLibraries();
    }, [])

  return (
    <>
      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des librairies</h2>
        <LibrariesList libraries={libraries} removeLibrary={removeLibrary} />
        <div className="flex justify-end mt-8">
          <FormDialog addLibrary={addLibrary} />
        </div>

      </div>

      <div className="fixed bottom-0 flex justify-end w-full gap-4 p-4 border-t border-slate-200">
        <Link to='/settings'>
            <Button variant="outline">
                <Icon icon="tabler:arrow-left" className='w-4 h-4 mr-2' />
                Retour
            </Button>
        </Link>
      </div>
    </>
  );
}

export default Libraries;
