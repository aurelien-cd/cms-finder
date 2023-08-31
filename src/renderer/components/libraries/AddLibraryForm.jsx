import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input";
import { Button } from '../ui/button';
import { useToast } from "../ui/use-toast"
import { Icon } from '@iconify/react';

import storage from '../../lib/storage';
import { useEffect } from "react";

const FormSchema = yup.object({
    name: yup.string().required('Veuillez saisir un nom de bibliothèque.'),
    path: yup.string().required('Veuillez sélectionner un dossier de bibliothèque.'),
}).required();

const {dialog} = window.require('@electron/remote');

const AddLibraryForm = ({setOpen, addLibrary}) => {

    const form = useForm({
        resolver: yupResolver(FormSchema),
        defaultValues: {
          name: '',
          path: ''
        }
    })

    const { toast } = useToast()

    const onSubmit = async (data) => {
        addLibrary(data);
        setOpen(false);
        toast({title: 'La bibliothèque a été ajoutée avec succès.'});
    }

    const selectFolder = () => {
        dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory'],
            title: 'Sélectionner un dossier de bibliothèque',
            buttonLabel: 'Sélectionner',
            defaultPath: 'C:\\',
        }).then(result => {
            console.log(result)
            if (!result.canceled) {
                form.setValue('path', result.filePaths[0]);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="path"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Chemin de la bibliothèque</FormLabel>
                            <div className="flex items-center w-full space-x-2">
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" onClick={selectFolder}>
                                    <Icon icon="tabler:folder-open" className='w-4 h-4 mr-2' />
                                    Parcourir
                                </Button>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                <div className="">
                    <Button className="w-full">
                        <Icon icon="tabler:check" className='w-4 h-4 mr-2' />
                        Enregistrer
                    </Button>
                </div>
            </form>
        </Form>
        </>
    )
}

export default AddLibraryForm
