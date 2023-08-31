import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Icon } from '@iconify/react';
import SearchForm from '../components/searchTools/SearchForm';
import SearchResults from '../components/searchTools/SearchResults';
import db from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import ProgressBar from '../components/searchTools/ProgressBar';

const fs = window.require('fs');
const path = window.require('path');

const Search = () => {
    const [progress, setProgress] = useState(0);
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const showForm = !searching && searchResults.length === 0;

    const libraries = useLiveQuery(
        async () => {
            const libraries = await db.libraries.toArray();
            return libraries;
        },
        []
    );

    const reset = () => {
        setSearchResults([]);
        setProgress(0);
    }

    function handleSubmit(data) {
        setSearching(true);
        const searchTerms = data.searchTerms.split('\n').filter((term) => term !== '');
        const library = libraries.find((lib) => lib.id === parseInt(data.library));

        const files = fs.readdirSync(library.path);

        setSearchResults([]);

        searchTerms.forEach((term, index) => {
            const searchResult = files.find((file) => file.includes(term + '.dxf'));
            if (searchResult) {
                fs.copyFileSync(library.path + path.sep + searchResult, data.outputFolder + path.sep + searchResult);
                setSearchResults((searchResults) => [...searchResults, {
                    term: term,
                    found: true,
                }]);
            } else {
                setSearchResults((searchResults) => [...searchResults, {
                    term: term,
                    found: false,
                }]);
            }
            setProgress((index + 1) / searchTerms.length * 100);
        })

        setSearching(false);
    }

    return (
        <>
            <div className="px-6 py-8">
                <h2 className="mb-8 text-3xl font-bold tracking-tight">Recherche d'outils</h2>
                {showForm && <SearchForm libraries={libraries} submitHandler={handleSubmit} />}
                {searching && <ProgressBar progress={progress} />}
                {searchResults.length > 0 && <SearchResults results={searchResults} />}
            </div>

            <div className="fixed bottom-0 z-10 flex justify-end w-full gap-4 p-4 bg-white border-t shadow border-slate-200">
                <Link to='/'>
                    <Button variant="outline">
                        <Icon icon="tabler:arrow-left" className='w-4 h-4 mr-2' />
                        Retour
                    </Button>
                </Link>
                {searchResults.length > 0 && <Button onClick={reset}>
                    <Icon icon="tabler:plus" className='w-4 h-4 mr-2' />
                    Nouvelle recherche
                </Button>}
            </div>

        </>
    )
}

export default Search;
