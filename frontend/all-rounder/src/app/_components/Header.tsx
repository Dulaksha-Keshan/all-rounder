export default function Header(){
    return (
        <header className="bg-[var(--white)] border-b border-[var(--gray-200)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 w-full md:w-auto">
                <div className="flex items-center">
                    <img src="logo.png" alt="Logo" className="h-10 sm:h-12 lg:h-15 w-auto" />
                </div>
                <nav className="hidden md:flex items-center space-x-4 lg:space-x-7">
                    <a href="#" className="px-3 py-1.5 rounded-full bg-[var(--indigo-100)] text-[var(--indigo-700)] text-sm lg:text-base font-medium">Overview</a>
                    <a href="#" className="px-3 py-1.5 text-[var(--gray-600)] hover:text-[var(--gray-900)] text-sm lg:text-base">How it works</a>
                    <a href="#" className="px-3 py-1.5 text-[var(--gray-600)] hover:text-[var(--gray-900)] text-sm lg:text-base">For students</a>
                    <a href="#" className="px-3 py-1.5 text-[var(--gray-600)] hover:text-[var(--gray-900)] text-sm lg:text-base">For educators</a>
                </nav>
                </div>
                <div className="flex items-center space-x-4 lg:space-x-6 w-full md:w-auto justify-center">
                <button className="px-3 sm:px-4 py-2 text-[var(--gray-600)] hover:text-[var(--gray-900)] text-sm lg:text-base font-medium">Log in</button>
                <button className="px-4 sm:px-5 py-2 bg-[var(--indigo-600)] text-[var(--white)] rounded-lg text-sm lg:text-base font-medium hover:bg-[var(--indigo-700)]">
                    Sign up
                </button>
                </div>
            </div>
            </div>
      </header>
    )
}




