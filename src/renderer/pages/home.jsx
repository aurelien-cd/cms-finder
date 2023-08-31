import React from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import logo from '../../../assets/logo.svg';


function Home() {
  return (
    <>
      <div className="text-center mt-8">
        <img src={logo} className="inline" />
      </div>
      <div className="flex justify-center gap-8 py-8 my-8 bg-white border-gray-200 border-y">
        <Link to="/settings">
          <Card className='cursor-pointer group hover:border-slate-950'>
            <CardHeader>
                <div className="inline-flex p-4 mx-auto mb-4 bg-gray-100 rounded-full group-hover:bg-slate-950">
                  <Icon icon="tabler:settings" className='w-8 h-8 text-gray-500 group-hover:text-white' />
                </div>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Gérer les paramètres</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/search">
          <Card className='cursor-pointer group hover:border-slate-950'>
            <CardHeader>
                <div className="inline-flex p-4 mx-auto mb-4 bg-gray-100 rounded-full group-hover:bg-slate-950">
                  <Icon icon="tabler:search" className='w-8 h-8 text-gray-500 group-hover:text-white' />
                </div>
                <CardTitle>Recherche</CardTitle>
                <CardDescription>Rechercher des outils</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  );
}

export default Home;
