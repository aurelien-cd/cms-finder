import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../ui/dialog"

import { Button } from '../ui/button';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import AddLibraryForm from "./AddLibraryForm";


const FormDialog = (props) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Icon icon="tabler:plus" className='w-4 h-4 mr-2' />
                        Ajouter
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter une librairie</DialogTitle>
                    </DialogHeader>
                    <AddLibraryForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FormDialog