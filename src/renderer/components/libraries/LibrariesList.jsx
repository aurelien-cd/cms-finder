import { Icon } from '@iconify/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button } from '../ui/button';

import db from '../../db/db';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from "../ui/use-toast"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';

const LibrariesList = () => {

    const libraries = useLiveQuery(
        async () => {
            const libraries = await db.libraries.toArray();
            return libraries;
        },
        [] 
    );

    const { toast } = useToast()

    const truncate = (str, n) => {
        return (str.length > n) ? str.slice(0, n-1) + '...' : str;
    }

    const removeLibrary = async id => {
        await db.libraries.delete(id)
        toast({title: 'La bibliothèque a été supprimée avec succès.'});
    }

    return (
        <>
            <Card className="mt-8">
                <CardContent className="overflow-auto max-h-72">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Chemin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {libraries?.map((library) => (
                                <TableRow key={library.id}>
                                    <TableCell className="px-4 py-1.5">{library.name}</TableCell>
                                    <TableCell className="px-4 py-1.5">{truncate(library.path, 55)}</TableCell>
                                    <TableCell className="px-4 py-1.5">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="icon" variant="destructive" >
                                                    <Icon icon="tabler:trash" className='w-4 h-4' />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Voulez-vous vraiment supprimer cette librairie ?</DialogTitle>
                                                    <DialogDescription>
                                                        Cela n'effacera pas les fichiers sur le serveur.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Annuler</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => removeLibrary(library.id)}>Supprimer</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

export default LibrariesList;