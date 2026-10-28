import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function Home() {
  return (
    <main className="min-h-screen">
      
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to the Art Museum
          </h1>
          <p className="text-xl mb-8 text-pink-100">
            Discover our collections
          </p>
          <Button variant="secondary">
            Explore the exhibitions
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Current exhibitions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Badge variant="success" className="mb-4">Available</Badge>
            <h3 className="text-xl font-bold mb-2">Modern Art</h3>
            <p className="text-gray-600 mb-4">
              A unique collection of 20th-century art
            </p>
            <p className="text-sm text-gray-500">Jan 15 – Feb 28, 2026</p>
          </Card>

          <Card>
            <Badge variant="warning" className="mb-4">Almost full</Badge>
            <h3 className="text-xl font-bold mb-2">Renaissance</h3>
            <p className="text-gray-600 mb-4">
              Masters of the Italian Renaissance
            </p>
            <p className="text-sm text-gray-500">Feb 1 – Mar 15, 2026</p>
          </Card>

          <Card>
            <Badge variant="info" className="mb-4">New</Badge>
            <h3 className="text-xl font-bold mb-2">Contemporary Art</h3>
            <p className="text-gray-600 mb-4">
              Emerging artists of 2026
            </p>
            <p className="text-sm text-gray-500">Feb 10 – Apr 30, 2026</p>
          </Card>
        </div>
      </section>
    </main>
  )
}