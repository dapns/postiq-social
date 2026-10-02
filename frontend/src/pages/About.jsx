import { ArrowRight, FileText, PanelsTopLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Start with a draft",
    description: "Bring a note, a rough paragraph, or an attachment into the composer.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Find the shape of it",
    description: "Preview an AI-generated version and adjust the copy before it is added.",
  },
  {
    number: "03",
    icon: PanelsTopLeft,
    title: "Review in your feed",
    description: "See the result alongside your posts and decide what is ready to share.",
  },
];

const About = () => (
  <div className="mx-auto w-full max-w-6xl text-left text-slate-900">
    <section className="grid gap-10 border-b border-slate-200 py-10 sm:py-14 lg:min-h-[430px] lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14">
      <div className="max-w-xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
          About the workspace
        </p>
        <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
          PostIQ Social
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
          A calmer place to turn rough ideas into thoughtful posts. Start with what you have,
          shape the words, then review the result in your feed.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            Open your feed <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <span className="text-sm text-slate-500">Ideas in. Better posts out.</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg border border-slate-200 bg-white shadow-[0_18px_50px_rgba(30,55,45,0.10)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-700" />
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">Post composer</p>
          </div>
          <span className="text-xs font-medium text-slate-400">A simple workflow</span>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-[0.85fr_1.15fr] sm:gap-5 sm:p-6">
          <div className="border-l-2 border-slate-200 pl-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Your starting point</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              A few notes, a useful link, or the first paragraph of an idea.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">
              <FileText size={15} aria-hidden="true" /> Draft material
            </div>
          </div>
          <div className="border-l-2 border-emerald-700 pl-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
              <Sparkles size={15} aria-hidden="true" /> Post preview
            </div>
            <p className="mt-3 text-base font-semibold leading-6 text-slate-900">
              Give your next idea a clearer first draft.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Refine the message, keep your voice, and review before sharing.
            </p>
            <div className="mt-5 h-px w-full bg-slate-200" />
            <p className="mt-3 text-xs text-slate-500">Ready for your review</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-10 sm:py-14" aria-labelledby="about-steps-title">
      <div className="mb-8 max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">A useful rhythm</p>
        <h2 id="about-steps-title" className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
          From first note to final review
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3 md:gap-6">
        {steps.map(({ number, icon: Icon, title, description }) => (
          <article key={number} className="border-t border-slate-300 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tabular-nums text-slate-400">{number}</span>
              <Icon size={19} strokeWidth={1.8} className="text-emerald-800" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default About;