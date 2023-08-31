import { Icon } from '@iconify/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button } from '../ui/button';
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
import ConfirmDelete from './ConfirmDelete';

const ipcRenderer = window.require('electron').ipcRenderer;

const LibrariesList = ({libraries, removeLibrary}) => {

    const { toast } = useToast()

    const truncate = (str, n) => {
        return (str.length > n) ? str.slice(0, n-1) + '...' : str;
    }

    return (
        <>
            <Card className="mt-8">
                <CardContent className="overflow-auto max-h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Chemin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {libraries?.map(( library, key ) => (
                                <TableRow key={key}>
                                    <TableCell className="px-4 py-1.5">{library.name}</TableCell>
                                    <TableCell className="px-4 py-1.5">{truncate(library.path, 55)}</TableCell>
                                    <TableCell className="px-4 py-1.5">
                                       <ConfirmDelete deleteHandler={removeLibrary} id={key} />
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
