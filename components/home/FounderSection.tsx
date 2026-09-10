import Link from "next/link";
import Container from "@/components/ui/Container";
import VillageMark from "@/components/ui/VillageMark";

export default function FounderSection() {
  return (
    <section className="py-16 md:py-20 bg-[#e9edde]">
      <Container>
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <VillageMark className="w-12 h-12 text-text-sage mb-6" />
            <p className="text-eyebrow uppercase tracking-[0.2em] text-text-sage font-semibold mb-5">
              Born from real life
            </p>
            <h2 className="text-h2 font-heading">
              The help exists.
              <br />
              <em className="text-text-sage">
                Finding it should
                <br />
                feel easier.
              </em>
            </h2>
          </div>
          <div className="text-sm md:text-base text-text-body leading-relaxed">
            <p className="mb-5">
              When our twins arrived, we saw how much difference the right
              support could make. A meal. A break. Someone who understood.
            </p>
            <p className="mb-7">
              Village grew from that experience: bringing the good people and
              services already out there closer to the families who need them.
            </p>
            <Link
              href="/about"
              className="text-sm font-medium text-text-sage underline underline-offset-4 decoration-sage/50"
            >
              The story behind Village <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
