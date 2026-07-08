import FadeIn from '@/components/FadeIn'
import Avatar from '@/components/Avatar'

export default function FeaturedTestimonial() {
  return (
    <section aria-label="Featured testimonial" className="px-6 pb-2">
      <FadeIn>
        <figure className="max-w-2xl mx-auto rounded-xl bg-[#111]/80 border border-white/[0.06] p-5 md:p-7 border-l-2 border-l-amber-500/60">
          <blockquote className="text-sm md:text-base text-gray-300 italic leading-relaxed">
            &ldquo;The matching used to eat half my morning. Now the agent proposes the load plans
            and I approve them in one click — the repetitive part is gone, but the calls are still
            mine to make.&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <Avatar name="Placeholder Dispatcher" className="w-8 h-8" />
            <div>
              <p className="text-white font-medium text-sm">Placeholder Dispatcher</p>
              <p className="text-gray-500 text-sm">Dispatch Lead · Cross-border logistics client</p>
            </div>
          </figcaption>
        </figure>
      </FadeIn>
    </section>
  )
}
