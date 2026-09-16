/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as LoginRouteImport } from './routes/login'
import { Route as ContatoRouteImport } from './routes/contato'
import { Route as BuscarRouteImport } from './routes/buscar'
import { Route as BrancoRouteImport } from './routes/branco'
import { Route as IndexRouteImport } from './routes/index'
import { Route as CategoriaSlugRouteImport } from './routes/categoria.$slug'
import { Route as ArtigoSlugRouteImport } from './routes/artigo.$slug'
import { Route as AdminLoginRouteImport } from './routes/admin/login'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const ContatoRoute = ContatoRouteImport.update({ id: '/contato', path: '/contato', getParentRoute: () => rootRouteImport } as any)
const BuscarRoute = BuscarRouteImport.update({ id: '/buscar', path: '/buscar', getParentRoute: () => rootRouteImport } as any)
const BrancoRoute = BrancoRouteImport.update({ id: '/branco', path: '/branco', getParentRoute: () => rootRouteImport } as any)
const LoginRoute = LoginRouteImport.update({ id: '/login', path: '/login', getParentRoute: () => rootRouteImport } as any)
const AdminLoginRoute = AdminLoginRouteImport.update({ id: '/admin/login', path: '/admin/login', getParentRoute: () => rootRouteImport } as any)
const ArtigoSlugRoute = ArtigoSlugRouteImport.update({ id: '/artigo/$slug', path: '/artigo/$slug', getParentRoute: () => rootRouteImport } as any)
const CategoriaSlugRoute = CategoriaSlugRouteImport.update({ id: '/categoria/$slug', path: '/categoria/$slug', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath { '/': typeof IndexRoute; '/contato': typeof ContatoRoute; '/buscar': typeof BuscarRoute; '/branco': typeof BrancoRoute; '/login': typeof LoginRoute; '/admin/login': typeof AdminLoginRoute; '/artigo/$slug': typeof ArtigoSlugRoute; '/categoria/$slug': typeof CategoriaSlugRoute }
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById extends FileRoutesByFullPath { __root__: typeof rootRouteImport }
export interface FileRouteTypes { fileRoutesByFullPath: FileRoutesByFullPath; fullPaths: keyof FileRoutesByFullPath; fileRoutesByTo: FileRoutesByTo; to: keyof FileRoutesByTo; id: keyof FileRoutesById; fileRoutesById: FileRoutesById }
export interface RootRouteChildren { IndexRoute: typeof IndexRoute; ContatoRoute: typeof ContatoRoute; BuscarRoute: typeof BuscarRoute; BrancoRoute: typeof BrancoRoute; LoginRoute: typeof LoginRoute; AdminLoginRoute: typeof AdminLoginRoute; ArtigoSlugRoute: typeof ArtigoSlugRoute; CategoriaSlugRoute: typeof CategoriaSlugRoute }
const rootRouteChildren: RootRouteChildren = { IndexRoute, ContatoRoute, BuscarRoute, BrancoRoute, LoginRoute, AdminLoginRoute, ArtigoSlugRoute, CategoriaSlugRoute }
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-router' { interface FileRoutesByPath { '/contato': { id: '/contato'; path: '/contato'; fullPath: '/contato'; preLoaderRoute: typeof ContatoRouteImport; parentRoute: typeof rootRouteImport } } }
declare module '@tanstack/react-start' { interface Register { ssr: true; router: Awaited<ReturnType<typeof getRouter>>; config: Awaited<ReturnType<typeof startInstance.getOptions>> } }
