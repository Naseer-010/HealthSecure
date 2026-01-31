'use client'

import { Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/language-context'
import { languages, type Language } from '@/lib/i18n/translations'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3 hover:bg-accent/50 transition-colors duration-200"
        >
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {languages[language].nativeName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <AnimatePresence>
          {(Object.keys(languages) as Language[]).map((lang) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
            >
              <DropdownMenuItem
                onClick={() => setLanguage(lang)}
                className={cn(
                  'cursor-pointer transition-colors duration-150',
                  language === lang && 'bg-accent text-accent-foreground font-medium'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{languages[lang].nativeName}</span>
                  {language === lang && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </div>
              </DropdownMenuItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
