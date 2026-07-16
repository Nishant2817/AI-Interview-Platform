export default function Companies() {
  const companies = [
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Apple", logo: "/logos/apple.svg" },
    { name: "Adobe", logo: "/logos/adobe.svg" },
    { name: "Flipkart", logo: "/logos/flipkart.svg" },
  ];

  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="text-center">
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
            Top Companies
          </span>

          <h2 className="mt-6 text-5xl font-bold">
            Prepare for 120+ Companies
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-400">
            Practice company-specific interview questions, AI mock interviews,
            and personalized feedback for leading product and service-based
            companies.
          </p>
        </div>

        {/* Companies Grid */}

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {companies.map((company) => (
            <div
              key={company.name}
              className="group rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-400 hover:bg-white/10"
            >
              <div className="flex justify-center">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-6 text-center text-lg font-semibold text-white">
                {company.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
