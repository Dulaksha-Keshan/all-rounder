"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const SearchBar = () => {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

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
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full md:w-auto flex items-center gap-3 text-xs rounded-full ring-1 ring-[#DCD0FF] px-4 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#8387CC] transition-all"
        >
            <Search size={16} className="text-[#8387CC]" />
            <input
                type="text"
                name="search"
                onChange={handleChange}
                placeholder="Search..."
                className="w-[200px] py-2.5 bg-transparent outline-none text-[#34365C] placeholder:text-[#8387CC]/60"
            />
        </form>
    );
};

export default SearchBar;
