import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute w-[500px] h-[500px] -top-40 -right-40 rounded-full
                      bg-primary/30 blur-3xl animate-pulse" />
        <div className="absolute w-[500px] h-[500px] -bottom-40 -left-40 rounded-full
                      bg-secondary/20 blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="container py-8 relative">
        {children}
      </main>
    </div>
  )
}

export default Layout