import MessageCircle from "lucide-react/dist/esm/icons/message-circle";
import Phone from "lucide-react/dist/esm/icons/phone";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down";
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { VideoFrame } from './VideoFrame';
import { BulletItem } from './BulletItem';

export function Hero() {
  return (
    <section className="hero-v2 bg-background">
      <div className="hero-container">
        <div className="hero-grid">
          
          {/* Left Column - Copy */}
          <div className="space-y-6 lg:space-y-10">
            
            {/* Eyebrow Badge */}
            <Badge 
              variant="secondary" 
              className="inline-flex px-4 py-2 bg-secondary/20 text-popover-foreground dark:text-secondary-foreground border-secondary  rounded-full"
            >
              Пробный бесплатно • 1:1 менторство
            </Badge>
            
            {/* H1 Title */}
            <h1 className="text-[32px] sm:text-[38px] lg:text-[42px] leading-[1.05] font-medium hero-text-constraint text-foreground">
              Простыми словами о сложном вокале
            </h1>
            
            {/* Lead */}
            <p className="text-[17px] leading-[1.7] text-muted-foreground hero-text-constraint">
              Без риска: пробный урок бесплатный. На нем мы аккуратно оценим стартовую точку и цели, подберём план и формат работы.
              <br /><br />
              Если формат не ваш — честно порекомендую, как двигаться дальше.
              Без «магии» и тумана. Я ясно объясняю, показываю на примерах и даю упражнения, которые действительно двигают вперёд.
            </p>
            
            {/* Mobile Video - shows only on mobile between lead and bullets */}
            <div className="lg:hidden">
              <VideoFrame />
            </div>
            
            {/* Bullet Chips */}
            <div className="bullet-grid">
              <BulletItem>Индивидуально онлайн</BulletItem>
              <BulletItem>План между уроками</BulletItem>
              <BulletItem>Гибкий график</BulletItem>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <Button 
                size="lg" 
                className="w-full sm:w-auto btn-micro min-h-[44px]"
                onClick={() => {
                  document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Записаться на пробный
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg"
                className="w-full sm:w-auto border border-border btn-micro min-h-[44px]"
                onClick={() => {
                  document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Связаться в Telegram
              </Button>
              
              <button 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 text-left w-full sm:w-auto underline underline-offset-4 min-h-[44px] flex items-center"
                onClick={() => {
                  document.getElementById('price')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <ArrowDown className="mr-1 h-3 w-3" />
                Смотреть стоимость
              </button>
            </div>
            
            {/* Trust Line */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              10+ лет практики
            </p>
            
          </div>
          
          {/* Right Column - Video (Desktop only) */}
          <div className="hidden lg:block">
            <VideoFrame />
          </div>
          
        </div>
      </div>
    </section>
  );
}