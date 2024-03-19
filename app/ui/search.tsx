'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce'

export default function Search({ placeholder }: { placeholder: string }) {
const search = useSearchParams(); //this hook will fetch the queryParams as a string from url
const  pathname = usePathname(); // This hook will fetch the params from url
const {replace}  = useRouter(); // this is  used to replace the current page with new one.(push for add new query params)
const params = new URLSearchParams(search) // This is browser default function to split the string into key and values
  const  handleSearch = useDebouncedCallback((value:string)=>{
    params.set('page', '1');
    if(value.trim()!==''){
      params.has('query')? // get('key') , getAll('key'), set('key','value'), delete('key'), has('key') these are default method to do logical operations
        params.set('query', value):params.append('query', value);
      }else{
        params.delete('query')
      }
      replace(pathname + "?"+ params.toString())
},500)

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        defaultValue={params.get('search')?.toString()}
        onChange={e=>handleSearch(e.target.value)}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
