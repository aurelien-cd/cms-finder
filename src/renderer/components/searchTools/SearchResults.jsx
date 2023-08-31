import { Icon } from "@iconify/react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button";
import { read, utils, writeFile } from 'xlsx';

const SearchResults = ({results}) => {

    const found = results.filter((result) => result.found).length;
    const notFound = results.filter((result) => !result.found).length;

    const copyToClipboard = () => {
        const text = results.filter((result) => !result.found).map((result) => result.term).join('\n');
        navigator.clipboard.writeText(text);
    }

    const jsonResults = results.map((result) => {
        return {
            'Référence': result.term,
        }
    })

    const download = () => {
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(jsonResults);
        utils.book_append_sheet(workbook, worksheet, "Outils non trouvés");
        writeFile(workbook, 'references_manquantes.xlsx', { compression: true });
    }

    return (
        <Card className="max-w-2xl mx-auto mt-24">
            <CardHeader>
                <CardTitle>Résultats de la recherche</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-start justify-around gap-8 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex p-2 mx-auto bg-gray-100 rounded-full">
                            <Icon icon="tabler:check" className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xl font-bold tracking-tight">{found}</p>
                            <p className="text-sm text-gray-500">Outils trouvés</p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="inline-flex p-2 mx-auto bg-gray-100 rounded-full">
                                <Icon icon="tabler:x" className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="flex-grow">
                                <p className="text-xl font-bold tracking-tight">{notFound}</p>
                                <p className="text-sm text-gray-500">Outils non trouvés</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Button variant="outline" size="xs" onClick={download}>
                                <Icon icon="tabler:download" className='w-4 h-4 mr-2' />
                                Télécharger
                            </Button>
                            <Button variant="outline" size="xs" onClick={copyToClipboard}>
                                <Icon icon="tabler:copy" className='w-4 h-4 mr-2' />
                                Copier
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SearchResults
