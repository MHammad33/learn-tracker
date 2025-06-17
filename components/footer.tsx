import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 md:py-0">
      <div className="px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Built with</span>
          <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
          <span>by Muhammad Hammad Afzal, for your learning journey</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Learn Tracker</span>
        </div>
      </div>
    </footer>
  )
} 