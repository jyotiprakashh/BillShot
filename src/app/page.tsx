import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <main className="w-full">
      <section className="p-8 h-[90vh] md:w-2/3 mx-auto text-center w-full flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-4 md:text-6xl">
          Create and send bills
        </h2>
        <p className="opacity-70 mb-4 text-sm md:text-lg leading-loose">
          <span className="font-bold ">BillShot</span> is an online invoicing software that helps you craft and
          print <span className="font-bold ">professional invoices for your customers</span> for free! Keep your
          business and clients with one invoicing software.
        </p>

        <Button asChild size="lg" className="w-full md:w-[200px]">
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </section>
    </main>
  );
}
