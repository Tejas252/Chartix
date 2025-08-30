import Breadcrumbs from "@/components/breadcrumbs"
import LeftComposer from "@/components/left-composer"
import RightWorkspace from "@/components/right-workspace"
import ShareButton from "@/components/share-button"

// Simulated DB fetch for breadcrumbs. Replace with real DB logic.
async function getBreadcrumbs(chartId: string) {
  return [
    { label: "Home", href: "/" },
    { label: "Your chart", href: `/charts/${chartId}` },
  ]
}

export default async function Page({ params }: { params: { id: string } }) {
  const crumbs = await getBreadcrumbs(params.id)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <Breadcrumbs items={crumbs} />
          <ShareButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        {/* 30/70 split on large screens */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
          <section className="lg:col-span-3">
            <LeftComposer />
          </section>

          <section className="lg:col-span-7">
            <RightWorkspace />
          </section>
        </div>
      </main>
    </div>
  )
}
