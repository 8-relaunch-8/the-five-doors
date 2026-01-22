import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function Home() {
  return (
    <main className="min-h-screen">
      
      <section className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue au Musée d&apos;Art
          </h1>
          <p className="text-xl mb-8 text-pink-100">
            Découvrez nos collections
          </p>
          <Button variant="secondary">
            Explorer les expositions
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Expositions en cours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Badge variant="success" className="mb-4">Disponible</Badge>
            <h3 className="text-xl font-bold mb-2">Art Moderne</h3>
            <p className="text-gray-600 mb-4">
              Une collection unique d&apos;art du 20ème siècle
            </p>
            <p className="text-sm text-gray-500">Du 15 Jan au 28 Fév 2026</p>
          </Card>

          <Card>
            <Badge variant="warning" className="mb-4">Bientôt complet</Badge>
            <h3 className="text-xl font-bold mb-2">Renaissance</h3>
            <p className="text-gray-600 mb-4">
              Les maîtres de la Renaissance italienne
            </p>
            <p className="text-sm text-gray-500">Du 1 Fév au 15 Mar 2026</p>
          </Card>

          <Card>
            <Badge variant="info" className="mb-4">Nouveau</Badge>
            <h3 className="text-xl font-bold mb-2">Art Contemporain</h3>
            <p className="text-gray-600 mb-4">
              Les artistes émergents de 2026
            </p>
            <p className="text-sm text-gray-500">Du 10 Fév au 30 Avr 2026</p>
          </Card>
        </div>
      </section>
    </main>
  )
}