import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from '../ui/button';
import { Icon } from '@iconify/react';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const FormSchema = yup.object({
    library: yup.string().required("Vous devez sélectionner une librairie."),
    outputFolder: yup.string().required("Veuillez sélectionner un dossier de sortie."),
    searchTerms: yup.string().required("Veuillez saisir au moins une référence CMS."),
})

const {dialog} = window.require('@electron/remote');

const SearchForm = ({libraries, submitHandler}) => {

    const form = useForm({
        resolver: yupResolver(FormSchema),
    })

    const searchTermsCount = form.watch('searchTerms')?.split('\n').filter((term) => term !== '').length;

    const selectFolder = () => {
        dialog.showOpenDialog({
            properties: ['openDirectory', 'createDirectory'],
            title: 'Sélectionner un dossier de sortie',
            buttonLabel: 'Sélectionner',
            defaultPath: 'C:\\',
        }).then(result => {
            if (!result.canceled) {
                form.setValue('outputFolder', result.filePaths[0]);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)} className="grid grid-cols-2 gap-8">
                <div className="space-y-12">
                    <FormField
                        control={form.control}
                        name="library"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Librairie</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {libraries?.map((lib) => (
                                            <SelectItem value={lib.id.toString()} key={lib.id.toString()}>{lib.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="outputFolder"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Dossier de sortie</FormLabel>
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

                    <Button className="w-full">
                        <Icon icon="tabler:search" className='w-4 h-4 mr-2' />
                        Rechercher
                    </Button>
                </div>
                <div>
                <FormField
                    control={form.control}
                    name="searchTerms"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Références CMS</FormLabel>
                        <FormControl>
                            <Textarea
                            rows={12}
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            {searchTermsCount} référence{searchTermsCount > 1 && 's'} CMS saisie{searchTermsCount > 1 && 's'}.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
            </form>
        </Form>
        </>
    )
}

export default SearchForm;
