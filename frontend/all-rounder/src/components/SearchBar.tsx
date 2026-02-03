"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchBar = () => {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const value = formData.get("search") as string;

        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        router.push(`${window.location.pathname}?${params}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2"
        >
            <Image src="/search.png" alt="Search" width={14} height={14} />
            <input
                type="text"
                name="search"
                placeholder="Search..."
                className="w-[200px] p-2 bg-transparent outline-none"
            />
        </form>
    );
};

export default SearchBar;
