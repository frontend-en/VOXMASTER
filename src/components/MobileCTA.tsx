import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';

export function MobileCTA() {
  return (
    <div className="mobile-cta-stick md:hidden">
      <div className="flex gap-3">
        <Button 
          className="flex-1" 
          size="lg"
          onClick={() => {
            document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Пробный бесплатно
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="https://t.me/GardeRik" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  );
}