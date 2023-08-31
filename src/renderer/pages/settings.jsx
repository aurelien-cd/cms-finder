import React from 'react';
import { Button } from '../components/ui/button';
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../components/ui/card";

function Settings() {
  return (
    <>
      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
      </div>

      <div className="flex justify-center gap-8 py-8 my-8 bg-white border-gray-200 border-y">
        <Link to="/settings/libraries">
          <Card className='cursor-pointer group hover:border-slate-950'>
            <CardHeader>
                <div className="inline-flex p-4 mx-auto mb-4 bg-gray-100 rounded-full group-hover:bg-slate-950">
                  <Icon icon="tabler:database" className='w-8 h-8 text-gray-500 group-hover:text-white' />
                </div>
                <CardTitle>Librairies</CardTitle>
                <CardDescription>Gérer les librairies</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="fixed bottom-0 flex justify-end w-full gap-4 p-4 border-t border-slate-200">
        <Link to='/'>
            <Button variant="outline">
                <Icon icon="tabler:arrow-left" className='w-4 h-4 mr-2' />
                Retour
            </Button>
        </Link>
      </div>
    </>
  );
}

export default Settings;
