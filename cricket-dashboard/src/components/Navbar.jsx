function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-sm font-black text-white">
            CR
          </div>
          <div>
            <p className="text-base font-bold text-slate-950">Cricket Analytics</p>
            <p className="text-xs font-medium text-slate-500">Performance dashboard</p>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {["Overview", "Matches", "Teams", "Players"].map((item) => (
            <a
              key={item}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              href="#"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
