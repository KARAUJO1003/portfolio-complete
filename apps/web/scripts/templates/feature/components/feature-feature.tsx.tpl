"use client";
import { useState } from "react";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { PageDescription,PageHeader,PageTitle } from "@/components/ds/page";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { create{{PASCAL}},delete{{PASCAL}},list{{PASCAL}},update{{PASCAL}} } from "../api/{{FEATURE}}-api";
import { {{PASCAL}}Form } from "../forms/{{FEATURE}}-form";
import { {{PASCAL}}Table } from "../tables/{{FEATURE}}-table";
import type { {{PASCAL}}Dto } from "../types/{{FEATURE}}";
import type { {{PASCAL}}FormValues } from "../schemas/{{FEATURE}}-schema";
export function {{PASCAL}}Feature(){const queryClient=useQueryClient();const query=useQuery({queryKey:["{{FEATURE}}"],queryFn:list{{PASCAL}}});const[editing,setEditing]=useState<{{PASCAL}}Dto|null>(null);const save=useMutation({mutationFn:(values:{{PASCAL}}FormValues)=>editing?update{{PASCAL}}(editing.id,values):create{{PASCAL}}(values),onSuccess:async()=>{await queryClient.invalidateQueries({queryKey:["{{FEATURE}}"]});setEditing(null);}});const remove=useMutation({mutationFn:delete{{PASCAL}},onSuccess:()=>queryClient.invalidateQueries({queryKey:["{{FEATURE}}"]})});return <><PageHeader><PageTitle>{{LABEL}}</PageTitle><PageDescription>CRUD gerado e integrado ao endpoint {{ENDPOINT}}.</PageDescription></PageHeader><Card><CardHeader><CardTitle>{editing?"Editar":"Novo"}</CardTitle></CardHeader><CardContent><{{PASCAL}}Form item={editing} pending={save.isPending} onSubmit={async(values)=>{await save.mutateAsync(values);}} /></CardContent></Card><{{PASCAL}}Table data={query.data??[]} onEdit={setEditing} onDelete={(id)=>remove.mutate(id)} /></>;}
