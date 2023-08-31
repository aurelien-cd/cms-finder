import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { Icon } from '@iconify/react';
import { useState } from 'react';

const ConfirmDelete = ({deleteHandler, id}) => {

    const [open, setOpen] = useState(false);

    const deleteLibrary = async (key) => {
        await deleteHandler(key);
        setOpen(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
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
                        <Button variant="destructive" onClick={() => deleteLibrary(id)}>Supprimer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ConfirmDelete
