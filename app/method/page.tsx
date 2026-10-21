import Link from "next/link";

const steps = [
  { number: "01", title: "Original forecast", body: "The raw forecast is the rainfall estimate from the archived Open-Meteo model output included in this project. The supplied notes say it is not NCUM." },
  { number: "02", title: "Adjustment methods", body: "The metrics file compares global quantile mapping, regime quantile mapping, a gradient-boosting model (GBM), and a hybrid method. These are evaluated outputs already present in the sample data; this dashboard does not train or alter a model." },
  { number: "03", title: "Compare with observations", body: "Forecast values are compared with observed rainfall for the nearest 0.25° IMD grid cell. The district table and time-series charts let you compare raw, corrected, and observed values in millimetres." },
  { number: "04", title: "Rainfall probabilities", body: "The supplied sample includes chances for heavy rain (threshold 64.5 mm) and very heavy rain (threshold 115.6 mm). These are probabilities from the dataset, not live warnings." },
];

export default function MethodPage() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8"><div className="mx-auto max-w-4xl">
    <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">← Back to dashboard</Link>
    <div className="mt-6 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">How it works</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">From forecast to comparison</h1><p className="mt-4 text-base leading-7 text-slate-600">This project makes existing rainfall forecast samples easier to inspect. It presents the values and evaluation results provided in the repository; it does not generate a new forecast.</p></div>
    <div className="mt-8 space-y-4">{steps.map((step) => <section key={step.number} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:gap-6 sm:p-6"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">{step.number}</div><div><h2 className="text-lg font-semibold">{step.title}</h2><p className="mt-2 leading-7 text-slate-600">{step.body}</p></div></section>)}</div>
    <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold text-amber-950">Read the results carefully</h2><p className="mt-2 text-sm leading-6 text-amber-900">The pilot covers 25 locations. The supplied notes say the regime label is simplified, based on five central-India locations, and that very-heavy-rain events are relatively few in the test period. Treat those scores with caution; Fractions Skill Score (FSS) was not computed.</p></section>
    <div className="mt-6"><Link href="/verification" className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">View verification metrics →</Link></div>
  </div></main>;
}
